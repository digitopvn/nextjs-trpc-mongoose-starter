# ===================================
#       PHASE 1 - BUILDER
# ===================================

FROM node:18-alpine AS BUILD_IMAGE

# increase max memory for building docker
ENV NODE_OPTIONS=--max_old_space_size=8192
ENV HOME=/home/node
ENV USER=node

# Because ALPINE base image don't have python pre-installed 
RUN apk update && apk add bash curl python3 make g++ && rm -rf /var/cache/apk/*

# Use PNPM instead of NPM
RUN npm i pnpm --location=global

WORKDIR /usr/app

# Persist the cache of Next.js
VOLUME /usr/app/.next/cache

# COPY package.json .
# COPY turbo.json .
# COPY .yarnrc.yml .
# COPY .yarn ./.yarn
# COPY yarn.lock .

COPY ./package.json ./package.json

# packages
# COPY ./packages ./packages

# SNIPPET "GIÀU SANG" -> start from scratch !
RUN rm -rf ./node_modules && rm -rf ./package-lock.json && rm -rf ./**/node_modules && rm -rf ./**/.turbo

# install the packages & dependencies
RUN pnpm i

# apps
COPY . .
# COPY ./deployment/.env.dev ./.env

# packages
# COPY ./packages ./packages

# RUN yarn add turbo

# Prisma
RUN pnpm prisma generate

# Start building
RUN pnpm build

# Remove cache directory of "turbo" -> lighter docker image:
# RUN rm -rf ./node_modules/.cache

# install node-prune (https://github.com/tj/node-prune)
# RUN curl -sf https://gobinaries.com/tj/node-prune | sh

# run node-prune to scan for other unused node_modules packages
# RUN /usr/local/bin/node-prune

# ===================================
#       PHASE 2 - RUNNER
# ===================================

FROM node:18-alpine AS RUNNER

WORKDIR /usr/app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Only copy build files & neccessary files to run:
COPY --from=BUILD_IMAGE --chown=nextjs:nodejs /usr/app/package.json .
COPY --from=BUILD_IMAGE --chown=nextjs:nodejs /usr/app/next.config.mjs .
COPY --from=BUILD_IMAGE --chown=nextjs:nodejs /usr/app/.next/standalone .
COPY --from=BUILD_IMAGE --chown=nextjs:nodejs /usr/app/.next/static ./.next/static
COPY --from=BUILD_IMAGE --chown=nextjs:nodejs /usr/app/public ./public
COPY --from=BUILD_IMAGE --chown=nextjs:nodejs /usr/app/node_modules ./node_modules
COPY --from=BUILD_IMAGE --chown=nextjs:nodejs /usr/app/src/env.mjs ./src/env.mjs
COPY --from=BUILD_IMAGE --chown=nextjs:nodejs /usr/app/prisma ./prisma
# COPY --from=BUILD_IMAGE --chown=nextjs:nodejs /usr/app/next-i18next.config.js .
# COPY --from=BUILD_IMAGE --chown=nextjs:nodejs /usr/app/.env .

EXPOSE 3000 80

CMD npm run start

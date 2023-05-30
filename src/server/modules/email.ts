import type { MailDataRequired } from "@sendgrid/mail";
import SendGrid from "@sendgrid/mail";
import { z } from "zod";

import { env } from "@/env.mjs";
import { respondFailure, respondSuccess } from "@/plugins/response-utils";

export const SendEmailSchema = z.object({
	recipients: z.array(
		z.object({
			name: z.string().optional().describe(`Name of the recipient.`),
			email: z.string().describe(`Email of the recipient.`),
		})
	),
	subject: z.string().describe(`Subject of the email.`),
	content: z.string().describe(`Body content of the email, support HTML/CSS elements.`),
});
export type SendEmailParams = z.infer<typeof SendEmailSchema>;

// set API_KEY
if (env.SENDGRID_API_KEY) SendGrid.setApiKey(env.SENDGRID_API_KEY);

export const sendEmail = async (options: SendEmailParams) => {
	const { recipients, subject, content: html } = options;

	return Promise.all(
		recipients.map(async ({ name, email }) => {
			try {
				const data: MailDataRequired = {
					personalizations: [{ to: { name, email }, from: { name: "Diginext System", email: "noreply@diginext.site" } }],
					to: email,
					from: "noreply@diginext.site", // Use the email address or domain you verified above
					subject,
					html,
				};
				const [result] = await SendGrid.send(data);
				return respondSuccess({ data: result.body, msg: `Sent email to ${email} successfully.` });
			} catch (e: any) {
				return respondFailure(`Failed to send email to "${email}": ${e}.`);
			}
		})
	);
};

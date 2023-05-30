export const isNumeric = (num: any) => (typeof num === "number" || (typeof num === "string" && num.trim() !== "")) && !Number.isNaN(num as number);

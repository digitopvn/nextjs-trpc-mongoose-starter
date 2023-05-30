import { randomBytes } from "crypto";

export default function generateRandomString(length: number = 32): string {
	const buffer = randomBytes(length);
	const array = new Uint32Array(buffer.buffer);
	const hexString = Array.from(array, (dec) => `0${dec.toString(16)}`.substring(-2)).join("");
	return hexString.slice(0, length);
}

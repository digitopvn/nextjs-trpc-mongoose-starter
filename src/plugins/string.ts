export function contains(text: string, words: string[]): boolean {
	for (let i = 0; i < words.length; i++) {
		const word = words[i];
		if (word && !text.includes(word)) {
			return false;
		}
	}
	return true;
}

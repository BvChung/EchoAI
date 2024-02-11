export function extractNumber(input: string): number {
	const match = input.match(/\d+/); // Matches any sequence of digits

	return match ? parseInt(match[0]) : 0;
}

export function extractScoreAndAnalysis(input: string): {
	score: number;
	analysis: string;
} {
	const scoreRegex = /Score:\s*(\d+)/;
	const analysisRegex = /\*\*Analysis:\*\*\s*(.*)/;

	const scoreMatch = input.match(scoreRegex);
	const analysisMatch = input.match(analysisRegex);

	if (!scoreMatch || !analysisMatch) {
		return { score: 0, analysis: "" };
	}

	const score = parseInt(scoreMatch[1]);
	const analysis = analysisMatch[1];
	return { score, analysis };
}

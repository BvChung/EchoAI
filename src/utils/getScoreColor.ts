export function getColor(score: number) {
	if (score < 0.5) {
		return "text-red-700";
	} else if (score < 0.7) {
		return "text-yellow-600";
	} else {
		return "text-emerald-500";
	}
}

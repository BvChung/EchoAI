export function getColor(score: number) {
	if (score <= 0.3) {
		return "text-red-700";
	} else if (score <= 0.6) {
		return "text-yellow-600";
	} else {
		return "text-emerald-500";
	}
}

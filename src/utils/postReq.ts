import { toast } from "react-toastify";

async function getTranscript(
	file: File,
	setIsLoading: (value: boolean) => void
) {
	const sendForm = new FormData();
	sendForm.append("file", file);

	try {
		const res = await fetch("http://127.0.0.1:8000/transcribe", {
			method: "POST",
			body: sendForm,
		});

		return await res.json();
	} catch (error) {
		setIsLoading(false);
		toast.error("Error transcribing file");
	}
}

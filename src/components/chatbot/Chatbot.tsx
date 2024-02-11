import { useEffect, useState } from "react";
import { createConversation } from "../../../firebase/firebaseLLM";
import { LLMMessage } from "../../../firebase/firebaseLLM";
import { addMessage, createMessage } from "../../../firebase/firebaseLLM";
import { useAuth } from "../../../firebase/auth";
import { ArrowUpIcon } from "@heroicons/react/20/solid";

export default function Chatbot() {
	const [conversation, setConversation] = useState<LLMMessage[]>([]);
	const [userInput, setUserInput] = useState("");
	const { authUser } = useAuth();

	useEffect(() => {
		const unsubscribe = createConversation(setConversation);

		return () => {
			unsubscribe();
		};
	}, []);

	function handleSubmit() {
		if (authUser) {
			// addMessage(authUser.uid, userInput);
			createMessage();
			setUserInput("");
		}
	}

	console.log(conversation);

	return (
		<div className="flex-1 flex flex-col justify-between border border-border shadow-md rounded-lg bg-chatBG overflow-auto max-h-[50rem]">
			<div className=""></div>
			<div className="mt-4">
				<div className="flex relative mt-2 rounded-md shadow-sm">
					<input
						type="text"
						name="userinput"
						id="userinput"
						className="block w-full rounded-md py-1.5 px-3 bg-gray-800 border border-inputBorder   placeholder:text-gray-400 focus:ring-1 focus:outline-none focus:ring-inputHover sm:text-sm sm:leading-6 transition-colors"
						placeholder="you@example.com"
						value={userInput}
						onChange={(e) => setUserInput(e.target.value)}
					/>
					<button onClick={handleSubmit} className="p-2 rounded-md bg-gray-600">
						<ArrowUpIcon className="h-5 w-5" />
					</button>
				</div>
			</div>
		</div>
	);
}

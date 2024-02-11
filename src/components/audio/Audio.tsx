// import React, { useEffect, useState } from "react";
// import firebase from "firebase/app";
// import "firebase/storage";

// export default function Audio() {
// 	const [audioUrl, setAudioUrl] = useState<string | null>(null);

// 	useEffect(() => {
// 		// Initialize Firebase
// 		const firebaseConfig = {
// 			// Your config here
// 		};
// 		if (!firebase.apps.length) {
// 			firebase.initializeApp(firebaseConfig);
// 		}

// 		// Get a reference to the storage service
// 		const storage = firebase.storage();

// 		// Create a storage reference from our storage service
// 		const storageRef = storage.ref();

// 		// Create a child reference
// 		const audioRef = storageRef.child("audio/myAudio.mp3"); // use your file path here

// 		// Get the download URL
// 		audioRef.getDownloadURL().then((url) => {
// 			setAudioUrl(url);
// 		});
// 	}, []);

// 	return (
// 		<div>
// 			{audioUrl && (
// 				<audio controls>
// 					<source src={audioUrl} type="audio/mpeg" />
// 					Your browser does not support the audio element.
// 				</audio>
// 			)}
// 		</div>
// 	);
// }

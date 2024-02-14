## System Design 

![System Design Image](https://github.com/BvChung/EchoAI/blob/main/sysdesign/sysdesign.png)

## Inspiration
EchoAI was born from the recognition of the crucial role public speaking plays in effectively communicating ideas, opinions, and passions to an audience. It addresses the challenge of obtaining feedback by eliminating the need for multiple individuals by leveraging audio recordings instead. Whether it's an interview, pitching a proposal, or delivering a speech, the ability to articulate ones thoughts coherently distinguishes proficient speakers from those who struggle. Through prompt analysis, EchoAI empowers individuals to enhance their speaking skills. Effective public speaking involves more than just reciting a script; it requires the ability to engage dynamically and captivate its listeners.
## What it does
EchoAI transcribes audio recordings and utilizes AI prompt engineering to cater LLM analyzations based on the type of speaking event that is occurring in order to improve content. Google Gemini will assign a numeric representation of how well the recorded speech performs and provide feedback on what to improve on.
## How we built it
- Nextjs for the frontend and backend
- Firebase for a database and authentication
- Google Cloud Storage to host and fetch audio files
- Google Gemini LLM 
- AssemblyAI for audio transcription

## Challenges we ran into
It was my first time using this many Google Cloud based applications and incorporating AI models. Lots of documentation to read and designing how the overall flow of data should move.

## Accomplishments that we're proud of
Proud of being able to figure out how to incorporate these technologies in a small time period.

## What we learned
In such a small time period, a balance has to be made in developing both a good user interface and functioning backend with AI and cloud technologies.

## What's next for EchoAI
Ability to compare / contrast recordings to determine what individuals did well on, ability to asynchronously que up recordings to be transcribed, and incorporating NLP (natural language processing) to detect emotion with focus on helping individuals produce more passionate forms of speaking.

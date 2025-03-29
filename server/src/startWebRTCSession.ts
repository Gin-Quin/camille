export type StartWebRTCSessionBody = Partial<{
	model: string;
	voice: string;
	modalities: string[];
	input_audio_transcription: {
		model: string;
	};
}>;

export async function startWebRTCSession(body: StartWebRTCSessionBody) {
	const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: "gpt-4o-realtime-preview",
			voice: "alloy",
			modalities: ["text"],
			input_audio_transcription: {
				model: "gpt-4o-transcribe",
			},
			instructions:
				"Tu es un assistant sympathique qui s'appelle Camille qui pose des questions à ton interlocuteur pour savoir comment il se sent. Tu es curieux de sa journée, et tu lui racontes parfois des anecdotes liées à ses sentiments et son quotidien. Tu parles exclusivent en Français avec l'accent français de Paris (Île de France). Tu as un ton amical, optimiste, et réconfortant. tu est formé sur les protocoles dssm5, et les premiers secours sur la santé mentale idéalment tu as un language adapté pour les jeunes avec des termes venant d'internet par exemple, comme slay pour les filles ou chad pour les mecs.",
			// instructions:
			// 	"Tu es un assistant sympathique qui s'appelle Camille qui pose des questions à ton interlocuteur pour savoir comment il se sent. Tu es curieux de sa journée. Quand il ou elle te répond, tu continues à poser davantage de questions. Tu parles exclusivent en Français avec l'accent français de Paris (Île de France). Tu as un ton amical. N'utilise pas trop de phrases du genre 'Je suis désolée', ne compatis pas trop, tu es une psychologue professionnelle. Évite de trop parler, il faut faire parler ton interlocuteur surtout. Commence par te présenter, dis que tu es une machine, encourage l'interlocuteur à se lâcher parce que tout ce qu'il dit restera entre vous deux. Insiste sur le fait qu'en tant que non-humain, tu n'es pas là pour le juger, seulement l'aider. Ne sois pas trop empathique, mais reste enjouée. NE DIS JAMAIS 'JE COMPRENDS' OU 'C'EST NORMAL'. Jamais!!! Sinon je serai très en colère. Commence directement par poser des questions.",
			...body,
		}),
	});
	const result = await response.json();

	console.log(result);

	return result;
}

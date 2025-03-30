<script lang="ts">
	import { PUBLIC_API_URL } from "$env/static/public"
	import { startWebRTCSession } from "./startWebRTCSession"

    let showKeyboard = $state(false);
	let isRecording = $state(false)
	let connection: RTCPeerConnection | null = null
	let channel: RTCDataChannel | null = null
	let audioElement: HTMLAudioElement

	const messageObject = $state<Record<string, { source: number; message: string }>>({})
	const messages = $derived(Object.values(messageObject))

	$inspect(messageObject)
	$inspect(messages)

	async function startRecording() {
		try {
			const sessionResponse = await startWebRTCSession()
			const EPHEMERAL_KEY = sessionResponse.client_secret.value as string

			// Create a peer connection
			connection = new RTCPeerConnection()

			// Set up to play remote audio from the model
			connection.ontrack = e => {
				audioElement.srcObject = e.streams[0]
				audioElement.play()
			}

			// Add local audio track for microphone input
			const ms = await navigator.mediaDevices.getUserMedia({ audio: true })
			connection.addTrack(ms.getTracks()[0])

			// Set up data channel for sending and receiving events
			channel = connection.createDataChannel("oai-events")
			channel.addEventListener("message", event => {
				const response = JSON.parse(event.data)
				if (response.error) {
					console.error("Server error:", response.error)
					return
				}

				console.log("Response:", response.type, response)

				switch (response.type) {
					// case "conversation.item.input_audio_transcription.delta": {
					// 	console.log("Audio transcription delta:", response.delta)
					// 	break
					// }

					// case "input_audio_buffer.speech_started": {
					case "conversation.item.input_audio_transcription.delta": {
						if (!messageObject[response.item_id]) {
							console.warn("User starts talking!", response.item_id)
							messageObject[response.item_id] = {
								source: 0,
								message: "",
							}
						}
						break
					}

					case "conversation.item.input_audio_transcription.completed": {
						const transcript = response.transcript as string
						console.warn("User talks at item", response.item_id)
						messageObject[response.item_id].message = transcript
						// fetch(`${PUBLIC_API_URL}/conversation`, {
						// 	method: "POST",
						// 	body: JSON.stringify({ transcript, source: "user" }),
						// })
						break
					}
					// case "response.created": {
					// 	messageObject[response.item_id] = {
					// 		source: 1,
					// 		message: "",
					// 	}
					// 	console.warn("AI starts talking at index")
					// 	break
					// }
					case "response.audio_transcript.delta": {
						const { delta, item_id } = response
						setTimeout(() => {
							if (!messageObject[item_id]) {
								messageObject[item_id] = {
									source: 1,
									message: "",
								}
								// TODO: stream text
								console.warn("Response starts!", response.item_id)
							}
						}, 1_000)
						break
					}
					case "response.audio_transcript.done": {
						console.warn("AI has talked")
						const transcript = response.transcript as string
						messageObject[response.item_id] ??= {
							source: 1,
							message: "",
						}
						messageObject[response.item_id].message = transcript
						// fetch(`${PUBLIC_API_URL}/conversation`, {
						// 	method: "POST",
						// 	body: JSON.stringify({ transcript, source: "ai" }),
						// })
						break
					}
				}
			})

			// Start the session using SDP
			const offer = await connection.createOffer()
			await connection.setLocalDescription(offer)

			const baseUrl = "https://api.openai.com/v1/realtime"
			const model = "gpt-4o-mini-realtime-preview"
			const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
				method: "POST",
				body: offer.sdp,
				headers: {
					Authorization: `Bearer ${EPHEMERAL_KEY}`,
					"Content-Type": "application/sdp",
				},
			})

			const sdp = await sdpResponse.text()

			console.log("SDP:", sdp)

			const answer = {
				type: "answer",
				sdp,
			} as RTCSessionDescriptionInit

			await connection.setRemoteDescription(answer)

			isRecording = true
		} catch (error) {
			console.error("Error starting WebRTC session:", error)
		}
	}

	function stopRecording() {
		if (connection) {
			connection.close()
			connection = null
		}
		if (channel) {
			channel.close()
			channel = null
		}
		isRecording = false
	}
</script>

<section class="chatbot">
	<div class="chat-container">
		<p class="catchline">Commence à parler, je suis là pour toi</p>
		<div class="messages-container">
			<ul class="messages">
				{#each messages as { source, message }}
					{#if message}
						<li class="message {source === 0 ? 'user-message' : 'bot-message'}">
							<p class="content">{message}</p>
						</li>
					{/if}
				{/each}
			</ul>
		</div>
		<div class="vocal">
			<button
				class="open-mic"
				aria-label="Ouvre le micro"
				class:recording={isRecording}
				onclick={isRecording ? stopRecording : startRecording}
			>
				<i class="fa-solid fa-microphone"></i>
			</button>
		</div>
	</div>
	<div class="write">
		<button class="open-keyboard" onclick={() => (showKeyboard = !showKeyboard)} aria-label="Ouvre le clavier">
			<i class="fa-solid fa-keyboard"></i>
		</button>
		{#if showKeyboard}
			<div class="keyboard-input">
				<input type="text" placeholder="Écrivez votre message..." />
				<button
					class="send-message"
					aria-label="Envoyer le message"
					onclick={() => (showKeyboard = !showKeyboard)}
				>
					<i class="fa-solid fa-paper-plane"></i>
				</button>
			</div>
		{/if}
	</div>

	<audio bind:this={audioElement}></audio>
</section>

<style>
	.chatbot {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		position: relative;

		.chat-container {
			display: flex;
			flex-direction: column;
			height: 100%;
			width: 100%;
			background: rgba(255, 255, 255, 0.45);
			-webkit-backdrop-filter: blur(8px);
			backdrop-filter: blur(8px);
			border: 1px solid rgba(255, 255, 255, 0.225);
			padding-bottom: 76px;

			> * {
				padding-left: 20px;
				padding-right: 20px;
			}

			.catchline {
				font-size: 40px;
				font-weight: 800;
				text-align: center;
				line-height: 1.2;
				padding-top: 20px;
			}

			.messages-container {
				display: flex;
				flex-direction: column;
				overflow-y: auto;
				height: 100%;
				width: 100%;
				margin-top: 20px;

				.messages {
					list-style-type: none;
					padding: 0;
					margin: 0;
					display: flex;
					flex-direction: column;
					gap: 12px;

					.message {
						padding: 10px;
						margin: 5px 0;
						max-width: 80%;
					}

					.user-message {
						background-color: #ffffff8e;
						border-radius: 12px 12px 0px 12px;
						align-self: flex-end;
						box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
					}

					.bot-message {
						background-color: #ffffff;
						border-radius: 12px 12px 12px 0px;
						align-self: flex-start;
						box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
					}

					.content {
						font-size: 16px;
					}
				}
			}

			.vocal {
				display: flex;
				justify-content: center;
				align-items: center;

				.open-mic {
					background-color: #ffffff;
					border-radius: 50%;
					width: 68px;
					height: 68px;
					padding: 10px;
					border: none;
					cursor: pointer;
					font-size: 24px;
					color: black;
					box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
					animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

					&.recording {
						color: white;
						background-color: rgb(199, 74, 74);
						box-shadow: 0 0 0 0 rgb(199, 74, 74);
					}
				}
			}
		}

		.write {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.open-keyboard {
				background-color: #ffffff;
				border-radius: 12px 12px 0px 0px;
				width: 100%;
				padding: 10px;
				border: none;
				cursor: pointer;
				font-size: 24px;
				color: black;
				box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
			}

            .keyboard-input {
                display: flex;
                width: 100%;
                padding: 10px;
                background-color: #ffffff;
                gap: 10px;

                input {
                    flex: 1;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 16px;
                }

                .send-message {
                    background-color: #ffffff;
                    border: none;
                    border-radius: 8px;
                    padding: 8px 16px;
                    cursor: pointer;
                    font-size: 18px;
                    color: black;

                    &:hover {
                        background-color: #f0f0f0;
                    }
                }
            }
		}
	}

	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
		}
		70% {
			box-shadow: 0 0 0 20px rgba(255, 255, 255, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
		}
	}
</style>

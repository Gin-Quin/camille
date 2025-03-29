<script lang="ts">
	import { PUBLIC_API_URL } from "$env/static/public"
	import { onMount } from "svelte"
	import { startWebRTCSession } from "./startWebRTCSession"

	let isRecording = false
	let connection: RTCPeerConnection | null = null
	let channel: RTCDataChannel | null = null
	const responseText = ""
	let audioElement: HTMLAudioElement

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

				switch (response.type) {
					case "conversation.item.input_audio_transcription.completed": {
						const transcript = response.transcript as string
						fetch(`${PUBLIC_API_URL}/conversation`, {
							method: "POST",
							body: JSON.stringify({ transcript, source: "user" }),
						})
						break
					}
					case "response.text.delta": {
						const delta = response.delta as string
						// TODO: stream text
						console.log("Audio transcription delta:", delta)
						break
					}
					case "response.text.done": {
						const transcript = response.text as string
						fetch(`${PUBLIC_API_URL}/conversation`, {
							method: "POST",
							body: JSON.stringify({ transcript, source: "ai" }),
						})
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

<div class="container">
	<button
		on:click={isRecording ? stopRecording : startRecording}
		class:recording={isRecording}
	>
		{isRecording ? "Stop Recording" : "Start Recording"}
	</button>

	{#if responseText}
		<div class="response">
			<h3>Response:</h3>
			<p>{responseText}</p>
		</div>
	{/if}

	<audio bind:this={audioElement}></audio>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		gap: 2rem;
	}

	button {
		padding: 1rem 2rem;
		font-size: 1.2rem;
		border-radius: 8px;
		border: none;
		background-color: #4caf50;
		color: white;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	button:hover {
		background-color: #45a049;
	}

	.recording {
		background-color: #f44336;
	}

	.recording:hover {
		background-color: #da190b;
	}

	.response {
		max-width: 600px;
		padding: 1rem;
		background-color: #f5f5f5;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.response h3 {
		margin: 0 0 0.5rem 0;
		color: #333;
	}

	.response p {
		margin: 0;
		line-height: 1.5;
		color: #666;
	}
</style>

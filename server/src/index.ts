import { Hono } from "hono";
import { startWebRTCSession } from "./startWebRTCSession";

const app = new Hono();

app.get("/", (c) => {
	return c.text("Hello from the Camille API!");
});

// 1. Alloy
// 2. Ballad (comique)
// 3. Coral (trop enjouée)
// 4.

// Get a WebRTC token to start a realtime session
app.post("/start-webrtc-sesssion", async (context) => {
	const body = await context.req.json();
	const response = await startWebRTCSession(body);
	return context.json(response);
});

export default app;

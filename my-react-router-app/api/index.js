import express from "express";
const app = express();

// Health check endpoint
app.get("/api/health", (req, res) => res.json({ ok: true }));

// SSR or fallback handler
app.use((req, res) => {
  // SSR rendering or serve index.html
  res.status(200).send("OK (SSR handler placeholder)");
});

// Vercel expects export, not app.listen()
export default app;
// Vercel serverless function entry point
import { createRequestHandler } from '@react-router/express';
import * as build from '../build/server/index.js';

export default createRequestHandler({
  build,
  mode: 'production',
});

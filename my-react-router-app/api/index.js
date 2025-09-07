import express from "express";
import { createRequestHandler } from '@react-router/express';
import * as build from "../build/server/nodejs_eyJydW50aW1lIjoibm9kZWpzIn0/index.js";

const app = express();

// Health check endpoint
app.get("/api/health", (req, res) => res.json({ ok: true }));

// React Router SSR handler
app.use(createRequestHandler({
  build,
  mode: 'production',
}));

// Vercel expects export, not app.listen()
export default app;

// Vercel serverless function entry point
import { createRequestHandler } from '@react-router/express';
import * as build from '../build/server/index.js';

export default createRequestHandler({
  build,
  mode: 'production',
});

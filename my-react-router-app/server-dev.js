// Local development server for testing the Express API
import express from 'express';
import app from './api/index.js';

// Serve static files from build/client before the React Router handler
app.use(express.static('build/client', { maxAge: '1d' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Express server listening on port ${PORT}`);
  console.log(`📁 Serving static files from build/client`);
});

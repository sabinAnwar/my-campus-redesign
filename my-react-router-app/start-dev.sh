#!/bin/bash
# Start both dev servers for local testing

echo "🚀 Starting development servers..."

# Start Express server on port 3000
cd /c/Users/Dell/website-remix-data-base/website-bauen/my-react-router-app
PORT=3000 node server-dev.js > /tmp/express.log 2>&1 &
EXPRESS_PID=$!
echo "✅ Express server started (PID: $EXPRESS_PID) on http://localhost:3000"

# Wait for Express to start
sleep 2

# Start React dev server on port 5173+ 
npm run dev > /tmp/react.log 2>&1 &
REACT_PID=$!
echo "✅ React dev server started (PID: $REACT_PID)"

# Show URLs
echo ""
echo "📍 Development URLs:"
echo "   React Dev:  http://localhost:5175"
echo "   Express:    http://localhost:3000"
echo ""
echo "ℹ️  To stop servers: kill $EXPRESS_PID $REACT_PID"
echo ""
echo "📝 Logs:"
echo "   Express: tail -f /tmp/express.log"
echo "   React:   tail -f /tmp/react.log"

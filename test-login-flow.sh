#!/bin/bash
# Test login flow with curl

BASE_URL="${1:-http://localhost:5174}"
EMAIL="${2:-sabin.elanwar@iu-study.org}"
PASSWORD="${3:-your_password}"

echo "🧪 Testing Login Flow"
echo "===================="
echo "Base URL: $BASE_URL"
echo "Email: $EMAIL"
echo ""

# Create a temporary cookie jar
COOKIES=$(mktemp)
echo "🍪 Cookie jar: $COOKIES"
echo ""

# Step 1: Login
echo "📝 Step 1: Sending login request..."
LOGIN_RESPONSE=$(curl -s -c "$COOKIES" -b "$COOKIES" \
  -X POST "$BASE_URL/api/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=$EMAIL&password=$PASSWORD")

echo "Response: $LOGIN_RESPONSE"
echo ""

# Check if login was successful
if echo "$LOGIN_RESPONSE" | grep -q '"success":true'; then
  echo "✅ Login successful!"
  echo ""

  # Step 2: Check session
  echo "📝 Step 2: Verifying session..."
  sleep 1  # Wait a moment for cookies to settle
  
  USER_RESPONSE=$(curl -s -b "$COOKIES" \
    "$BASE_URL/api/user")
  
  echo "Response: $USER_RESPONSE"
  echo ""
  
  if echo "$USER_RESPONSE" | grep -q '"user"'; then
    echo "✅ Session verified!"
    echo ""
    echo "🎉 Login flow working correctly!"
  else
    echo "❌ Session verification failed"
  fi
else
  echo "❌ Login failed"
  echo "Response: $LOGIN_RESPONSE"
fi

# Cleanup
rm -f "$COOKIES"

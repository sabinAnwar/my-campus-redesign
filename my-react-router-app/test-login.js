import fetch from 'node-fetch';

async function testLogin() {
  console.log('Testing /api/login endpoint...\n');

  const formData = new URLSearchParams({
    email: 'sabin.elanwar@iu-study.org',
    password: 'password123'
  });

  try {
    const response = await fetch('http://localhost:5173/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers));

    const text = await response.text();
    console.log('Response (first 500 chars):\n', text.substring(0, 500));

    // Try to parse as JSON
    try {
      const json = JSON.parse(text);
      console.log('\n✅ Parsed JSON:', json);
    } catch (e) {
      console.log('\n❌ Not valid JSON');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLogin();

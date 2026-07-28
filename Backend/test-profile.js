const fs = require('fs');
const path = require('path');

async function runTest() {
  console.log('1. Logging in as admin...');
  let loginRes;
  try {
    loginRes = await fetch('http://localhost:3001/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@educore.com', password: 'Admin@123' })
    });
  } catch (e) {
    console.error('Failed to connect to backend. Is it running?');
    return;
  }
  
  if (!loginRes.ok) {
    const err = await loginRes.text();
    console.error('Login failed:', err);
    return;
  }
  
  const loginData = await loginRes.json();
  const token = loginData.accessToken;
  console.log('Login successful. Token acquired.');

  console.log('2. Creating dummy image...');
  const pngHex = "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2db40000000049454e44ae426082";
  const buffer = Buffer.from(pngHex, 'hex');

  console.log('3. Sending profile update...');
  // Use global web FormData provided by Node 18+
  const form = new FormData();
  form.append('firstName', 'AdminTest');
  form.append('lastName', 'User');
  form.append('profilePicture', new Blob([buffer], { type: 'image/png' }), 'dummy.png');

  const updateRes = await fetch('http://localhost:3001/api/v1/users/profile', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: form
  });

  if (!updateRes.ok) {
    const err = await updateRes.text();
    console.error('Profile update failed:', updateRes.status, err);
  } else {
    const data = await updateRes.json();
    console.log('Profile update successful!');
    console.log('Updated user data:', data);
  }
}

runTest();

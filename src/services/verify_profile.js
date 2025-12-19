
const BASE_URL = 'http://localhost:3000/api';

async function verifyProfile() {
    const email = `test_profile_${Date.now()}@example.com`;
    const password = 'password123';
    const name = 'Test Profile User';

    try {
        // 1. Register
        console.log('1. Registering user...');
        const registerRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name, alamatLengkap: 'Test Address' })
        });

        if (registerRes.ok) {
            console.log('   Registration successful.');
        } else {
            const errorText = await registerRes.text();
            console.log(`   Registration info: ${registerRes.status} - ${errorText}`);
            console.log('   Continuing to login...');
        }

        // 2. Login
        console.log('2. Logging in...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!loginRes.ok) {
            throw new Error(`Login failed: ${loginRes.status} ${loginRes.statusText}`);
        }

        const loginData = await loginRes.json();
        const token = loginData.data.token; // Token is in data.token

        if (!token) {
            throw new Error('No token received in login response');
        }
        console.log('   Login successful, token received.');

        // 3. Get Profile
        console.log('3. Fetching profile...');
        const profileRes = await fetch(`${BASE_URL}/users/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const profileData = await profileRes.json();
        console.log('   Profile response:', JSON.stringify(profileData, null, 2));

        if (profileData.success && profileData.data.email === email) {
            console.log('SUCCESS: Profile fetched correctly!');
        } else {
            console.error('FAILURE: Profile data mismatch or error.');
            process.exit(1);
        }

    } catch (error) {
        console.error('ERROR:', error.message);
        process.exit(1);
    }
}

verifyProfile();

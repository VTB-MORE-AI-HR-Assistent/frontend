// Test authentication with backend API
// Run with: node test-auth-backend.js

const API_URL = 'http://localhost:8081';

// Test data
const testUser = {
  email: `test${Date.now()}@example.com`,
  password: 'Test123!',
  firstName: 'Test',
  lastName: 'User'
};

// Helper function to make requests
async function makeRequest(endpoint, method = 'POST', body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options = {
    method,
    headers,
  };
  
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();
    
    return {
      status: response.status,
      data,
      ok: response.ok
    };
  } catch (error) {
    return {
      status: 0,
      error: error.message,
      ok: false
    };
  }
}

// Test functions
async function testRegister() {
  console.log('\n🔵 Testing Registration...');
  console.log(`Registering user: ${testUser.email}`);
  
  const result = await makeRequest('/api/v1/auth/register', 'POST', testUser);
  
  if (result.ok) {
    console.log('✅ Registration successful!');
    console.log('Access Token:', result.data.accessToken?.substring(0, 50) + '...');
    console.log('User:', result.data.user);
    return result.data;
  } else {
    console.log('❌ Registration failed:', result.data);
    return null;
  }
}

async function testLogin() {
  console.log('\n🔵 Testing Login...');
  console.log(`Logging in as: ${testUser.email}`);
  
  const result = await makeRequest('/api/v1/auth/login', 'POST', {
    email: testUser.email,
    password: testUser.password
  });
  
  if (result.ok) {
    console.log('✅ Login successful!');
    console.log('Access Token:', result.data.accessToken?.substring(0, 50) + '...');
    console.log('User:', result.data.user);
    return result.data;
  } else {
    console.log('❌ Login failed:', result.data);
    return null;
  }
}

async function testGetCurrentUser(accessToken) {
  console.log('\n🔵 Testing Get Current User...');
  
  const result = await makeRequest('/api/v1/users/me', 'GET', null, accessToken);
  
  if (result.ok) {
    console.log('✅ Get current user successful!');
    console.log('User data:', result.data);
    return result.data;
  } else {
    console.log('❌ Get current user failed:', result.data);
    return null;
  }
}

async function testRefreshToken(refreshToken) {
  console.log('\n🔵 Testing Refresh Token...');
  
  const result = await makeRequest('/api/v1/auth/refresh', 'POST', {
    refreshToken
  });
  
  if (result.ok) {
    console.log('✅ Token refresh successful!');
    console.log('New Access Token:', result.data.accessToken?.substring(0, 50) + '...');
    return result.data;
  } else {
    console.log('❌ Token refresh failed:', result.data);
    return null;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Authentication Tests');
  console.log('================================');
  console.log('API URL:', API_URL);
  
  // Test registration
  const registerData = await testRegister();
  
  if (registerData) {
    // Test get current user with token from registration
    await testGetCurrentUser(registerData.accessToken);
    
    // Test refresh token
    await testRefreshToken(registerData.refreshToken);
  }
  
  // Test login (should work even if registration failed due to duplicate email)
  const loginData = await testLogin();
  
  if (loginData) {
    // Test get current user with token from login
    await testGetCurrentUser(loginData.accessToken);
  }
  
  console.log('\n================================');
  console.log('✨ Tests completed!');
  
  // Check if backend is accessible
  if (!registerData && !loginData) {
    console.log('\n⚠️  No successful connections. Please check:');
    console.log('1. Backend is running at', API_URL);
    console.log('2. API Gateway is configured correctly');
    console.log('3. Network connection is working');
  }
}

// Check if API is reachable
async function checkAPIHealth() {
  console.log(`\n🔍 Checking API at ${API_URL}...`);
  
  try {
    const response = await fetch(`${API_URL}/health`, { 
      method: 'GET',
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    
    if (response.ok) {
      console.log('✅ API is reachable');
      return true;
    } else {
      console.log(`⚠️  API returned status ${response.status}`);
      return true; // API is reachable but health endpoint might not exist
    }
  } catch (error) {
    console.log('❌ Cannot reach API:', error.message);
    console.log('\n Please ensure the backend is running with:');
    console.log('   - API Gateway at http://localhost:8081');
    console.log('   - Or update API_URL in this script');
    return false;
  }
}

// Main execution
(async () => {
  const isReachable = await checkAPIHealth();
  
  if (isReachable) {
    await runTests();
  } else {
    console.log('\n🛑 Skipping tests - API is not reachable');
  }
})();
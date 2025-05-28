// src/services/authService.js
const API_BASE_URL = 'https://localhost:44313/api';

export const registerUser = async (userData) => {
  console.log('Sending registration data:', userData);
  try {
    const response = await fetch(`${API_BASE_URL}/Account/register`, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.errors ? JSON.stringify(data.errors) : data.message || 'Registration failed');
    }

    return data;
  } catch (error) {
    console.error('Full registration error:', {
      error: error,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};


const API_BASE_URL2 = 'https://localhost:44313';

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL2}/api/Account/login`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      }),
      credentials: 'include'
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      } catch {
        throw new Error(`Login failed with status ${response.status}`);
      }
    }

    const data = await response.json();
    
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userId', data.userId);
    
    // Redirect to booking page
    window.location.href = '/booking'; // Full page reload
    
    return { 
      success: true,
      message: data.message,
      userId: data.userId,
      fullName: data.fullName
    };
    
  } catch (error) {
    localStorage.setItem('isLoggedIn', 'false');
    console.error('Login error:', error);
    throw error;
  }
};
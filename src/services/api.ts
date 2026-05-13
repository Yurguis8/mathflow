const API_URL = 'http://localhost:3000';

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  );

  return response.json();
}

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  );

  return response.json();
}
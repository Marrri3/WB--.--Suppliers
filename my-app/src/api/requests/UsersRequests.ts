import { ENDPOINTS } from '../endpoints/OrderEndpoints';

//функции для авторизации
export const registerUser = async (name: string, email: string, password: string): Promise<any> => {
    const response = await fetch(ENDPOINTS.users.register, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!response.ok) throw new Error('Registration failed');
    return await response.json();
  };
  
  export const loginUser = async (email: string, password: string): Promise<{ token: string; userId?: number }> => {
    const response = await fetch(ENDPOINTS.users.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    const data = await response.json();
    localStorage.setItem('token', data.token);
    //извлечение userId
    try {
      const tokenPayload = JSON.parse(atob(data.token.split('.')[1])); 
      const userId = tokenPayload.id; //id
      if (userId) {
        localStorage.setItem('userId', userId.toString()); 
        console.log('Login successful, userId saved:', userId);
      }
    } catch (error) {
      console.warn('Failed to decode token for userId:', error);
    }
    return data; 
  };
  
  export const getMe = async (): Promise<any> => {
    const response = await fetch(ENDPOINTS.users.me, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw response; 
    return await response.json();
  };

  export const editMe = async (email:string, name:string): Promise<any> => {
    const response = await fetch(ENDPOINTS.users.me, {
      method: 'PATCH', //для частичного обновления
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name }),
    });
    if (!response.ok) throw response; 
    return await response.json();
  };
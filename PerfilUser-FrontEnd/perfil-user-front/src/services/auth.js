import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';

export async function loginApi(email, password) {
  try {
    // O endpoint correto é /api/login
    const response = await axios.post('/api/login', { email, password });
    // Aqui você pode tratar o token, salvar no localStorage, etc.
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('Usuário ou senha incorretos. Digite novamente.');
    }
    throw error;
  }
}

export async function logoutApi() {
  // Pegue o token salvo
  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  await axios.post('/api/logout');
  // Agora sim, remova o token
  localStorage.removeItem('token');
} 
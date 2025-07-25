import axios from 'axios';
import { ref } from 'vue';
import { loginApi, logoutApi } from '@/services/auth';

const user = ref(JSON.parse(localStorage.getItem('user')) || {});
const token = ref(localStorage.getItem('token') || null);

if (token.value) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
}

export function useAuth() {
  const loading = ref(false);
  const error = ref('');

  async function login({ email, password }) {
    loading.value = true;
    error.value = '';
    try {
      const result = await loginApi(email, password);
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${result.token}`;
      user.value = result.user || {};
      token.value = result.token;
    } catch (e) {
      error.value = e.message || 'Erro ao fazer login';
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    await logoutApi();
    user.value = {};
    token.value = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }

  return { login, logout, loading, error, user, token };
} 
<template>
  <div class="app-container">
    <div class="users-header-bar" style="justify-content: flex-end; gap: 1rem; margin-bottom: 1.5rem;">
      <button class="tasks-header-btn" @click="goDashboard">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px;vertical-align:middle;"><polyline points="15 18 9 12 15 6"/><line x1="9" y1="12" x2="21" y2="12"/></svg>
        Voltar
      </button>
      <button class="tasks-header-btn" @click="logout">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px;vertical-align:middle;"><path d="M17 16l4-4m0 0l-4-4m4 4H7"/><path d="M9 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4"/></svg>
        Logout
      </button>
    </div>
    <div class="users-header-content">
      <div class="users-header-title">Usuários Cadastrados</div>
    </div>
    <div class="users-card">
      <!-- Campo de busca -->
      <div class="search-bar">
        <input v-model="searchTerm" class="search-input" placeholder="Buscar por nome..." />
        <button class="search-btn" @click="searchUsers">Buscar</button>
      </div>
      <div v-if="showModal && foundUsers.length > 1" class="modal-overlay" @click="closeModal">
        <div class="modal-content task-modal-content custom-task-modal" @click.stop>
          <div class="modal-header custom-modal-header">
            <h2 class="custom-modal-title">Usuários Encontrados</h2>
            <button class="close-button custom-close-btn" @click="closeModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="custom-modal-body" style="gap: 1.5rem;">
            <div v-for="user in foundUsers" :key="user.id" class="modal-field" style="flex-direction: column; align-items: flex-start; background: #f3f4f6; border-radius: 0.7rem; padding: 1rem 1.2rem; margin-bottom: 0.5rem; width: 100%;">
              <div><span class="modal-label">Nome:</span> <span class="modal-value">{{ user.fullName }}</span></div>
              <div><span class="modal-label">Email:</span> <span class="modal-value">{{ user.email }}</span></div>
              <button class="search-btn" style="margin-top: 0.7rem;" @click="showUserDetails(user)">Ver detalhes</button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showModal && foundUsers.length === 1 && selectedUser" class="modal-overlay" @click="closeModal">
        <div class="modal-content task-modal-content custom-task-modal" @click.stop>
          <div class="modal-header custom-modal-header">
            <h2 class="custom-modal-title">Detalhes do Usuário</h2>
            <button class="close-button custom-close-btn" @click="closeModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal-body custom-modal-body">
            <div class="modal-field"><span class="modal-label">Nome:</span> <span class="modal-value">{{ selectedUser.fullName }}</span></div>
            <div class="modal-field"><span class="modal-label">Email:</span> <span class="modal-value">{{ selectedUser.email }}</span></div>
            <div class="modal-field"><span class="modal-label">Idade:</span> <span class="modal-value">{{ selectedUser.age }}</span></div>
            <div class="modal-field"><span class="modal-label">Tipo de Usuário:</span> <span class="modal-value">{{ selectedUser.role }}</span></div>
          </div>
        </div>
      </div>
      <div v-if="showError" class="users-error-toast">Usuários não encontrados</div>
      <div class="table-wrapper">
        <table class="users-table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Idade</th>
              <th>Tipo de Usuário</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>
                <img v-if="user.profile_image" :src="user.profile_image" alt="Foto de Perfil" style="width:40px;height:40px;border-radius:50%;object-fit:cover;box-shadow:0 2px 8px #e0e7ef;" />
                <div v-else style="width:40px;height:40px;border-radius:50%;background:#e0e7ef;display:flex;align-items:center;justify-content:center;font-weight:bold;color:#6366f1;font-size:1.2rem;">{{ user.fullName ? user.fullName[0] : '?' }}</div>
              </td>
              <td>{{ user.fullName }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.age }}</td>
              <td>{{ user.role }}</td>
              <td class="actions-cell">
                <button @click="openEditModal(user)" class="action-btn action-complete" title="Alterar">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="22" height="22"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.79l-4 1 1-4 14.362-14.303z" /></svg>
                </button>
                <button @click="removeUser(user.id)" class="action-btn action-remove" title="Remover">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="22" height="22"><path stroke-linecap="round" stroke-linejoin="round" d="M6 7h12M9.5 7V5.75A1.75 1.75 0 0 1 11.25 4h1.5A1.75 1.75 0 0 1 14.5 5.75V7m-7 0v10.25A2.25 2.25 0 0 0 9.75 19.5h4.5A2.25 2.25 0 0 0 16.5 17.25V7" /><path stroke-linecap="round" stroke-linejoin="round" d="M10 11v4m4-4v4" /></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="users.length === 0 && !showError" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <h3>Nenhum usuário cadastrado</h3>
        <p>Cadastre um novo usuário para começar.</p>
      </div>
    </div>
    <div v-if="editModalOpen" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content task-modal-content custom-task-modal" @click.stop>
        <div class="modal-header custom-modal-header">
          <h2 class="custom-modal-title">Editar Usuário</h2>
          <button class="close-button custom-close-btn" @click="closeEditModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <form class="modal-body custom-modal-body edit-user-form" @submit.prevent="submitEditUser">
          <div class="modal-field edit-field">
            <label class="modal-label edit-label">Nome:</label>
            <input v-model="editUserData.fullName" class="modal-value edit-input" required />
          </div>
          <div class="modal-field edit-field">
            <label class="modal-label edit-label">Email:</label>
            <input v-model="editUserData.email" class="modal-value edit-input" type="email" required />
          </div>
          <div class="modal-field edit-field">
            <label class="modal-label edit-label">Idade:</label>
            <input v-model="editUserData.age" class="modal-value edit-input" type="number" min="0" required />
          </div>
          <div class="modal-field edit-field">
            <label class="modal-label edit-label">Tipo de Usuário:</label>
            <select v-model="editUserData.role" class="modal-value edit-input" required>
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem;">
            <button type="button" class="search-btn" @click="closeEditModal">Cancelar</button>
            <button type="submit" class="search-btn">Salvar</button>
          </div>
          <div v-if="editError" style="color: #dc2626; margin-top: 0.7rem; font-weight: 600;">{{ editError }}</div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/css/user.css';
import UserService from '@/services/UserService';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

export default {
  name: 'UsersView',
  setup() {
    const users = ref([]);
    const showError = ref(false);
    const router = useRouter();
    const { logout: doLogout } = useAuth();
    function goDashboard() {
      router.push('/dashboard');
    }
    function logout() {
      doLogout()
        .catch(() => {})
        .finally(() => {
          router.push({ path: '/login', query: { logoutSuccess: 1 } });
        });
    }
    async function fetchUsers() {
      try {
        const res = await UserService.getUsers();
        users.value = Array.isArray(res) ? res : (res.data || []);
        showError.value = false;
      } catch (e) {
        showError.value = true;
      }
    }
    async function removeUser(id) {
      if (confirm('Tem certeza que deseja remover este usuário?')) {
        await UserService.deleteUser(id);
        fetchUsers();
      }
    }
    function editUser() {
      alert('Funcionalidade de edição pode ser implementada aqui!');
    }
    const searchTerm = ref('');
    const showModal = ref(false);
    const foundUsers = ref([]);
    const selectedUser = ref(null);
    function searchUsers() {
      const term = searchTerm.value.trim().toLowerCase();
      const userList = Array.isArray(users) ? users : (users.value ? users.value : []);
      if (!term) {
        showModal.value = false;
        foundUsers.value = [];
        selectedUser.value = null;
        return;
      }
      const matches = userList.filter(u => u.fullName && u.fullName.toLowerCase().includes(term));
      if (matches.length === 1) {
        foundUsers.value = [matches[0]];
        selectedUser.value = matches[0];
        showModal.value = true;
      } else if (matches.length > 1) {
        foundUsers.value = matches;
        selectedUser.value = null;
        showModal.value = true;
      } else {
        showModal.value = false;
        foundUsers.value = [];
        selectedUser.value = null;
      }
    }
    function showUserDetails(user) {
      selectedUser.value = user;
      foundUsers.value = [user];
      showModal.value = true;
    }
    function closeModal() {
      showModal.value = false;
      foundUsers.value = [];
      selectedUser.value = null;
    }
    const editModalOpen = ref(false);
    const editUserData = ref({ id: null, fullName: '', email: '', age: '', role: '' });
    const editError = ref('');
    function openEditModal(user) {
      // Corrige o valor do campo role para 'admin' ou 'user'
      let roleValue = user.role;
      if (roleValue === 'isAdmin' || roleValue === 'admin') {
        roleValue = 'admin';
      } else {
        roleValue = 'user';
      }
      editUserData.value = { ...user, role: roleValue };
      editModalOpen.value = true;
      editError.value = '';
    }
    function closeEditModal() {
      editModalOpen.value = false;
      editUserData.value = { id: null, fullName: '', email: '', age: '', role: '' };
      editError.value = '';
    }
    async function submitEditUser() {
      try {
        // Garante que o valor enviado seja 'admin' ou 'user'
        const payload = { ...editUserData.value, role: editUserData.value.role === 'admin' ? 'admin' : 'user' };
        await UserService.updateUser(editUserData.value.id, payload);
        editModalOpen.value = false;
        await fetchUsers();
      } catch (e) {
        editError.value = e.response?.data?.message || 'Erro ao atualizar usuário';
      }
    }
    onMounted(fetchUsers);
    return { users, removeUser, editUser, showError, goDashboard, logout, searchTerm, showModal, foundUsers, selectedUser, searchUsers, showUserDetails, closeModal, editModalOpen, editUserData, editError, openEditModal, closeEditModal, submitEditUser };
  }
};
</script> 
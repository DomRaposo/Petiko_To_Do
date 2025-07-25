<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ isEdit ? 'Editar' : 'Criar' }} Usuário</h2>
        <button class="close-button" @click="closeModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <form @submit.prevent="submitForm" class="modal-body">
        <div class="form-section">
          <h3>Informações Pessoais</h3>
          
          <div class="form-group">
            <label for="name">Nome Completo</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              placeholder="Digite seu nome completo"
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              placeholder="Digite seu email"
            />
          </div>

          <div class="form-group">
            <label for="password">{{ isEdit ? 'Nova Senha (opcional)' : 'Senha' }}</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              :required="!isEdit"
              placeholder="Digite sua senha"
            />
          </div>

          <div class="form-group">
            <label for="profileImage">Foto de Perfil (URL)</label>
            <input
              id="profileImage"
              v-model="formData.profileImage"
              type="url"
              placeholder="https://exemplo.com/sua-foto.jpg"
            />
          </div>
        </div>

        <div class="form-section">
          <h3>Endereço Profissional</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="street">Rua/Avenida</label>
              <input
                id="street"
                v-model="formData.street"
                type="text"
                placeholder="Nome da rua ou avenida"
              />
            </div>
            <div class="form-group form-group-small">
              <label for="number">Número</label>
              <input
                id="number"
                v-model="formData.number"
                type="text"
                placeholder="123"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="complement">Complemento</label>
              <input
                id="complement"
                v-model="formData.complement"
                type="text"
                placeholder="Apto, Sala, Andar..."
              />
            </div>
            <div class="form-group">
              <label for="neighborhood">Bairro</label>
              <input
                id="neighborhood"
                v-model="formData.neighborhood"
                type="text"
                placeholder="Nome do bairro"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="city">Cidade</label>
              <input
                id="city"
                v-model="formData.city"
                type="text"
                placeholder="Nome da cidade"
              />
            </div>
            <div class="form-group">
              <label for="state">Estado/UF</label>
              <input
                id="state"
                v-model="formData.state"
                type="text"
                placeholder="SP, RJ, MG..."
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="zipCode">CEP</label>
              <input
                id="zipCode"
                v-model="formData.zipCode"
                type="text"
                placeholder="00000-000"
                @input="formatZipCode"
              />
            </div>
            <div class="form-group">
              <label for="country">País</label>
              <input
                id="country"
                v-model="formData.country"
                type="text"
                placeholder="Brasil"
              />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" @click="closeModal" class="btn-secondary">
            Cancelar
          </button>
          <button type="submit" class="btn-primary">
            {{ isEdit ? 'Atualizar' : 'Criar' }} Usuário
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import '@/assets/css/modal-user-form.css';
export default {
  name: 'ModalUserForm',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formData: {
        name: '',
        email: '',
        password: '',
        profileImage: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      }
    }
  },
  watch: {
    user: {
      handler(newUser) {
        if (newUser && Object.keys(newUser).length > 0) {
          this.formData = {
            name: newUser.name || '',
            email: newUser.email || '',
            password: '',
            profileImage: newUser.profileImage || '',
            street: newUser.street || '',
            number: newUser.number || '',
            complement: newUser.complement || '',
            neighborhood: newUser.neighborhood || '',
            city: newUser.city || '',
            state: newUser.state || '',
            zipCode: newUser.zipCode || '',
            country: newUser.country || ''
          }
        } else {
          this.resetForm()
        }
      },
      immediate: true
    }
  },
  methods: {
    formatZipCode() {
      let value = this.formData.zipCode.replace(/\D/g, '')
      if (value.length > 5) {
        value = value.replace(/(\d{5})(\d)/, '$1-$2')
      }
      this.formData.zipCode = value
    },
    resetForm() {
      this.formData = {
        name: '',
        email: '',
        password: '',
        profileImage: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      }
    },
    closeModal() {
      this.$emit('close')
    },
    submitForm() {
      const userData = { ...this.formData }
      
      // Se for edição e a senha estiver vazia, removê-la
      if (this.isEdit && !userData.password) {
        delete userData.password
      }
      
      this.$emit('submit', userData)
    }
  }
}
</script>

<template>
  <div class="auth-phone-request">
    <div class="auth-phone-request__header">
      <h3>Запрос SMS кода</h3>
      <p>Новый API endpoint: /auth/phone/request</p>
    </div>

    <form @submit.prevent="handleSubmit" class="auth-phone-request__form">
      <div class="auth-phone-request__field">
        <label for="phone">Номер телефона:</label>
        <input
          id="phone"
          v-model="phone"
          type="tel"
          placeholder="+7 (999) 123-45-67"
          :disabled="loading"
          required
        />
      </div>

      <div class="auth-phone-request__field">
        <label for="userType">Тип пользователя:</label>
        <select
          id="userType"
          v-model="userType"
          :disabled="loading"
        >
          <option value="contractor">Исполнитель</option>
          <option value="manager">Менеджер</option>
        </select>
      </div>

      <div v-if="codeSent" class="auth-phone-request__code-section">
        <div class="auth-phone-request__field">
          <label for="code">SMS код:</label>
          <input
            id="code"
            v-model="code"
            type="text"
            placeholder="Введите код из SMS"
            :disabled="loading"
            maxlength="4"
          />
        </div>
        
        <button
          type="button"
          @click="handleConfirmCode"
          :disabled="loading || !code"
          class="auth-phone-request__button auth-phone-request__button--primary"
        >
          {{ loading ? 'Отправка...' : 'Подтвердить код' }}
        </button>
      </div>

      <div v-else class="auth-phone-request__actions">
        <button
          type="submit"
          :disabled="loading || !phone"
          class="auth-phone-request__button auth-phone-request__button--primary"
        >
          {{ loading ? 'Отправка...' : 'Запросить код' }}
        </button>
      </div>

      <div v-if="error" class="auth-phone-request__error">
        {{ getErrorMessage(error) }}
      </div>

      <div v-if="success" class="auth-phone-request__success">
        {{ success }}
      </div>
    </form>

    <div v-if="codeSent" class="auth-phone-request__info">
      <p>Код отправлен на номер: {{ phone }}</p>
      <button
        type="button"
        @click="requestCodeAgain"
        :disabled="loading"
        class="auth-phone-request__button auth-phone-request__button--secondary"
      >
        Отправить код повторно
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

export default {
  name: 'AuthPhoneRequest',
  setup() {
    const { 
      loading, 
      error, 
      requestPhoneCode, 
      confirmPhoneCode, 
      getErrorMessage 
    } = useAuth()

    const phone = ref('')
    const userType = ref('contractor')
    const code = ref('')
    const codeSent = ref(false)
    const success = ref('')

    const handleSubmit = async () => {
      success.value = ''
      const result = await requestPhoneCode(phone.value, userType.value)
      
      if (result) {
        codeSent.value = true
        success.value = 'Код успешно отправлен!'
      }
    }

    const handleConfirmCode = async () => {
      success.value = ''
      const result = await confirmPhoneCode(phone.value, code.value, userType.value)
      
      if (result) {
        success.value = 'Авторизация успешна!'
        // Здесь можно перенаправить пользователя
      }
    }

    const requestCodeAgain = async () => {
      success.value = ''
      const result = await requestPhoneCode(phone.value, userType.value)
      
      if (result) {
        success.value = 'Код отправлен повторно!'
      }
    }

    return {
      phone,
      userType,
      code,
      codeSent,
      success,
      loading,
      error,
      handleSubmit,
      handleConfirmCode,
      requestCodeAgain,
      getErrorMessage
    }
  }
}
</script>

<style lang="scss" scoped>
.auth-phone-request {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;

  &__header {
    margin-bottom: 20px;
    text-align: center;

    h3 {
      margin: 0 0 8px 0;
      color: #333;
    }

    p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 4px;

    label {
      font-weight: 500;
      color: #333;
    }

    input, select {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;

      &:focus {
        outline: none;
        border-color: #007bff;
      }

      &:disabled {
        background: #f5f5f5;
        cursor: not-allowed;
      }
    }
  }

  &__code-section {
    padding: 16px;
    background: #f8f9fa;
    border-radius: 4px;
    border: 1px solid #e9ecef;
  }

  &__actions {
    display: flex;
    gap: 12px;
  }

  &__button {
    padding: 10px 16px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    &--primary {
      background: #007bff;
      color: white;

      &:hover:not(:disabled) {
        background: #0056b3;
      }
    }

    &--secondary {
      background: #6c757d;
      color: white;

      &:hover:not(:disabled) {
        background: #545b62;
      }
    }
  }

  &__error {
    padding: 8px 12px;
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    font-size: 14px;
  }

  &__success {
    padding: 8px 12px;
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
    border-radius: 4px;
    font-size: 14px;
  }

  &__info {
    margin-top: 16px;
    padding: 12px;
    background: #e7f3ff;
    border: 1px solid #b3d9ff;
    border-radius: 4px;

    p {
      margin: 0 0 8px 0;
      color: #004085;
    }
  }
}
</style>

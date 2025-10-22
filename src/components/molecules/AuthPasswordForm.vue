<template>
  <Form ref="form" class="auth-password-form">
    <div class="auth-password-form__group">
      <div class="auth-password-form__block">
        <div class="auth-password-form__label">Email или номер телефона</div>
        <Input v-model="local.phone_or_email" name="phone_or_email" class="form_input" clearable :rules="rules" @keyup.enter="onSubmit" />
      </div>
      <div class="auth-password-form__block">
        <div class="auth-password-form__label">Пароль</div>
        <Input v-model="local.password" name="password" class="form_input" type="password" :rules="rules" @keyup.enter="onSubmit" />
      </div>
      <div class="auth-password-form__forgot" @click="$emit('forgot')">Забыли пароль?</div>
    </div>
    <MainButton class="auth-password-form__submit" type="primary" :text="'Войти'" :loading="loading" :disabled="disabled" @click="onSubmit" />
  </Form>
</template>

<script>
import MainButton from '@/components/atoms/MainButton.vue'
import Input from '@/components/atoms/Input.vue'
import Form from '@/components/atoms/Form.vue'

export default {
  name: 'AuthPasswordForm',
  components: { MainButton, Input, Form },
  props: {
    modelValue: { type: Object, default: () => ({ phone_or_email: '', password: '' }) },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    rules: { type: Array, default: () => [(v) => !!v || 'Заполните поле'] },
  },
  emits: ['update:modelValue', 'submit', 'forgot'],
  data() {
    return { local: { ...this.modelValue } }
  },
  watch: {
    modelValue(n) { this.local = { ...n } },
    local: {
      handler(n) { this.$emit('update:modelValue', { ...n }) },
      deep: true,
    },
  },
  methods: {
    onSubmit() {
      if (!this.$refs.form?.validate?.()) return
      this.$emit('submit')
    },
  },
}
</script>

<style lang="scss" scoped>
.auth-password-form { display: flex; flex-direction: column; gap: 24px; width: 100%; }
.auth-password-form__group { display: flex; flex-direction: column; gap: 16px; }
.auth-password-form__block { display: flex; flex-direction: column; gap: 4px; }
.auth-password-form__label { font-size: 14px; line-height: 22px; color: #666; }
.auth-password-form__forgot { cursor: pointer; font-size: 16px; line-height: 22px; color: #1735f5; align-self: flex-start; }
.auth-password-form__submit { width: 100%; }
</style>




<template>
  <PopupContainer title="Смена пароля" class="reset_password_popup" @close="$emit('close')">
    <div v-if="window === 'reset_password_methods'" class="initial_choose_block">
      <div class="choose_title_text">Выберите подходящий способ смены пароля</div>
      <div class="choose_methods_container">
        <div class="method_block" @click="resetByOldPassword">
          <div class="method_title">Через ввод текущего пароля</div>
          <div class="method_description">
            Если вы помните текущий пароль, но хотите изменить его для защиты своих данных
          </div>
        </div>
        <div class="method_block" @click="resetByPhone">
          <div class="method_title">Через телефон</div>
          <div class="method_description">
            Если вы забыли текущий пароль, но у вас есть доступ к номеру телефона, указанному при регистрации
          </div>
        </div>
        <div class="method_block" @click="resetByEmail">
          <div class="method_title">Через email</div>
          <div class="method_description">
            Если вы забыли текущий пароль и у вас нет доступа к телефону, указанному при регистрации
          </div>
        </div>
      </div>
    </div>
    <PasswordResetByOldPassword
      v-if="window === 'reset_by_old_password'"
      @closePopup="closePasswordPopup"
      @onBack="onBack"
    />
    <PasswordResetByPhone v-if="window === 'reset_by_phone'" @closePopup="closePasswordPopup" @onBack="onBack" />
    <PasswordResetByEmail v-if="window === 'reset_by_email'" @closePopup="closePasswordPopup" @onBack="onBack" />
  </PopupContainer>
</template>

<script>
import PopupContainer from '@/components/atoms/PopupContainer.vue'
import PasswordResetByOldPassword from '@/components/molecules/PasswordResetByOldPassword.vue'
import PasswordResetByPhone from '@/components/molecules/PasswordResetByPhone.vue'
import PasswordResetByEmail from '@/components/molecules/PasswordResetByEmail.vue'
import { mapMutations, mapActions } from 'vuex'

export default {
  components: {
    PopupContainer,
    PasswordResetByOldPassword,
    PasswordResetByPhone,
    PasswordResetByEmail,
  },
  props: {},
  data () {
    return {
      window: 'reset_password_methods',
      loading: false,
    }
  },
  mounted () {},
  methods: {
    ...mapMutations('user', ['updateUserData']),
    ...mapActions('user', ['fetchUser']),
    ...mapActions('notifications', ['showNotification']),

    onBack () {
      this.window = 'reset_password_methods'
    },
    resetByOldPassword () {
      this.window = 'reset_by_old_password'
    },
    resetByPhone () {
      this.window = 'reset_by_phone'
    },
    resetByEmail () {
      this.window = 'reset_by_email'
    },
    closePasswordPopup () {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss">
.reset_password_popup {
  min-width: 359px;
  max-width: 560px;
  width: 100%;
  .initial_choose_block {
    display: flex;
    flex-direction: column;
    gap: 24px;
    justify-content: center;
    .choose_title_text {
      font-size: 16px;
      font-weight: 400;
      line-height: 22px;
      text-align: left;
    }
    .choose_methods_container {
      justify-self: center;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
      .method_block {
        cursor: pointer;
        width: 100%;
        display: flex;
        flex-direction: column;
        padding: 8px 16px;
        gap: 8px;
        border-radius: 8px;
        border: 1px solid rgba(218, 218, 218, 1);
        .method_title {
          color: rgba(38, 48, 67, 1);
          font-size: 16px;
          font-weight: 600;
          line-height: 20px;
          text-align: left;
        }
        .method_description {
          color: rgba(122, 145, 169, 1);
          font-size: 16px;
          font-weight: 400;
          line-height: 22px;
          text-align: left;
          word-wrap: normal;
        }
      }
    }
  }
}
</style>

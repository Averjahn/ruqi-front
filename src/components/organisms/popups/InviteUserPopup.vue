<template>
  <PopupContainer class="invited_user_popup" title="Пригласить пользователя" @close="$emit('close')">
    <Info blue class="mb_16">
      Вы можете пригласить друга для совместного выполнения работ в системе RUQi. Введите данные друга которого хотите
      пригласить в форме ниже и система автоматически отправит приглашение. Если получатель уже зарегистрирован
      в системе, пожалуйста, введите телефон и email к которым привязан аккаунт получателя
    </Info>
    <div class="field_row">
      <div class="field_col">
        <div class="label required_label">ФИО получателя</div>
        <Input v-model="currentPassword" />
      </div>
    </div>
    <div class="field_row">
      <div class="field_col">
        <div class="label required_label">Телефон</div>
        <Input v-model="newPassword" />
      </div>
    </div>
    <div class="field_row">
      <div class="field_col">
        <div class="label required_label">Email</div>
        <Input v-model="repeatNewPassword" />
      </div>
    </div>
    <template v-slot:footer>
      <div class="action_block">
        <Button type="outlined" :disabled="loadingPassword" @click="$emit('close')">Отмена</Button>
        <Button :loading="loadingPassword" @click="submitNewPassword">Пригласить</Button>
      </div>
    </template>
  </PopupContainer>
</template>

<script>
import PopupContainer from '@/components/atoms/PopupContainer.vue'

export default {
  name: 'InviteUserPopup',
  components: { PopupContainer },
  props: {
    options: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      list: null,
    }
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    open () {},
  },
}
</script>

<style lang="scss" scoped>
.invited_user_popup {
  .field_row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .field_col {
    flex: 1;
    margin-bottom: 16px;
  }
  .label {
    color: #7a91a9;
    margin-bottom: 8px;
  }
  .action_block {
    margin-top: 8px;
    display: flex;
    gap: 16px;
    & > div {
      flex: 1;
    }
  }
  .required_label::after {
    content: '*';
    display: inline-block;
    color: #eb4d3d;
    margin-left: 2px;
  }
}
</style>

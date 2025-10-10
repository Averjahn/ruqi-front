<template>
  <div class="container">
    <img class="mb_16" src="@/assets/icon_deprecated/confirm.svg" />
    <h1 class="title mb_16">Вы уже успешно зарегистрировались в системе</h1>
    <div class="description">Теперь вы можете входить в личный кабинет используя ваш логин и пароль</div>
    <div class="button_block">
      <Button class="action_button" @click="$router.push('/')">Войти</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'alreadyRegistered',
}
</script>

<style lang="scss" scoped>
.container {
  padding: 64px 24px 60px 24px;
  text-align: center;
}
.description {
  display: inline-block;
  color: #7a91a9;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
  max-width: 560px;
}
.button_block {
  display: flex;
  justify-content: center;
}
.action_button {
  flex: 1;
  max-width: 460px;
}
@media (max-width: 490px) {
  .container {
    padding: 32px 24px 60px 24px;
    h1 {
      font-size: 30px;
      line-height: 34px;
    }
  }
}
</style>

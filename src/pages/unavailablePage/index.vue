<template>
  <div class="container">
    <img class="mb_16" src="@/assets/icon_deprecated/unavailable_page.svg" />
    <h1 class="mb_16">Страница больше недоступна</h1>
    <div class="description">
      Похоже, что ваша ссылка на регистрацию устарела. Чтобы получить новую ссылку - обратитесь к вашему менеджеру.
    </div>
    <div class="button_block">
      <Button class="action_button" type="outlined" @click="$router.push('/')">Перейти на главную страницу</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'unavailablePage',
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
      font-size: 35px;
      line-height: 38px;
    }
  }
}
</style>

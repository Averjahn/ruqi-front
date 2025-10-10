<template>
  <div class="container">
    <div class="text">
      Если у вас возникли проблемы с откликом на заявку, отклонение без причин, несвоевременная оплата или что-то
      другое, то напишите в службу поддержки.
    </div>
    <Button class="button" type="outlined"> написать в службу поддержки </Button>
  </div>
</template>

<script>
export default {
  name: 'SupportBlock',
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
}
</script>

<style lang="scss" scoped>
.container {
  color: #7a91a9;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0.1px;
}
.text {
  margin-bottom: 12px;
}
.button {
  color: #0082de;
}
</style>

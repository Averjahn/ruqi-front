<template>
  <div class="contractor_finance_header">
    <Button class="button" @click="$router.push(to)" background="white">
      <img src="@/assets/icon_deprecated/arrow_left.svg" />
    </Button>
    <h2>{{ title }}</h2>
  </div>
</template>

<script>
export default {
  name: 'BackButtonHeader',
  components: {},
  props: {
    to: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
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
.contractor_finance_header {
  display: flex;
  align-items: center;
  gap: 18px;
}
@media (max-width: 768px) {
  .contractor_finance_header h2 {
    font-size: 20px;
  }
  .button {
    min-height: 36px;
    height: 36px;
    width: 36px;
    min-width: 36px;
  }
}
</style>

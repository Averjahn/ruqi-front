<template>
  <Tabs :tabs="computedTabs" :value="value" @change="$emit('change', $event)" type="contained" wide />
</template>

<script>
export default {
  name: 'AuthTabs',
  props: {
    value: {
      type: String,
      default: 'by_password'
    },
    oldMethod: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    computedTabs() {
      return [
        { text: 'Вход по паролю', value: 'by_password' },
        { text: this.oldMethod ? 'Вход по смс' : 'Вход по звонку', value: 'by_phone_call' }
      ]
    }
  }
}
</script>

<style scoped>
</style>




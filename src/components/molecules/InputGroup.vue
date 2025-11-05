<template>
  <div class="input-group">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'InputGroup'
}
</script>

<style lang="scss" scoped>
.input-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}
</style>



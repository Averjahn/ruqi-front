<template>
  <div class="input-block">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'InputBlock'
}
</script>

<style lang="scss" scoped>
.input-block {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>



<template>
  <div class="footer-info">
    {{ text }}
  </div>
</template>

<script>
export default {
  name: 'FooterInfo',
  props: {
    text: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.footer-info {
  width: 100%;
  border-radius: 16px;
  overflow-wrap: break-word;
  padding: 24px;
  background-color: #eff2fd;
  font-size: 14px;
  line-height: 20px;
  color: #6b7280;
  text-align: left;
  margin: 0 auto;
  max-width: 100%;
  word-wrap: break-word;
}
</style>

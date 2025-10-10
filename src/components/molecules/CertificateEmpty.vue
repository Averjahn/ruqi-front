<template>
  <div class="certificate-empty">
    <div class="main_container" :class="[color]">
      <Icon class="icon" name="signatureThin" :size="48" />
      <div class="text">{{ text }}</div>
      <Button v-if="pending" class="button" @click="$emit('refresh')" :loading="loading" type="outlined">Обновить</Button>
      <Button v-else class="button" @click="$emit('create')" :loading="loading" type="outlined">{{ buttonText }}</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CertificateEmpty',
  emits: ['create', 'refresh'],
  components: {},
  props: {
    type: {
      type: String,
      default: 'empty', // 'error' | 'pending'
    },
    loading: {
      type: Boolean,
      default: false,
    },
    pending: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {}
  },
  computed: {
    text () {
      if (this.type === 'empty') return 'Нету действующих подписей'
      if (this.type === 'pending' || this.pending) return 'Сертификат выпускается'
      return 'Ошибка при получении данных сертификата'
    },
    buttonText () {
      if (this.type === 'empty') return 'Выпустить подпись'
      return 'Обновить статус'
    },
    color () {
      return this.type === 'error' ? 'red' : ''
    },
  },
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.certificate-empty {
  display: flex;
  align-items: center;
  justify-content: center;
}
.main_container {
  width: 100%;
  max-width: 300px;
  text-align: center;
  color: #666666;
  &.red {
    color: #eb4d3d;
  }
}
.icon {
  margin-bottom: 16px;
}
.text {
  margin-bottom: 24px;
}
</style>

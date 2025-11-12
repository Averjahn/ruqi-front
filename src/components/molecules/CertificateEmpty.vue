<template>
  <div class="certificate-empty">
    <div class="main_container" :class="[color]">
      <Icon class="icon" name="signatureThin" :size="48" />
      <div class="text">{{ text }}</div>
      <MainButton v-if="pending" :text="'Обновить'" type="primary-outline" :loading="loading" @click="$emit('refresh')" />
      <MainButton v-else :text="buttonText" type="primary-outline" :loading="loading" @click="$emit('create')" />
    </div>
  </div>
</template>

<script>
import MainButton from '@/components/atoms/MainButton.vue'

export default {
  name: 'CertificateEmpty',
  emits: ['create', 'refresh'],
  components: {
    MainButton
  },
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
  display: flex;
  flex-direction: column;
  align-items: center;
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

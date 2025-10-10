<template>
  <div class="object_logo" :style="{ width: size + 'px', minWidth: size + 'px', height: size + 'px' }">
    <img v-if="!hidden" class="img" :src="src" alt="logo" />
  </div>
</template>

<script>
import { checkImgAvailability } from '@/constants/helpers'

export default {
  name: 'ObjectLogo',
  components: {},
  props: {
    logo: {
      type: String,
      default: '',
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    size: {
      type: Number,
      default: 48,
    },
  },
  data () {
    return {
      src: this.logo,
    }
  },
  computed: {},
  mounted () {
    this.checkLogo()
  },
  unmounted () {},
  watch: {
    logo () {
      this.checkLogo()
    },
  },
  methods: {
    async checkLogo () {
      const isAvailable = await checkImgAvailability(this.logo)
      this.src = isAvailable ? this.logo : require('@/assets/icons/object_logo.svg')
    },
  },
}
</script>

<style lang="scss" scoped>
.object_logo {
  overflow: hidden;
  .img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>

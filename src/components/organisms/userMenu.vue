<template>
  <div class="rq_user_button" @click="onClickProfile">
    <Avatar :width="36" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Avatar from '@/components/atoms/Avatar.vue'

export default {
  components: { Avatar },
  data () {
    return {}
  },
  computed: {
    ...mapGetters('auth', ['isLogged']),
  },
  mounted () {},
  methods: {
    onClickProfile () {
      if (!this.isLogged) this.login()
      this.$router.push('/profile')
    },
    login () {
      this.$router.push('/signin')
    },
  },
}
</script>

<style lang="scss" scoped>
.rq_user_button {
  cursor: pointer;
}
</style>

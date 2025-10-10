<template>
  <div class="avatar_container" :style="{ background, width: width + 'px', height: width + 'px', fontSize }">
    <div v-if="type === 'photo'" class="photo">
      <img v-if="photoUrl" :src="photoUrl" />
      <img v-else src="@/assets/icon_deprecated/camera_dark_blue.svg" />
    </div>
    <div
      v-if="type === 'initials'"
      class="initials"
      :style="{
        width: width + 'px',
        height: width + 'px',
        fontSize: width / 2.6 + 'px',
        lineHeight: width / 2.6 + 'px',
      }"
    >
      <template v-if="initials"> {{ initials }} </template>
      <div v-else class="sign">
        <img src="@/assets/icon_deprecated/user_circle_white.svg" />
      </div>
    </div>
    <div v-if="type === 'sign'" class="sign">
      <img src="@/assets/icon_deprecated/hand.svg" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'avatar',
  components: {},

  props: {
    type: {
      type: String,
      default: 'initials', // 'photo' | 'sign'
    },
    width: {
      type: Number,
      default: 48,
    },
    photoUrl: {
      type: String,
      default: '',
    },
    blue: {
      type: Boolean,
      default: false,
    },
    fontSize: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    preview: null,
    image: null,
  }),
  computed: {
    ...mapGetters('user', ['user']),
    initials () {
      const first = this.user?.firstname?.substr(0, 1) || ''
      const last = this.user?.lastname?.substr(0, 1) || ''
      return first + last
    },
    background () {
      if (this.blue) return '#349CE4'
      return '#BEBEBE'
    },
  },
  watch: {},
  created () {},
  mounted () {},
  methods: {},
}
</script>

<style lang="scss">
.avatar_container {
  border-radius: 50%;
  display: inline-block;
  .initials {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: white;
    height: 100%;
    width: 100%;
  }
  .sign {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    img {
      width: 55%;
      height: 55%;
    }
  }
}
</style>

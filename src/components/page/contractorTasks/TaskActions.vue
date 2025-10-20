<template>
  <component
    v-for="action in actionsList"
    :is="action.component || 'Button'"
    :disabled="loading"
    :key="action.action"
    :type="action.buttonType"
    :size="xl ? 'l' : 'm'"
    @click.stop="$emit('callAction', action)"
    class="actions_button"
    inline
    :color="action.color"
    nowrap
  >
    <img v-if="action.leftIcon" :src="action.leftIcon" />
    <img v-if="action.icon" :src="action.icon" />
    {{ longText ? action.longText : action.text }}
  </component>
</template>

<script>
import MainButton from '@/components/atoms/MainButton.vue'
import ButtonIcon from '@/components/atoms/ButtonIcon.vue'

export default {
  name: 'TaskActions',
  emits: ['callAction'],
  components: { Button: MainButton, ButtonIcon },
  props: {
    actionsList: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    longText: {
      type: Boolean,
      default: false,
    },
    xl: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {},
}
</script>

<style lang="scss" scoped>
@media (max-width: 1000px) {
  .actions_button {
    flex: 1;
  }
}
</style>

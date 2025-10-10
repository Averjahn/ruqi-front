<template>
  <Popup v-model:show="isOpen">
    <PopupContainer class="modal_popup" :title="title" maxWidth="560px" @close="hidePopup">
      <slot />
      <template v-slot:footer>
        <div class="action_block">
          <Button type="outlined" @click="hidePopup">Отмена</Button>
          <Button @click="$emit('confirm')">{{ successText }}</Button>
        </div>
      </template>
    </PopupContainer>
  </Popup>
</template>

<script>
import PopupContainer from '@/components/atoms/PopupContainer.vue'

export default {
  name: 'Modal',
  components: { PopupContainer },
  emits: ['confirm'],
  props: {
    title: {
      type: String,
      default: 'Вы уверены?',
    },
    successText: {
      type: String,
      default: 'Ok',
    },
    maxWidth: {
      type: String,
      default: '560px',
    },
    show: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      isOpen: this.show,
    }
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {
    show (val) {
      this.isOpen = val
    },
  },
  methods: {
    hidePopup () {
      this.$emit('update:show', false)
    },
  },
}
</script>

<style lang="scss" scoped>
.modal_popup {
  .action_block {
    margin-top: 8px;
    display: flex;
    gap: 16px;
    & > div {
      flex: 1;
    }
  }
}
</style>

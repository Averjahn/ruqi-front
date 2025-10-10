<template>
  <div class="block_header">
    <h4><slot /></h4>
    <template v-if="!withoutButton">
      <ButtonText v-if="isEmpty" type="s" @click="$emit('edit')">
        <Icon name="plus" :size="20" /> <span>Добавить</span>
      </ButtonText>
      <ButtonText v-else type="s" @click="$emit('edit')">
        <Icon name="pencil" :size="20" /> <span>Редактировать</span>
      </ButtonText>
    </template>
  </div>
</template>

<script>
export default {
  name: 'BlockHeader',
  components: {},
  props: {
    isEmpty: {
      type: Boolean,
      default: false,
    },
    withoutButton: {
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
.block_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  user-select: none;
  @media (max-width: 768px) {
    span {
      display: none;
    }
  }
}
</style>

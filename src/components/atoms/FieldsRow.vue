<template>
  <div :class="['fields_row', type]">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'FieldsRow',
  components: {},
  props: {
    type: {
      type: String,
      default: 'flex-w200', // flex-flex-flex | flex-flex
    },
  },
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {},
}
</script>

<style lang="scss">
.fields_row {
  display: flex;
  align-items: flex-start;
  gap: 12px;

  &.flex-w200 {
    @media (max-width: 500px) {
      display: contents;
    }
    @media (min-width: 501px) {
      & > div:nth-of-type(1) {
        flex: 1;
      }
      & > div:nth-of-type(2) {
        width: 200px;
        min-width: 200px;
      }
    }
  }

  &.flex-flex-flex {
    @media (max-width: 610px) {
      display: contents;
    }
    @media (min-width: 611px) {
      & > div {
        flex: 1;
      }
    }
  }

  &.flex-flex {
    // В мобильной версии поля остаются по 2 в ряд
    & > div {
      flex: 1;
    }
  }
}
</style>

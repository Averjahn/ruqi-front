<template>
  <div class="accordion" :class="{ open }">
    <div class="header" @click="toggle">
      <div class="header_slot">
        {{ title }}
        <slot name="header" />
      </div>
      <img class="chevron" src="@/assets/icons/chevron_circle.svg" />
    </div>
    <div class="body">
      <div class="content_wrap">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Accordion',
  components: {},
  props: {
    title: {
      type: String,
      default: null,
    },
  },
  data () {
    return {
      open: false,
    }
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    toggle () {
      this.open = !this.open
    },
  },
}
</script>

<style lang="scss" scoped>
.accordion {
  border-top: 1px solid #0000001a;
  border-bottom: 1px solid #0000001a;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    padding: 32px 10px;
    font-style: 20px;
    line-height: 28px;
    font-weight: 600;
    cursor: pointer;
    user-select: none;
    .chevron {
      transition: all 200ms ease-in-out;
    }
  }
  .body {
    overflow: hidden;
    display: grid;
    grid-template-rows: 0fr;
    transition: all 200ms ease-in-out;
    opacity: 0;
  }
  .content_wrap {
    min-height: 0px;
  }

  &.open {
    .body {
      grid-template-rows: 1fr;
      opacity: 1;
    }
    .chevron {
      transform: rotate(180deg);
    }
  }
}
</style>

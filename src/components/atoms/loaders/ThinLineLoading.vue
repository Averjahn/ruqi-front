<template>
  <div class="ThinLineLoading" :class="{ show }"></div>
</template>

<script>
export default {
  name: 'ThinLineLoading',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss">
.ThinLineLoading {
  height: 4.5px;
  width: 100%;
  background: transparent;
  &.show {
    background: linear-gradient(#1735f5 0 0), linear-gradient(#1735f5 0 0), #cdd3ff;
    background-size: 60% 100%;
    background-repeat: no-repeat;
    animation: progress-7x9cg2 2.5s infinite;
  }
}

@keyframes progress-7x9cg2 {
  0% {
    background-position:
      -150% 0,
      -150% 0;
  }

  66% {
    background-position:
      250% 0,
      -150% 0;
  }

  100% {
    background-position:
      250% 0,
      250% 0;
  }
}
</style>

<template>
  <div class="spinner">
    <svg viewBox="0 0 50 50" class="spinner__svg">
      <defs>
        <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="25%" stop-color="#D5D5D6" />
          <stop offset="76%" stop-color="#4F4F4F" />
        </linearGradient>
      </defs>
      <circle
        class="spinner__circle"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="url(#spinner-gradient)"
        stroke-width="4"
        stroke-linecap="round"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'Spinner'
}
</script>

<style lang="scss" scoped>
.spinner {
  display: inline-block;
  width: 48px;
  height: 48px;
}

.spinner__svg {
  animation: rotate 1.4s linear infinite;
  transform-origin: center;
  fill: none;
  stroke: none;
}

.spinner__circle {
  stroke-dasharray: 60, 150;
  stroke-dashoffset: 0;
  animation: dash 1.2s ease-in-out infinite;
}

/* вращение */
@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

/* пульсирующее движение штриха */
@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 60, 150;
    stroke-dashoffset: -30;
  }
  100% {
    stroke-dasharray: 60, 150;
    stroke-dashoffset: -90;
  }
}
</style>

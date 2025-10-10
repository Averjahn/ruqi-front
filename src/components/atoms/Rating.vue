<template>
  <div class="wrap-rating">
    <div v-if="oneStar" class="rating">
      <img src="@/assets/icon_deprecated/star-full.svg" alt="star" />
    </div>

    <div v-else class="rating">
      <img v-for="(star, index) in new Array(5)" :key="index" :src="getIcon(index)" alt="star" />
    </div>

    <span class="grey--text text--lighten-2 text-caption mr-2">
      {{ rating }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'RatingComponent',
  props: {
    rating: {
      type: [Number, String],
    },
    oneStar: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '#FFCB45',
    },
  },
  methods: {
    getIcon (index) {
      index = index + 1
      let icon = 'star-empty'
      if (index < Math.floor(this.rating) || (index === Math.floor(this.rating) && Number.isInteger(this.rating))) {
        icon = 'star-full'
      }

      if (index === Math.floor(this.rating) && index !== this.rating) {
        icon = 'star-half'
      }

      return require(`@/assets/icon_deprecated/${icon}.svg`)
    },
  },
}
</script>

<style lang="scss" scoped>
.rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wrap-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}
</style>

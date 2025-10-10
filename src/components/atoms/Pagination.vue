<template>
  <div class="pagination" :class="{ adaptive: isAdaptive }">
    <button v-if="currentPage > 1" class="pagination_button" @click="goToPage(currentPage - 1)">
      <Icon class="action_icon" :size="16" name="paginationArrowLeft" />
    </button>
    <button
      v-if="(currentPage > 2 && !isAdaptive && totalPages > 3) || (currentPage > 2 && isAdaptive  && totalPages > 3)"
      class="pagination_button"
      @click="goToPage(1)"
    >
      1
    </button>

    <button
      v-if="(currentPage > 3 && totalPages > 4 && !isAdaptive) || (currentPage > 2 && isAdaptive  && totalPages > 3)"
      class="pagination_button"
      @click="goToPage(!isAdaptive ? visiblePages[0] - 1 : currentPage - 1)"
    >
      ...
    </button>

    <button
      v-for="page in visiblePages"
      :key="page"
      :disabled="currentPage === page"
      :class="['pagination_button', { active: page === currentPage }]"
      @click="goToPage(page)"
    >
      {{ page }}
    </button>

    <button
      v-if="
        (currentPage < totalPages - 2 && totalPages > 4 && !isAdaptive) || (currentPage < totalPages - 1 && isAdaptive  && totalPages > 3)
      "
      class="pagination_button"
      @click="goToPage(!isAdaptive ? visiblePages.pop() + 1 : currentPage + 1)"
    >
      ...
    </button>

    <button
      v-if="
        (currentPage <= totalPages - 2 && !isAdaptive  && totalPages > 3) || (isAdaptive && currentPage < totalPages && totalPages > 3)
      "
      class="pagination_button"
      @click="goToPage(totalPages)"
    >
      {{ totalPages }}
    </button>

    <button v-if="currentPage < totalPages" class="pagination_button" @click="goToPage(currentPage + 1)">
      <Icon class="action_icon" :size="16" name="paginationArrowRight" />
    </button>
  </div>
</template>

<script>
import Icon from './icon/Icon.vue'

export default {
  props: {
    totalPages: { type: Number, required: true },
    currentPage: { type: Number, required: true },
  },
  data () {
    return {
      isAdaptive: window.innerWidth <= 768,
    }
  },
  computed: {
    visiblePages () {
      if (this.isAdaptive) {
        if (this.currentPage <= 2) {
          return [1, 2].filter((page) => page <= this.totalPages)
        }
        if (this.currentPage >= this.totalPages) {
          return [this.currentPage - 1, this.currentPage]
        }
        return [this.currentPage]
      }

      if (this.totalPages <= 3) {
        const pages = []
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i)
        }
        return pages
      }

      if (this.currentPage <= 2 && this.totalPages > 3) {
        return [1, 2, 3].filter((page) => page <= this.totalPages)
      }

      if (this.currentPage >= this.totalPages - 1) {
        return [this.totalPages - 2, this.totalPages - 1, this.totalPages].filter((page) => page <= this.totalPages)
      }
      return [this.currentPage - 1, this.currentPage, this.currentPage + 1].filter((page) => page <= this.totalPages)
    },
  },

  async mounted () {
    window.addEventListener('resize', this.checkAdaptive)
  },
  beforeUnmount () {
    window.removeEventListener('resize', this.checkAdaptive)
  },
  methods: {
    goToPage (page) {
      this.$emit('page-change', page)
    },
    checkAdaptive () {
      this.isAdaptive = window.innerWidth <= 768
    },
  },
}
</script>

<style scoped lang="scss">
.pagination {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  &.adaptive {
    gap: 4px;
  }
}

.pagination_button {
  box-sizing: border-box;
  height: 36px;
  width: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  width: 36px;
  vertical-align: middle;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  color: #263043;
  background-color: transparent;
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  &:hover {
    background-color: #f3faff;
  }
  &:active {
    color: #1735f5;
  }
  &:focus {
    outline: none;
    border-color: transparent;
  }

  &:focus-visible {
    border-color: #1aa0ff;
  }
}
.action_icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination_button.active {
  background-color: #1735f5;
  color: #fff;
  &:hover:not(:disabled) {
    background-color: #b0baff;
  }
  &:active:not(:disabled) {
    background-color: #03123a;
  }
  &:focus {
    outline: none;
    border-color: transparent;
  }

  &:focus-visible {
    border-color: #1aa0ff;
  }
}

.pagination_dots {
  cursor: pointer;
  background: none;
  border: none;
  color: #555;
}
</style>

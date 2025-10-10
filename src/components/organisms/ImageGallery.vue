<template>
  <div class="image_gallery">
    <div class="preview_block">
      <div v-if="!isStories" class="gallery_title">Чем предстоит заниматься</div>
      <div class="thumbnail_scroll" :class="{ isStories }">
        <div
          v-for="(item, index) in todoList"
          :key="index"
          class="thumbnail_item"
          :class="{ isStories, isViewed: item.is_viewed }"
          @click.stop="openGallery(index, item)"
        >
          <img
            :src="item.thumbnail"
            :alt="item.title || 'Gallery image'"
            class="thumbnail_image"
            :class="{ isStories }"
          />
          <div class="thumbnail_overlay">
            <div class="thumbnail_title">{{ item.title }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="gallery_modal" :class="{ modal_visible: isOpen }" @click.stop="closeGallery">
      <div class="modal_content">
        <div v-if="!isStories" class="ghost_icon modal_nav prev" @click.stop="prevSlide">
          <Icon class="icon" name="arrowLeft" :size="28" />
        </div>
        <div class="modal_slide" @click.stop>
          <div v-if="!isStories" class="progress_indicator">
            <div
              v-for="(item, index) in todoList"
              :key="index"
              class="progress_item"
              :class="{ active: currentIndex === index }"
            ></div>
          </div>
          <ButtonIconGhost class="ghost_icon modal_close" @click.stop="closeGallery">
            <img class="icon" src="@/assets/icons/close_rounded_filled.svg" />
          </ButtonIconGhost>
          <img :src="activeItem.main" :alt="activeItem.title || 'Gallery image'" @click.stop class="modal_image" />
          <div class="modal_overlay">
            <h2 class="modal_title">{{ activeItem.title }}</h2>
            <p class="modal_description">{{ activeItem.description }}</p>
            <Button
              v-if="activeItem.button_url && activeItem.button_text"
              class="button"
              @click="openBtnUrl(activeItem.button_url)"
            >
              {{ activeItem.button_text }}
            </Button>
          </div>
        </div>
        <div v-if="!isStories" class="ghost_icon modal_nav next" @click.stop="nextSlide">
          <Icon class="icon" name="arrowRight" :size="28" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageGallery',
  props: {
    isStories: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      required: true,
      validator: (items) => items.every((item) => item.thumbnail && item.main),
    },
    makeViewed: {
      type: Function,
      default: null,
    },
  },
  data () {
    return {
      isOpen: false,
      currentIndex: 0,
      touchStartX: 0,
      touchEndX: 0,
    }
  },
  computed: {
    todoList () {
      return this.items
    },
    activeItem () {
      return this.todoList[this.currentIndex] || {}
    },
  },
  methods: {
    openGallery (index, item) {
      this.currentIndex = index
      this.isOpen = true
      document.body.style.overflow = 'hidden'
      if (this.makeViewed && !item.is_viewed) {
        this.makeViewed(item)
      }
    },
    closeGallery () {
      this.isOpen = false
      document.body.style.overflow = ''
    },
    nextSlide () {
      this.currentIndex = (this.currentIndex + 1) % this.items.length
    },
    prevSlide () {
      this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length
    },
    handleTouchStart (e) {
      this.touchStartX = e.touches[0].clientX
    },
    handleTouchEnd (e) {
      this.touchEndX = e.changedTouches[0].clientX
      this.handleSwipe()
    },
    handleSwipe () {
      const deltaX = this.touchEndX - this.touchStartX
      const swipeThreshold = 50
      if (Math.abs(deltaX) > swipeThreshold) {
        deltaX > 0 ? this.prevSlide() : this.nextSlide()
      }
    },
    openBtnUrl (url) {
      window.open(url, '_blank')
    },
  },
}
</script>

<style lang="scss" scoped>
.image_gallery {
  width: 100%;
  --modal-bg: rgba(0, 0, 0, 0.4);
  --text-color: #fff;
  --nav-button-size: 28px;
  --header-height: 60px;
  --bottom-height: 64px;
}
.preview_block {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.gallery_title {
  font-weight: 600;
  font-size: 18px;
  line-height: 100%;
  letter-spacing: 0%;
}

.thumbnail_scroll {
  display: flex;
  overflow-x: auto;
  gap: 8px;
  padding: 4px 0;
  scrollbar-width: none;
  &.isStories {
    gap: 16px;
  }

  &::-webkit-scrollbar {
    display: none;
  }
}

.thumbnail_item {
  position: relative;
  flex: 0 0 96px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  &.isStories {
    border: 2px solid #1735f5;
    border-radius: 14px;
    height: 148px;
    flex: 0 0 148px;
  }
  &.isViewed {
    border-color: #dadada;
  }

  &:hover {
    .thumbnail_image {
      transform: scale(1.03);
    }
  }
  &:hover:not(.isStories) {
    border: 1.5px solid #1735f5;
  }
  transition: transform 0.2s;
}

.thumbnail_image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  &.isStories {
    border: 2px solid #f6f8fb;
    border-radius: 14px;
  }
}

.thumbnail_overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  padding: 12px;
  background: linear-gradient(180deg, rgba(63, 59, 59, 0) 0.11%, rgba(0, 0, 0, 0.57) 59.93%);
  display: flex;
  align-items: flex-end;
}

.thumbnail_title {
  font-weight: 500;
  font-size: 12px;
  line-height: 1.2;
  color: #fff;
  width: 100%;
  max-height: 2.4em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.gallery_modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--modal-bg);
  display: none;
  z-index: 1000;
  touch-action: manipulation;

  &.modal_visible {
    display: block;
  }
}
.gallery_modal img,
.gallery_modal svg,
.gallery_modal button {
  user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
}
.gallery_modal {
  * {
    user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
  }
}

.modal_content {
  position: relative;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.modal_slide {
  position: relative;
  width: 100%;
  max-width: 375px;
  height: 100%;
  max-height: 796px;
  .progress_indicator {
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 6px;
    z-index: 2;

    .progress_item {
      width: 24px;
      height: 3px;
      background: #f3faff;
      border-radius: 2px;
      transition: all 0.3s ease;

      &.active {
        background: #1735f5;
        width: 40px;
      }
    }
  }
  .modal_close {
    position: absolute;
    top: 26px;
    right: 16px;
    background: none;
    border: none;
    color: var(--text-color);
    cursor: pointer;
    z-index: 2;
  }
}
.ghost_icon {
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  transition: all 0.2s ease;
  .icon {
    display: block;
    width: 28px;
    height: 28px;
    transition:
      color 0.2s ease,
      transform 0.2s ease;

    :deep(svg) {
      vertical-align: top;
    }
  }
  &:hover {
    color: #263043;
    &.substrate {
      background-color: transparent;
    }
  }
}

.modal_image {
  border-radius: 8px;
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
}

.modal_overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  padding: 20px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  background: linear-gradient(180deg, rgba(63, 59, 59, 0) 0.11%, rgba(0, 0, 0, 0.57) 59.93%);
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: flex-end;
  color: var(--text-color);
}

.modal_title {
  font-weight: 700;
  font-size: 24px;
  line-height: 1.2;
  margin-bottom: 12px;
  overflow: hidden;
  white-space: normal;
}

.modal_description {
  font-weight: 400;
  font-size: 16px;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.modal_nav {
  transform: translateY(-50%);
  border: none;
  color: var(--text-color);
  border-radius: 50%;
  cursor: pointer;
  z-index: 2;
}

@media (max-width: 768px) {
  .thumbnail_scroll {
    &.isStories {
      gap: 8px;
    }
  }
  .thumbnail_item {
    &.isStories {
      border-width: 1px;
      border-radius: 8px;
      height: 80px;
      flex: 0 0 80px;
    }
  }
  .thumbnail_image {
    &.isStories {
      border-width: 1px;
      border-radius: 8px;
    }
  }
  .modal_overlay {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
  .modal_image {
    border-radius: 0;
  }
  .gallery_title {
    font-size: 16px;
  }
  .gallery_modal {
    bottom: var(--bottom-height);
    top: var(--header-height);
  }
  .modal_content {
    height: calc(100dvh - var(--bottom-height) - var(--header-height));
  }
  .modal_slide {
    max-width: 100%;
    max-height: 100%;
  }
  .modal_nav {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    &.prev {
      left: 1rem;
    }
    &.next {
      right: 1rem;
    }
  }
  .modal_title {
    font-size: 20px;
  }

  .modal_description {
    font-size: 14px;
    line-clamp: 2;
  }
}
</style>

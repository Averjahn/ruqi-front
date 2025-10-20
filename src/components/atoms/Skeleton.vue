<template>
  <div 
    class="skeleton" 
    :class="[
      `skeleton--${variant}`,
      { 'skeleton--animated': animated }
    ]"
    :style="skeletonStyles"
  >
    <div v-if="variant === 'card'" class="skeleton__card">
      <div class="skeleton__avatar"></div>
      <div class="skeleton__content">
        <div class="skeleton__line skeleton__line--title"></div>
        <div class="skeleton__line skeleton__line--subtitle"></div>
        <div class="skeleton__line skeleton__line--text"></div>
      </div>
    </div>
    
    <div v-else-if="variant === 'text'" class="skeleton__text">
      <div 
        v-for="(line, index) in lines" 
        :key="index"
        class="skeleton__line"
        :class="`skeleton__line--${line.type}`"
      ></div>
    </div>
    
    <div v-else-if="variant === 'avatar'" class="skeleton__avatar"></div>
    
    <div v-else-if="variant === 'button'" class="skeleton__button"></div>
    
    <div v-else-if="variant === 'image'" class="skeleton__image"></div>
    
    <div v-else class="skeleton__default"></div>
  </div>
</template>

<script>
export default {
  name: 'Skeleton',
  props: {
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'card', 'text', 'avatar', 'button', 'image'].includes(value)
    },
    width: {
      type: [String, Number],
      default: '100%'
    },
    height: {
      type: [String, Number],
      default: '20px'
    },
    lines: {
      type: Number,
      default: 3
    },
    animated: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: '#f0f0f0'
    },
    highlightColor: {
      type: String,
      default: '#e0e0e0'
    }
  },
  computed: {
    skeletonStyles() {
      return {
        width: typeof this.width === 'number' ? `${this.width}px` : this.width,
        height: typeof this.height === 'number' ? `${this.height}px` : this.height,
        '--skeleton-color': this.color,
        '--skeleton-highlight': this.highlightColor
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.skeleton {
  --skeleton-color: #f0f0f0;
  --skeleton-highlight: #e0e0e0;
  
  &--animated {
    .skeleton__line,
    .skeleton__avatar,
    .skeleton__button,
    .skeleton__image,
    .skeleton__default {
      background: linear-gradient(
        90deg,
        var(--skeleton-color) 25%,
        var(--skeleton-highlight) 50%,
        var(--skeleton-color) 75%
      );
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite;
    }
  }
  
  &--card {
    .skeleton__card {
      display: flex;
      gap: 12px;
      padding: 16px;
      border: 1px solid #e8e8e8;
      border-radius: 8px;
      background: #fff;
    }
    
    .skeleton__avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    
    .skeleton__content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }
  
  &--text {
    .skeleton__text {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }
  
  &--avatar {
    .skeleton__avatar {
      border-radius: 50%;
    }
  }
  
  &--button {
    .skeleton__button {
      border-radius: 6px;
    }
  }
  
  &--image {
    .skeleton__image {
      border-radius: 8px;
    }
  }
}

.skeleton__line {
  height: 16px;
  background: var(--skeleton-color);
  border-radius: 4px;
  
  &--title {
    width: 70%;
    height: 20px;
  }
  
  &--subtitle {
    width: 50%;
    height: 16px;
  }
  
  &--text {
    width: 100%;
    height: 14px;
  }
  
  &--short {
    width: 60%;
  }
  
  &--medium {
    width: 80%;
  }
  
  &--long {
    width: 100%;
  }
}

.skeleton__avatar {
  width: 48px;
  height: 48px;
  background: var(--skeleton-color);
  border-radius: 50%;
}

.skeleton__button {
  width: 100px;
  height: 32px;
  background: var(--skeleton-color);
  border-radius: 6px;
}

.skeleton__image {
  width: 100%;
  height: 200px;
  background: var(--skeleton-color);
  border-radius: 8px;
}

.skeleton__default {
  width: 100%;
  height: 20px;
  background: var(--skeleton-color);
  border-radius: 4px;
}

@keyframes skeleton-loading {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>

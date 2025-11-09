<template>
  <div class="faq-accordion-item">
    <div class="faq-accordion-item__header" @click="toggleCollapse">
      <h3 class="faq-accordion-item__title">{{ title }}</h3>
      <img
        :src="require('@/assets/icons/FAQ/circle-arrow.svg')"
        alt="Toggle"
        class="faq-accordion-item__arrow"
        :class="{ 'faq-accordion-item__arrow--rotated': !isCollapsed }"
      />
    </div>
    <div v-if="!isCollapsed" class="faq-accordion-item__content">
      <ul class="faq-accordion-item__links">
        <li v-for="(link, index) in links" :key="index" class="faq-accordion-item__link-item">
          <a
            :href="link.to || '#'"
            :class="{ 'faq-accordion-item__link--underlined': link.underlined }"
            @click.prevent="handleLinkClick(link)"
          >
            – {{ link.text }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FaqAccordionItem',
  props: {
    title: {
      type: String,
      required: true
    },
    links: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isCollapsed: true
    }
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed
    },
    handleLinkClick(link) {
      console.log('Link clicked:', link.text)
      if (link.to) {
        // this.$router.push(link.to)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.faq-accordion-item {
  background-color: transparent; /* Цвет фона как у страницы */
  justify-self: center;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 72px;
    padding: 0 32px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    box-sizing: border-box;

    @media (max-width: 768px) {
      height: 72px;
      padding: 0 16px;
    }
  }

  &__title {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 600;
    font-style: normal;
    font-size: 18px;
    line-height: 100%; /* 100% от размера шрифта */
    letter-spacing: 0%;
    color: #263043;
    margin: 0;
  }

  &__arrow {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    transition: transform 0.3s ease;

    &--rotated {
      transform: rotate(180deg);
    }
  }

  &__content {
    padding: 24px 32px 24px; /* padding-top: 24px для расстояния между заголовком и текстом */

    @media (max-width: 768px) {
      padding: 24px 16px 16px; /* padding-top: 24px для мобильных */
    }
  }

  &__links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__link-item {
    margin: 0;

    a {
      font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
      font-weight: 400;
      font-size: 16px;
      line-height: 22px;
      color: #666666;
      text-decoration: none;
      cursor: pointer;
      transition: color 0.2s ease;

      &:hover {
        color: #263043;
        text-decoration: underline;
      }

      &--underlined {
        text-decoration: underline;
      }
    }
  }
}
</style>


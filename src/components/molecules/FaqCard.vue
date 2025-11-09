<template>
  <div class="faq-card">
    <h3 class="faq-card__title">{{ title }}</h3>
    <ul class="faq-card__list">
      <li
        v-for="(link, index) in links"
        :key="index"
        class="faq-card__item"
      >
        <router-link
          v-if="link.to"
          :to="link.to"
          class="faq-card__link"
          :class="{ 'faq-card__link--underlined': link.underlined }"
        >
          – {{ link.text }}
        </router-link>
        <a
          v-else-if="link.href"
          :href="link.href"
          class="faq-card__link"
          :class="{ 'faq-card__link--underlined': link.underlined }"
        >
          – {{ link.text }}
        </a>
        <span
          v-else
          class="faq-card__link"
          :class="{ 'faq-card__link--underlined': link.underlined }"
        >
          – {{ link.text }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'FaqCard',
  props: {
    title: {
      type: String,
      required: true
    },
    links: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.faq-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px;
  background: #ffffff;
  border: none;
  border-radius: 16px;
  flex: 1;
  min-width: 0; /* Позволяет карточке сжиматься меньше минимального размера контента */
  box-shadow: none;
  width: 100%; /* Карточка занимает всю доступную ширину в grid ячейке */
}

.faq-card__title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
  color: #263043;
  margin: 0;
  padding-bottom: 8px;
}

.faq-card__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.faq-card__item {
  margin: 0;
}

.faq-card__link {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #666666;
  text-decoration: none;
  cursor: default;

  &--underlined {
    text-decoration: none;
  }
}

@media (max-width: 1000px) {
  .faq-card {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .faq-card {
    padding: 20px;
  }
}

@media (max-width: 440px) {
  .faq-card {
    padding: 16px;
  }
}
</style>


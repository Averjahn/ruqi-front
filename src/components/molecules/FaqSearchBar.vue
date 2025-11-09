<template>
  <div class="faq-search-bar">
    <h2 class="faq-search-bar__title">Чем мы можем вам помочь?</h2>
    <div class="faq-search-bar__actions">
      <div class="faq-search-bar__input-wrapper">
        <Input
          v-model="searchValue"
          placeholder="Поиск"
          class="faq-search-bar__input"
          @input="handleSearch"
        >
          <template #left>
            <img src="@/assets/icons/magnifier.svg" alt="Search" />
          </template>
        </Input>
      </div>
      <MainButton
        type="primary"
        text="Создать обращение"
        :full-width="isMobile"
        @click="handleCreateRequest"
        class="faq-search-bar__button"
      />
    </div>
  </div>
</template>

<script>
import Input from '@/components/atoms/Input.vue'
import MainButton from '@/components/atoms/MainButton.vue'

export default {
  name: 'FaqSearchBar',
  components: {
    Input,
    MainButton
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'search', 'create-request'],
  data() {
    return {
      searchValue: this.modelValue,
      isMobile: false
    }
  },
  mounted() {
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile)
  },
  watch: {
    modelValue(newVal) {
      this.searchValue = newVal
    },
    searchValue(newVal) {
      this.$emit('update:modelValue', newVal)
    }
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 768
    },
    handleSearch() {
      this.$emit('search', this.searchValue)
    },
    handleCreateRequest() {
      this.$emit('create-request')
    }
  }
}
</script>

<style lang="scss" scoped>
.faq-search-bar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.faq-search-bar__title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 32px;
  line-height: 40px;
  color: #263043;
  margin: 0;
  text-align: center;
}

.faq-search-bar__actions {
  display: flex;
  flex-direction: row; /* Для ПК: инпут и кнопка на одной строке */
  align-items: center;
  gap: 16px; /* Для ПК: отступ между инпутом и кнопкой */
  flex-wrap: wrap;
  width: 100%;
}

.faq-search-bar__input-wrapper {
  flex: 1;
  min-width: 300px;
}

.faq-search-bar__input {
  width: 100%;
}

.faq-search-bar__button {
  min-width: 220px;
  height: 48px;
}

/* Мобильная адаптация только на экранах <= 768px */
@media (max-width: 768px) {
  .faq-search-bar {
    gap: 19px; /* Для мобильных: отступ между текстом и инпутом */
  }

  .faq-search-bar__title {
    font-size: 24px;
    line-height: 30px;
  }

  .faq-search-bar__actions {
    flex-direction: column; /* Для мобильных: инпут и кнопка вертикально */
    gap: 19px; /* Для мобильных: отступ между инпутом и кнопкой */
    width: 100%;
  }

  .faq-search-bar__input-wrapper {
    width: 100%; /* Для мобильных: инпут на всю ширину */
  }

  .faq-search-bar__button {
    width: 100%; /* Для мобильных: кнопка на всю ширину */
  }
}
</style>


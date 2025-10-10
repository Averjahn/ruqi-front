<template>
  <article class="passport__data-block">
    <div class="passport__data-block-title">Место рождения</div>
    <div class="passport__data-block-value">
      {{ passport.birth_address || '-' }}
    </div>
  </article>

  <div class="passport__row">
    <article class="passport__data-block">
      <div class="passport__data-block-title">Серия и номер паспорта</div>
      <div class="passport__data-block-value">{{ passport.series || '-' }} {{ passport.number || '-' }}</div>
    </article>

    <article class="passport__data-block">
      <div class="passport__data-block-title">Дата выдачи</div>
      <div class="passport__data-block-value">{{ passport.issue_date || '-' }}</div>
    </article>
  </div>

  <div class="passport__row">
    <article class="passport__data-block">
      <div class="passport__data-block-title">Кем выдан</div>
      <div class="passport__data-block-value">{{ passport.issue_organization_name || '-' }}</div>
    </article>

    <article class="passport__data-block">
      <div class="passport__data-block-title">Код подразделения</div>
      <div class="passport__data-block-value">{{ passport.issue_organization_code || '-' }}</div>
    </article>
  </div>

  <div class="passport__row">
    <article class="passport__data-block">
      <div class="passport__data-block-title">Адрес регистрации</div>
      <div class="passport__data-block-value">{{ passport.registration_address || '-' }}</div>
    </article>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    profile: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {}
  },
  computed: {
    passport () {
      return this.profile?.passport || {}
    },
    user () {
      return this.profile?.user || {}
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.passport__row {
  display: flex;
  gap: 48px;
  flex-wrap: wrap;
}
.passport__data-block-title {
  color: #c7c7c7;
  margin-bottom: 4px;
}

.passport__data-block-value {
  font-size: 16px;
}
</style>

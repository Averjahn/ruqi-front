<template>
  <article class="passport__data-block">
    <div class="passport__data-block-title">Место рождения</div>
    <div class="passport__data-block-value">
      {{ passport.birth_address || '-' }}
    </div>
  </article>

  <article v-if="userCitizenship === 'BY'" class="passport__data-block">
    <div class="passport__data-block-title">Номер документа</div>
    <div class="passport__data-block-value">{{ passport.by_number || '-' }}</div>
  </article>

  <article v-else class="passport__data-block">
    <div class="passport__data-block-title">Серия и номер документа</div>
    <div class="passport__data-block-value">{{ getPassportNumber || '-' }}</div>
  </article>

  <article v-if="userCitizenship === 'BY'" class="passport__data-block">
    <div class="passport__data-block-title">Идентификационный номер</div>
    <div class="passport__data-block-value">{{ passport.by_id_number || '-' }}</div>
  </article>

  <div class="passport__row">
    <article class="passport__data-block">
      <div class="passport__data-block-title">Дата выдачи</div>
      <div class="passport__data-block-value">
        {{ passport.issue_date ? $dayjs(passport.issue_date).format('DD.MM.YYYY') : '-' }}
      </div>
    </article>

    <article class="passport__data-block">
      <div class="passport__data-block-title">Срок действия</div>
      <div class="passport__data-block-value">
        {{ passport.expiration_date ? $dayjs(passport.expiration_date).format('DD.MM.YYYY') : '-' }}
      </div>
    </article>
  </div>

  <article class="passport__data-block">
    <div class="passport__data-block-title">Кем выдан</div>
    <div class="passport__data-block-value">{{ passport.issue_organization_name || '-' }}</div>
  </article>

  <article class="passport__data-block">
    <div class="passport__data-block-title">Адрес регистрации в РФ</div>
    <div class="passport__data-block-value">{{ passport.registration_address || '-' }}</div>
  </article>
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
    userCitizenship () {
      return this.profile?.user?.citizenship
    },
    getPassportNumber: {
      get () {
        if (this.userCitizenship === 'AM') {
          return this.passport.am_number
        } else if (this.userCitizenship === 'KZ') {
          return this.passport.kz_number
        } else {
          return this.passport.kg_number
        }
      },
      set (value) {
        if (this.userCitizenship === 'AM') {
          this.passport.am_number = value
        } else if (this.userCitizenship === 'KZ') {
          this.passport.kz_number = value
        } else {
          this.passport.kg_number = value
        }
      },
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

<template>
  <div class="passport__row">
    <article class="passport__data-block">
      <div class="passport__data-block-title">Страна</div>
      <div class="passport__data-block-value">
        {{ user.citizenship_custom_name || '-' }}
      </div>
    </article>

    <article class="passport__data-block">
      <div class="passport__data-block-title">Место рождения</div>
      <div class="passport__data-block-value">
        {{ passport.birth_address || '-' }}
      </div>
    </article>
  </div>

  <article class="passport__data-block">
    <div class="passport__data-block-title">Документ удостоверяющий личность</div>
    <div class="passport__data-block-value">
      {{ idDocument || '-' }}
    </div>
  </article>

  <article class="passport__data-block">
    <div class="passport__data-block-title">Серия и номер документа</div>
    <div class="passport__data-block-value">{{ passport.series_and_number || '-' }}</div>
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
    <div class="passport__data-block-title">Адрес регистрации в РФ</div>
    <div class="passport__data-block-value">{{ passport.registration_address || '-' }}</div>
  </article>
</template>

<script>
import { IDENTITY_DOCUMENT_TYPE } from '@/constants/constants'

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
    idDocument () {
      return IDENTITY_DOCUMENT_TYPE[this.profile?.passport?.identity_document]?.name || '-'
    },
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

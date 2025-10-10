<template>
  <div class="user_documents_status" :style="{ color: getStatusColor}">
    <img :src="require('@/assets/icons/' + icon)" />
    {{ displayedStatus }}
  </div>
</template>

<script>
export default {
  name: 'UserProfileStatus',
  components: {},
  props: {
    status: {
      type: String,
      default: null,
    },
  },
  data () {
    return {}
  },
  computed: {
    getStatusColor () {
      const s = this.status
      if (s === null) return '#F38816'
      if (s === 'confirmed' || s === 'confirm' || s === 'inn_confirmed' || s === 'snilsAdded')
        return '#71D472'
      if (s === 'need_upload' || s === 'not_upload') return '#EB4D3D'
      if (s === 'on_check' || s === 'at_check' || s === 'need_approve') return '#1AA0FF'
      if (s === 'decline' || s === 'declined' || s === 'inn_invalid') return '#EB4D3D'
      return '#EB4D3D'
    },
    displayedStatus () {
      const s = this.status
      if (s === null) return 'Заполните данные'
      if (s === 'snilsAdded') return 'Снилс добавлен'
      if (s === 'snilsNotAdded') return 'Снилс не добавлен'
      if (s === 'confirmed' || s === 'confirm') return 'Документы подтверждены'
      if (s === 'inn_confirmed') return 'ИНН прошёл валидацию'
      if (s === 'inn_invalid') return 'Требуется валидация ИНН'
      if (s === 'need_upload' || s === 'not_upload') return 'Документы не загружены'
      if (s === 'on_check' || s === 'at_check' || s === 'need_approve') return 'Документы на проверке'
      if (s === 'decline' || s === 'declined') return 'Документы отклонены'
      return 'Статус не определён'
    },
    icon () {
      const s = this.status
      if (s === null) return 'document_edit.svg'
      if (s === 'confirmed' || s === 'confirm' || s === 'inn_confirmed' || s === 'snilsAdded')
        return 'document_checked_fill.svg'
      if (s === 'need_upload' || s === 'not_upload') return 'documents_warning.svg'
      if (s === 'on_check' || s === 'at_check' || s === 'need_approve') return 'document_clock.svg'
      if (s === 'decline' || s === 'declined' || s === 'inn_invalid') return 'document_dismiss.svg'
      return 'document_dismiss.svg'
    },
  },
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    open () {},
  },
}
</script>

<style lang="scss" scoped>
.user_documents_status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}
</style>

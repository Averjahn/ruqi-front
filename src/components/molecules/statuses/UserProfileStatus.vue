<template>
  <div class="user_documents_status">
    <img :src="icon" />
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
    displayedStatus () {
      if (this.status === 'doc_confirmed') return 'Документы подтверждены'
      if (this.status === 'doc_need_upload') return 'Документы не загружены'
      if (this.status === 'doc_need_approve') return 'Документы на проверке'
      if (this.status === 'doc_on_check') return 'Документы на проверке'
      if (this.status === 'doc_declined') return 'Документы отклонены'
      return 'Статус не определён'
    },
    icon () {
      if (this.status === 'doc_confirmed') return require('@/assets/icons/checkmark_starburst.svg')
      if (this.status === 'doc_need_upload') return require('@/assets/icons/document_prohibited.svg')
      if (this.status === 'doc_need_approve') return require('@/assets/icons/document_clock.svg')
      if (this.status === 'doc_on_check') return require('@/assets/icons/document_clock.svg')
      if (this.status === 'doc_declined') return require('@/assets/icons/document_dismiss.svg')
      return require('@/assets/icons/document_dismiss.svg')
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
  color: #666666;
  img {
    width: 20px;
    min-width: 20px;
    height: 20px;
  }
  @media (max-width: 1000px) {
    font-size: 14px;
    gap: 4px;
    img {
      width: 16px;
      min-width: 16px;
      height: 16px;
    }
  }
}
</style>

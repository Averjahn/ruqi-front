<template>
  <div class="documents_block">
    <Block class="other_documents">
      <div class="other_documents_title">
        <div class="main_block">Паспорт</div>
      </div>
      <BlockDocument hovered @click="openPopup('PassportPopup')" class="other_document">
        <div class="name">Паспорт и паспортные данные <img src="@/assets/icons/chevron.svg" /></div>
        <UserDocumentStatus :status="profile?.documents?.passport" />
      </BlockDocument>
    </Block>

    <Block class="other_documents">
      <div class="other_documents_title">
        <div class="main_block"><img v-if="notExistPassport" src="@/assets/icons/lock.svg" /> Документы</div>
        <div v-if="notExistPassport" class="description_block">
          Пожалуйста, заполните паспортные данные, чтобы загрузить остальные документы
        </div>
      </div>
      <BlockDocument
        v-for="item in documents"
        :key="item.comp"
        class="other_document"
        :class="{ block_document: notExistPassport }"
        hovered
        @click="openPopup(item.comp)"
      >
        <div class="name">{{ item.name }} <img src="@/assets/icons/chevron.svg" /></div>
        <UserDocumentStatus :status="profile?.documents?.[item.status]" />
      </BlockDocument>
      <BlockDocument
        hovered
        @click="openPopup('SnilsPopup')"
        class="other_document"
        :class="{ block_document: notExistPassport }"
      >
        <div class="name">Снилс <img src="@/assets/icons/chevron.svg" /></div>
        <UserDocumentStatus :status="snilsStatus" />
      </BlockDocument>
    </Block>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import UserDocumentStatus from '@/components/molecules/statuses/UserDocumentStatus.vue'
import Block from '@/components/page/profile/Block.vue'
import BlockDocument from '@/components/page/profile/documentsBlock/BlockDocument.vue'
import usePopup from '@/composables/usePopup'

const documents = [
  // { comp: 'PassportPopup', name: 'Паспорт', status: 'passport' },
  { comp: 'MedicalBookPopup', name: 'Медицинская книжка', status: 'medical_book' },
  { comp: 'DriveLicensePopup', name: 'Водительское удостоверение', status: 'driver_license' },
  { comp: 'DriveTractorLicensePopup', name: 'Удостоверение тракториста-машиниста ', status: 'tractor_driver_license' },
]
const documentsBy = [
  { comp: 'RegistrationInRfPopup', name: 'Документ о регистрации в РФ', status: 'document_registration_in_rf' },
]
const documentsEAEU = [
  ...documentsBy,
  { comp: 'MigrationCardPopup', name: 'Миграционная карта', status: 'migration_card' },
]
const documentsOther = [...documentsEAEU, { comp: 'PatentPopup', name: 'Патент', status: 'patent' }]
export default {
  name: 'DocumentsBlock',
  components: {
    Block,
    UserDocumentStatus,
    BlockDocument,
  },
  setup () {
    const { initPopup } = usePopup()
    return { initPopup }
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters('profilePage', ['profile']),
    ...mapGetters('user', ['user']),
    snilsStatus () {
      return this.profile?.user?.settings?.snils ? 'snilsAdded' : 'snilsNotAdded'
    },
    userPassport () {
      return this.profile?.passport || null
    },
    notExistPassport () {
      return this.profile?.passport?.id ? false : true
    },
    citizenship () {
      return this.profile?.user?.citizenship
    },
    documents () {
      return this.citizenship === 'RU'
        ? documents
        : this.citizenship === 'BY'
          ? [...documents, ...documentsBy]
          : ['AM', 'KZ', 'KG'].includes(this.citizenship)
            ? [...documents, ...documentsEAEU]
            : [...documents, ...documentsOther]
    },
  },
  mounted () {
    this.fetchProfileOnce()
  },
  methods: {
    ...mapActions('profilePage', ['fetchProfileOnce']),
    async openPopup (popup) {
      const component = await import(`@/components/organisms/popups/${popup}.vue`)
      if (component) this.initPopup(component.default)
    },
  },
}
</script>

<style lang="scss" scoped>
.documents_block {
  display: flex;
  flex-direction: column;
  gap: 16px;
  .name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    font-size: 20px;
    line-height: 28px;
    font-weight: 600;
    margin-bottom: 8px;
  }
}
.other_documents {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.other_documents_title {
  display: flex;
  flex-direction: column;
  gap: 8px;
  .main_block {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 24px;
    font-weight: 600;
    line-height: 125%;
    letter-spacing: 0%;
    vertical-align: middle;
  }
  .description_block {
    font-size: 16px;
    line-height: 22px;
    color: #666666;
    letter-spacing: 0%;
  }
}
.other_document {
  border: 1px solid #0000001a;
  &.block_document {
    user-select: none;
    pointer-events: none;
    opacity: 20%;
  }
}
</style>

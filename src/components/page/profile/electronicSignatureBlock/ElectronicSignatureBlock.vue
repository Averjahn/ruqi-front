<template>
  <Popup v-model:show="isPopupOpen">
    <ElectronicSignaturePopup
      :openedCertificate="openedCertificate"
      :window="window"
      @close="isPopupOpen = false"
      @setPending="pending = true"
    />
  </Popup>

  <div class="electronic_signature_block">
    <BlockHeader class="mb_12" withoutButton>Электронно-цифровая подпись </BlockHeader>

    <div class="sub_title">
      Электронно-цифровая подпись (ЭЦП) используется для подписания вами договоров, актов выполненных работ и прочих
      электронных документов
    </div>

    <template v-if="isPassportExist">
      <Tabs class="mb_24" :value="activeTab" :tabs="tabs" @change="changeTab" type="flat" />

      <Window :activeTab="activeTab">
        <template #active>
          <CertificateEmpty
            v-if="!activeCertificate?.uuid"
            class="empty"
            :loading="loading"
            :pending="pending"
            type="empty"
            @create="create"
            @refresh="refreshCertificate"
          />
          <div v-else class="certificate_wrap">
            <Certificate
              :key="activeCertificate.uuid"
              :certificate="activeCertificate"
              @open="showCertificate(activeCertificate)"
              @reissue="create"
              @updateStatus="updateStatus"
            />
          </div>
        </template>

        <template #archive>
          <div class="empty" v-if="!archiveCertificates.length">ЭЦП отсутствует</div>
          <div v-else class="certificate_wrap">
            <Certificate
              v-for="certificate in archiveCertificates"
              :key="certificate.uuid"
              :certificate="certificate"
              @open="showCertificate(certificate)"
              :loading="loading"
            />
          </div>
        </template>
      </Window>
    </template>
    <div v-else-if="!loading && !isPassportExist" class="empty">
      Сначала необходимо заполнить паспортные данные или дождаться подтверждения паспорта.
    </div>
  </div>
</template>

<script>
//import Button from '@/components/atoms/Button.vue'
import ElectronicSignaturePopup from '@/components/organisms/popups/ElectronicSignaturePopup.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import BlockHeader from '@/components/page/profile/BlockHeader.vue'
import Certificate from '@/components/molecules/Certificate.vue'
import CertificateEmpty from '@/components/molecules/CertificateEmpty.vue'

export default {
  components: { BlockHeader, ElectronicSignaturePopup, Certificate, CertificateEmpty },
  props: {},
  data () {
    return {
      loading: false,
      isPopupOpen: false,
      openedCertificate: null,
      window: '',
      activeTab: 'active',
      pending: false,
      tabs: [
        { text: 'Действующие', value: 'active' },
        { text: 'Архивные', value: 'archive' },
      ],
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    ...mapGetters('profilePage', ['certificates', 'activeCertificate', 'profile']),
    archiveCertificates () {
      return this.certificates?.filter((item) => item.status === 'archive')
    },
    isPassportExist () {
      return this.profile?.documents?.passport === 'confirmed'
    },
  },
  watch: {
    isPassportExist: {
      handler (newValue) {
        if (newValue) {
          this.loadCertificate()
        }
      },
      immediate: true,
    },
  },
  mounted () {
    if (this.isPassportExist) this.loadCertificate()
  },
  methods: {
    ...mapActions('profilePage', [
      'fetchProfile',
      'fetchActiveCertificateOnce',
      'fetchActiveCertificate',
      'fetchArchiveCertificatesOnce',
      'fetchArchiveCertificates',
    ]),
    ...mapActions('notifications', ['showNotification']),
    ...mapMutations('profilePage', ['setCertificate']),

    showCertificate (certificate) {
      this.openedCertificate = certificate
      this.isPopupOpen = true
      this.window = 'show_signature'
    },

    changeTab (tab) {
      this.activeTab = tab
      if (tab === 'archive') {
        this.fetchArchiveCertificatesOnce()
      }
    },

    async loadCertificate () {
      if (this.loading) return
      this.loading = true
      await this.fetchActiveCertificateOnce()
      this.loading = false
    },

    create () {
      this.isPopupOpen = true
      this.window = 'generate_signature'
    },

    async refreshCertificate () {
      const refreshResult = await this.fetchActiveCertificate()
      if (refreshResult?.data.success) {
        if (refreshResult?.data?.data?.status === 'active') {
          this.pending = false
          this.fetchArchiveCertificatesOnce()
        }
      }
    },

    async updateStatus () {
      if (this.loading) return
      this.loading = true
      await this.fetchActiveCertificate()
      this.fetchArchiveCertificatesOnce()
      this.loading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.electronic_signature_block {
  .sub_title {
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 18px;
  }
  .empty {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 46px;
    color: #666;
  }
  .certificate_wrap {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
}
</style>

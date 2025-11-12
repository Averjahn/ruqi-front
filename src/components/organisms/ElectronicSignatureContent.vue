<template>
  <div class="electronic-signature-content">
    <!-- Tabs -->
    <div class="electronic-signature-content__tabs-wrapper">
      <Tabs
        :tabs="tabs"
        :value="activeTab"
        @change="handleTabChange"
        type="underlined"
        item-value="id"
        item-text="label"
        class="electronic-signature-content__tabs"
      />
    </div>

    <!-- Active Certificates -->
    <div v-if="activeTab === 'active'" class="electronic-signature-content__certificates">
      <CertificateEmpty
        v-if="activeCertificates.length === 0"
        type="empty"
        :loading="loading"
        @create="handleCreateSignature"
      />
      <ElectronicSignatureCard
        v-for="(certificate, index) in activeCertificates"
        :key="index"
        :certificate="certificate"
        @archive="handleArchive(certificate)"
      />
    </div>

    <!-- Archived Certificates -->
    <div v-else-if="activeTab === 'archived'" class="electronic-signature-content__certificates">
      <ElectronicSignatureCard
        v-for="(certificate, index) in archivedCertificates"
        :key="index"
        :certificate="certificate"
        :is-archived="true"
      />
    </div>
  </div>

  <!-- Modal for creating signature -->
  <Popup :show="showCreateModal" @update:show="showCreateModal = $event">
    <CreateSignatureModal
      @close="showCreateModal = false"
      @submit="handleSubmitPhone"
      @confirm-code="handleConfirmCode"
    />
  </Popup>
</template>

<script>
import Tabs from '@/components/atoms/Tabs.vue'
import ElectronicSignatureCard from '@/components/molecules/ElectronicSignatureCard.vue'
import CertificateEmpty from '@/components/molecules/CertificateEmpty.vue'
import Popup from '@/components/atoms/Popup.vue'
import CreateSignatureModal from '@/components/organisms/popups/CreateSignatureModal.vue'

export default {
  name: 'ElectronicSignatureContent',
  components: {
    Tabs,
    ElectronicSignatureCard,
    CertificateEmpty,
    Popup,
    CreateSignatureModal
  },
  emits: ['archive'],
  data() {
    return {
      activeTab: 'active',
      loading: false,
      showCreateModal: false,
      tabs: [
        { id: 'active', label: 'Действующие' },
        { id: 'archived', label: 'Архивные' }
      ],
      activeCertificates: [],
      archivedCertificates: []
    }
  },
  methods: {
    handleTabChange(tabId) {
      this.activeTab = tabId
    },
    handleArchive(certificate) {
      // Перемещаем сертификат в архив
      const index = this.activeCertificates.findIndex(c => c.number === certificate.number)
      if (index !== -1) {
        const archived = this.activeCertificates.splice(index, 1)[0]
        this.archivedCertificates.push(archived)
        this.$emit('archive', certificate)
      }
    },
    handleCreateSignature() {
      this.showCreateModal = true
    },
    handleSubmitPhone(phone) {
      console.log('Submit phone:', phone)
      // TODO: Implement phone submission logic
      // Модальное окно остается открытым для ввода кода
    },
    handleConfirmCode(code) {
      console.log('Confirm code:', code)
      // TODO: Implement code confirmation logic
      this.showCreateModal = false
    }
  }
}
</script>

<style lang="scss" scoped>
.electronic-signature-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
  background: #ffffff;
  border-radius: 10px;
  padding: 34px 24px 24px 24px;

  @media (max-width: 768px) {
    gap: 24px;
    padding: 24px 16px;
    border-radius: 0;
    background: transparent;
  }
}

.electronic-signature-content__tabs-wrapper {
  /* border-bottom: 1px solid rgba(0, 0, 0, 0.1); */
  padding-bottom: 0;
  padding-top: 10px;
  margin: 0 -24px;
  padding-left: 24px;
  padding-right: 24px;

  @media (max-width: 768px) {
    margin: 0;
    padding: 0;
    padding-top: 0;
  }
}

.electronic-signature-content__tabs {
  margin-bottom: 0;
}

.electronic-signature-content__certificates {
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    gap: 16px;
  }
}
</style>


<template>
  <div class="organisation-data-content">
    <!-- Documents Verification Status -->
    <div class="organisation-data-content__verification-status">
      <img 
        src="@/assets/icons/profile/wait-doc.svg" 
        alt="Verification" 
        class="organisation-data-content__verification-icon"
      />
      <span class="organisation-data-content__verification-text">Документы на проверке</span>
    </div>

    <!-- Tabs -->
    <Tabs
      :tabs="tabs"
      :value="activeTab"
      @change="handleTabChange"
      type="underlined"
      item-value="id"
      item-text="label"
      class="organisation-data-content__tabs"
    />

    <!-- Description -->
    <p class="organisation-data-content__description">
      {{ description }}
    </p>

    <!-- Organisation Data Form -->
    <div v-if="activeTab === 'data'" class="organisation-data-content__form">
      <OrganisationDataForm
        ref="form"
        :model-value="localFormData"
        @update:model-value="handleFormDataUpdate"
        :counterparty-types="counterpartyTypes"
        @data-filled="handleDataFilled"
        @upload-error="handleUploadError"
      />
      
      <!-- Action Buttons -->
      <div class="organisation-data-content__actions">
        <Button
          type="outlined"
          color="blue"
          @click="handleCancel"
        >
          Отменить
        </Button>
        <Button
          type="contained"
          color="blue"
          @click="handleSave"
          :loading="loading"
        >
          Сохранить изменения
        </Button>
      </div>
    </div>

    <!-- Documents Tab Content -->
    <div v-else-if="activeTab === 'documents'" class="organisation-data-content__documents">
      <h2 class="organisation-data-content__documents-title">Документы</h2>
      <p class="organisation-data-content__documents-description">
        Для подтверждения подлинности введенных вами данных, пожалуйста прикрепите скан-фото оригиналов документов
      </p>
      
      <WarningBlock 
        title="Внимание!"
        text="На фотографии должны быть отчётливо видны серия, номер, основные данные. В поле зрения не должны попадать пальцы и посторонние предметы."
        :icon="require('@/assets/icons/info_blue.svg')"
      />
      
      <DocumentCard
        title="Свидетельство о постановке на учет в налоговом органе"
        :file="currentDocument"
        @delete="handleDocumentDelete"
      />
      
      <div v-if="documentHistory.length > 0" class="organisation-data-content__history">
        <DocumentHistoryItem
          v-for="(item, index) in documentHistory"
          :key="index"
          :status="item.status"
          :date="item.date"
          :author="item.author"
        />
      </div>
      
      <!-- Action Buttons -->
      <div class="organisation-data-content__documents-actions">
        <Button
          type="outlined"
          color="blue"
          @click="handleCancel"
        >
          Отменить
        </Button>
        <Button
          type="contained"
          color="blue"
          @click="handleSave"
          :loading="loading"
        >
          Сохранить изменения
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import OrganisationDataForm from '@/components/organisms/OrganisationDataForm.vue'
import Tabs from '@/components/atoms/Tabs.vue'
import Button from '@/components/atoms/Button.vue'
import WarningBlock from '@/components/atoms/WarningBlock.vue'
import DocumentCard from '@/components/molecules/DocumentCard.vue'
import DocumentHistoryItem from '@/components/molecules/DocumentHistoryItem.vue'

export default {
  name: 'OrganisationDataContent',
  components: {
    OrganisationDataForm,
    Tabs,
    Button,
    WarningBlock,
    DocumentCard,
    DocumentHistoryItem
  },
  props: {
    formData: {
      type: Object,
      required: true
    },
    counterpartyTypes: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:formData', 'data-filled', 'save', 'cancel'],
  data() {
    return {
      activeTab: 'data',
      loading: false,
      localFormData: { ...this.formData },
      tabs: [
        { id: 'data', label: 'Данные об организации' },
        { id: 'documents', label: 'Документы' }
      ],
      description: 'Укажите основную информацию о вашей организации. Эти данные помогут нам создать ваш профиль, чтобы вы могли размещать вакансии и подработки. Пожалуйста, заполните все обязательные поля внимательно.',
      currentDocument: {
        name: 'Screenshot_20241118_183604.jpg',
        size: '3,0МВ',
        preview: require('@/assets/imgs/document.png'),
        file: null
      },
      documentHistory: [
        {
          status: 'Загружен',
          date: '09.11.21 22:00',
          author: 'Худобин А.И.'
        },
        {
          status: 'Утверждён',
          date: '09.11.21 22:00',
          author: 'Ивановский В.С.'
        },
        {
          status: 'Изменён',
          date: '09.11.21 22:00',
          author: 'Ивановский В.С.'
        }
      ]
    }
  },
  watch: {
    formData: {
      handler(newVal) {
        this.localFormData = { ...newVal }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleTabChange(tabId) {
      this.activeTab = tabId
    },
    handleFormDataUpdate(newData) {
      this.localFormData = { ...newData }
      this.$emit('update:formData', newData)
    },
    handleDataFilled() {
      this.$emit('data-filled')
    },
    handleUploadError(error) {
      console.error('Upload error:', error)
    },
    handleSave() {
      this.loading = true
      // TODO: Implement save logic
      setTimeout(() => {
        this.loading = false
        this.$emit('save', this.localFormData)
      }, 1000)
    },
    handleCancel() {
      this.$emit('cancel')
    },
    handleDocumentDelete() {
      this.currentDocument = null
      // TODO: Implement document delete logic
    }
  }
}
</script>

<style lang="scss" scoped>
.organisation-data-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: #ffffff;
  border-radius: 10px;
  padding: 24px;
  overflow-x: hidden;
}

.organisation-data-content__verification-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.organisation-data-content__verification-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.organisation-data-content__verification-text {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #666666;
}

.organisation-data-content__tabs {
  margin-bottom: 0;
}

.organisation-data-content__description {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #666666;
  margin: 0;
}

.organisation-data-content__form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.organisation-data-content__actions {
  display: flex;
  align-items: center;
  gap: 15px;
  justify-content: center;
  margin-top: 0;
  padding-top: 0;
  border-top: none;
  background: #ffffff;
  padding: 16px;
  margin-left: -16px;
  margin-right: -16px;
  margin-bottom: -16px;
  width: calc(100% + 32px);

  :deep(.rq_button) {
    flex: 1;
    max-width: 45vw;
    min-width: 40vw;
  }

  @media (min-width: 769px) {
    gap: 12px;
    justify-content: flex-end;
    padding-top: 24px;
    border-top: 1px solid #E0E0E0;
    background: transparent;
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 0;
    width: auto;

    :deep(.rq_button) {
      flex: none;
      max-width: none;
      min-width: auto;
    }
  }
}

.organisation-data-content__documents {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.organisation-data-content__history {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.organisation-data-content__documents-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #E0E0E0;
}


.organisation-data-content__documents-title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
  color: #263043;
  margin: 0;
}

.organisation-data-content__documents-description {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #666666;
  margin: 0;
}
</style>


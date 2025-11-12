<template>
  <div class="electronic-signature-card">
    <div class="electronic-signature-card__info">
      <h3 class="electronic-signature-card__title">
        Сертификат электронной подписи №{{ certificate.number }}
      </h3>
      <p class="electronic-signature-card__validity">
        Срок действия: {{ certificate.validFrom }}–{{ certificate.validTo }}
      </p>
    </div>
    
    <Button
      v-if="!isArchived"
      type="outlined"
      color="blue"
      @click="$emit('archive')"
    >
      Архивировать и выпустить новую подпись
    </Button>
  </div>
</template>

<script>
import Button from '@/components/atoms/Button.vue'

export default {
  name: 'ElectronicSignatureCard',
  components: {
    Button
  },
  props: {
    certificate: {
      type: Object,
      required: true,
      validator: (cert) => {
        return cert.number && cert.validFrom && cert.validTo
      }
    },
    isArchived: {
      type: Boolean,
      default: false
    }
  },
  emits: ['archive']
}
</script>

<style lang="scss" scoped>
.electronic-signature-card {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  padding: 24px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.electronic-signature-card__info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.electronic-signature-card__title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
  color: #263043;
  margin: 0;
}

.electronic-signature-card__validity {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.1px;
  color: #666666;
  margin: 0;
}

@media (max-width: 768px) {
  .electronic-signature-card {
    padding: 16px;
    gap: 16px;
    border-radius: 16px;
  }

  .electronic-signature-card__title {
    font-size: 16px;
    line-height: 20px;
  }

  .electronic-signature-card__validity {
    font-size: 14px;
    line-height: 22px;
  }

  .electronic-signature-card :deep(.rq_button) {
    width: 100%;
  }
}
</style>


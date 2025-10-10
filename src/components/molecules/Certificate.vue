<template>
  <CertificateEmpty v-if="certificate.status === 'pending'" :loading="loading" type="pending" @create="$emit('updateStatus')" />
  <CertificateEmpty v-else-if="certificate.status === 'error'" :loading="loading" type="error" @create="$emit('updateStatus')" />
  <div v-else class="certificate_container" @click="$emit('open')">
    <div class="content_block">
      <div>
        <div class="sign_header">Сертификат электронной подписи {{ getCertificateId }}</div>
        <div class="sign_data">{{ displayedData(certificate) }}</div>
      </div>

      <div>
        <div class="label">Владелец</div>
        {{ certificateUsername }}
      </div>

      <div>
        <div class="label">Тип владельца</div>
        Физическое лицо
      </div>

      <div>
        <div class="label">ИНН</div>
        {{ certificateInn }}
      </div>

      <div>
        <div class="label">Выдан</div>
        {{ certificateIssuedBy }}
      </div>
    </div>

    <Button v-if="certificate?.status === 'active'" @click="$emit('reissue')" type="outlined">
      Архивировать и выпустить новую подпись
    </Button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CertificateEmpty from '@/components/molecules/CertificateEmpty.vue'

export default {
  name: 'Certificate',
  components: { CertificateEmpty },
  props: {
    certificate: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters('profilePage', ['profile']),
    certificateUsername () {
      if (this.certificate?.user_name?.length > 0) {
        return this.certificate?.user_name
      }
      return this.profile?.user?.fullname
    },
    certificateInn () {
      if (this.certificate?.user_inn?.length > 0) {
        return this.certificate?.user_inn
      }
      return this.profile?.user?.settings?.inn
    },
    certificateIssuedBy () {
      if (this.certificate?.issued_by?.length > 0) {
        return this.certificate?.issued_by
      }
      return 'ООО «ПЛАТФОРМЕННЫЕ РЕШЕНИЯ»'
    },
    getCertificateId () {
      return this.certificate.uuid.split('-').join('').slice(0, 12).toUpperCase()
    },
  },
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    displayedData (certificate) {
      return `Срок действия: ${this.$dayjs(certificate?.valid_from, 'DD.MM.YYYY').format('DD.MM.YYYY')} по  ${this.$dayjs(certificate?.valid_to, 'DD.MM.YYYY').format('DD.MM.YYYY')}`
    },
  },
}
</script>

<style lang="scss" scoped>
.certificate_container {
  border: 1px solid #0000001a;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  cursor: pointer;

  .content_block {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .label {
    color: #666666;
    margin-bottom: 4px;
  }

  .sign_header {
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 8px;
  }

  .sign_data {
    color: #666666;
    font-size: 14px;
  }
}
</style>

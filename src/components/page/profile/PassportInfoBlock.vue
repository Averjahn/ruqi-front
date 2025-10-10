<template>
  <!-- <Popup v-model:show="isPassportPopupOpen"> </Popup> -->
  <template v-if="!isPassportPopupOpen">
    <div class="passport_info_block">
      <div>
        <BlockHeader class="mb_8" @edit="isPassportPopupOpen = true" :withoutButton="hideEditButton">
          {{ profile?.user?.fullname || 'Паспортные данные' }}
        </BlockHeader>
        <SmzStatus :status="user.smz_status" />
      </div>

      <div class="row">
        <div>
          <div class="title">Пол</div>
          <div>{{ gender }}</div>
        </div>

        <div>
          <div class="title">Дата рождения</div>
          <div>{{ birthday }}</div>
        </div>

        <div>
          <div class="title">Гражданство</div>
          <div>{{ citizenship }}</div>
        </div>
      </div>

      <component :is="getCitizenForm()" :profile="profile" />

      <div>
        <div class="title">ИНН</div>
        <div class="flex_align">
          {{ (user.settings && user.settings.inn) || '-' }}
        </div>
      </div>
    </div>
  </template>
  <template v-else><PassportEditPopup @close="isPassportPopupOpen = false" @success="$emit('success')" /></template>
</template>

<script>
import SmzStatus from '@/components/atoms/SmzStatus.vue'
import PassportEditPopup from '@/components/organisms/popups/PassportEditPopup.vue'
import { CITIZENSHIP_OPTIONS, GENDER } from '@/constants/constants'
import RussianCitizen from '@/components/page/profile/documentsBlock/RussianCitizen.vue'
import EAEUCitizen from '@/components/page/profile/documentsBlock/EAEUCitizen.vue'
import OtherCitizen from '@/components/page/profile/documentsBlock/OtherCitizen.vue'
import BlockHeader from '@/components/page/profile/BlockHeader.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'PassportInfoBlock',
  components: { SmzStatus, PassportEditPopup, RussianCitizen, EAEUCitizen, OtherCitizen, BlockHeader },
  props: {
    hideEditButton: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      editablePassport: {},
      isPassportPopupOpen: false,
    }
  },
  computed: {
    ...mapGetters('profilePage', ['profile']),

    passport () {
      return this.profile?.passport || {}
    },
    user () {
      return this.profile?.user || {}
    },
    citizenship () {
      return CITIZENSHIP_OPTIONS[this.profile?.user?.citizenship]?.name || 'Не указано'
    },
    gender () {
      return GENDER[this.profile?.user?.gender]?.name || 'Не указано'
    },

    birthday () {
      return this.profile?.user?.birthday ? this.$dayjs(this.profile.user.birthday).format('DD.MM.YYYY') : '-'
    },
  },
  async mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    getCitizenForm () {
      if (this.profile?.user?.citizenship === 'RU') return 'RussianCitizen'
      if (['BY', 'AM', 'KZ', 'KG'].includes(this.profile?.user?.citizenship)) return 'EAEUCitizen'
      if (this.profile?.user?.citizenship === 'OTHER') return 'OtherCitizen'
    },
  },
}
</script>

<style lang="scss" scoped>
.passport_info_block {
  display: flex;
  flex-direction: column;
  gap: 24px;

  .title {
    color: #c7c7c7;
    margin-bottom: 4px;
  }

  .flex_align {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .row {
    display: flex;
    gap: 48px;
    flex-wrap: wrap;
  }
}
</style>

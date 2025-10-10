<template>
  <Popup v-model:show="showInviteFriendPopup">
    <InviteFriendPopup @close="showInviteFriendPopup = false" @referralInvited="loadReferralsData" />
  </Popup>

  <div class="referrals_header">
    <Block class="stats_block">
      <div class="label">Осталось бонусных заявок</div>
      <div class="value">{{ getDisplayedNumber(referrals?.bonus_tasks_remaining) || '-' }}</div>
    </Block>
    <Block class="stats_block">
      <div class="label">Осталось бонусных выплат</div>
      <div class="value">{{ getDisplayedNumber(referrals?.bonus) }} ₽</div>
    </Block>
  </div>

  <Block class="referrals_block">
    <div class="header">
      <div>
        <span class="title">Список приглашённых</span>
        {{ referrals?.users?.length }}
      </div>
      <Button class="add_button_desktop" size="s" inline @click="showInviteFriendPopup = true">
        <img src="@/assets/icons/user_add.svg" /> Пригласить друга
      </Button>
      <ButtonIconDeprecated class="add_button_mobile" @click="showInviteFriendPopup = true">
        <Icon name="plus" :size="24" />
      </ButtonIconDeprecated>
    </div>

    <div class="referrals_list">
      <div v-for="item in referrals?.users" :key="item.id" class="referral_card">
        <div class="name">
          {{ item.lastname }} {{ item.firstname }}
          <ButtonText
            v-if="item?.status === 'not_registered' || !item.status"
            type="s"
            class="button"
            @click="copyLink(item.referral_link)"
          >
            <Icon name="copy" :size="20" /> Скопировать ссылку
          </ButtonText>
        </div>

        <div class="phone">
          <div class="label">Телефон</div>
          {{ getFormattedPhone(item.phone) }}
        </div>

        <div class="status">
          <img v-if="getStatusIcon(item.status)" :src="require('@/assets/icons/' + getStatusIcon(item.status))" />
          <div v-html="getStatusText(item)" />
        </div>
      </div>
    </div>
  </Block>
</template>

<script>
import InviteFriendPopup from '@/components/organisms/popups/InviteFriendPopup.vue'
import { mapActions } from 'vuex'
import { formatPhone } from '@/constants/masks'
import { declensionOfNumber, getDisplayedNumber } from '@/constants/helpers'
import Block from '@/components/page/profile/Block.vue'
import useGlobalLoading from '@/composables/useGlobalLoading'

export default {
  name: 'ReferralsInfoBlock',
  components: { InviteFriendPopup, Block },
  props: {},
  setup () {
    const { startLoading, stopLoading, loading } = useGlobalLoading()
    return { startLoading, stopLoading, loading }
  },
  data () {
    return {
      referrals: null,
      showInviteFriendPopup: false,
      labelShifts: ['смена', 'смены', 'смен'],
      declensionOfNumber,
      getDisplayedNumber,
    }
  },
  computed: {},
  mounted () {
    this.loadReferralsData()
  },
  unmounted () {},
  watch: {},
  methods: {
    ...mapActions('notifications', ['showNotification']),

    copyLink (link) {
      navigator.clipboard.writeText(link)
      this.showNotification({ type: 'success', text: 'Ссылка скопирована' })
    },

    getStatusText (item) {
      if (item.status === 'in_progress')
        return `<b>${item.bonus_tasks_worked}/<span class="green">${item.bonus_tasks_available}</span></b>`
      if (item.status === 'ended') return `<b><span>${item.bonus_tasks_worked}/${item.bonus_tasks_available}</span></b>`
      if (item.status === 'registered') return 'Зарегистрирован'
      if (item.status === 'not_registered') return 'Не зарегистрирован'
      if (item.status === 'registration_in_progress') return 'Регистрация'
      if (item.status === 'break') return 'Прервал акцию'
      return ''
    },

    getStatusIcon (status) {
      if (status === 'ended') return 'checkmark_circle.svg'
      if (status === 'registered') return 'user_checked.svg'
      if (status === 'not_registered') return 'person_delete.svg'
      if (status === 'registration_in_progress') return 'user_sync.svg'
      if (status === 'break') return 'dismiss-circle.svg'
      return false
    },

    async loadReferralsData () {
      this.startLoading()
      const response = await this.$axios.get('v2/user/referrallink')
      if (response.data.success) this.referrals = response.data.data
      this.stopLoading()
    },

    getFormattedPhone (phone) {
      const { formattedValue } = formatPhone({
        value: phone,
      })
      return formattedValue
    },
  },
}
</script>

<style lang="scss" scoped>
.referrals_header {
  display: flex;
  align-items: center;
  gap: 24px;
}
.stats_block {
  .label {
    color: #666666;
    margin-bottom: 8px;
  }
  .value {
    font-size: 32px;
    font-weight: 700;
  }
}

.referrals_block {
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    font-size: 20px;
    margin-bottom: 24px;
    .title {
      font-size: 24px;
      font-weight: 600;
      margin-right: 4px;
    }
  }
  .add_button_desktop {
    display: flex;
  }
  .add_button_mobile {
    display: none;
  }
  .referrals_list {
    margin-bottom: 1px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 16px;
  }
  .referral_card {
    display: flex;
    align-items: center;
    padding: 25px 24px;
    border: 1px solid #0000001a;
    border-radius: 16px;
    gap: 12px;
    .button {
      display: flex;
    }
    .label {
      color: #c7c7c7;
      margin-bottom: 4px;
    }
    .name {
      flex: 1;
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
      word-wrap: break-word;
      overflow-wrap: break-word;
      overflow: hidden;
    }
    .phone {
      flex: 0.5;
    }

    .status {
      min-width: 180px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      :deep(span) {
        color: #71d472;
      }
    }
  }

  @media (max-width: 1100px) {
    .header .title {
      font-size: 20px;
    }
    .referral_card {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      .name {
        font-size: 16px;
      }
      .status {
        justify-content: flex-start;
      }
    }
  }

  @media (max-width: 600px) {
    .add_button_desktop {
      display: none;
    }
    .add_button_mobile {
      display: flex;
      color: #1735f5;
    }
    .referral_card {
      padding: 16px;
    }
  }
}
</style>

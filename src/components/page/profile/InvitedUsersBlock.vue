<template>
  <div class="invited_user_block">
    <Popup v-model:show="isPopupOpen">
      <InviteUserPopup @close="isPopupOpen = false" />
    </Popup>
    <div class="sub_title">Приглашенные пользователи</div>
    Вы можете приглашать друзей для совместного выполнения работ в системе RUQi
    <Divider class="my_16" />
    <div class="invited_item_wrap mb_16">
      <div class="invited_user_item">
        <Avatar theme="blue" />
        <div>
          <div class="fio">Воронцов Матвей Александрович</div>
          <div class="phone">+7 (912) 234-56-78</div>
        </div>
      </div>
    </div>
    <Button type="outlined" @click="isPopupOpen = true" class="add_button">
      <img src="@/assets/icon_deprecated/plus.svg" />
      Пригласить нового пользователя
    </Button>
  </div>
</template>

<script>
import InviteUserPopup from '@/components/organisms/popups/InviteUserPopup.vue'
import Avatar from '@/components/atoms/Avatar.vue'

export default {
  name: 'InvitedUsersBlock',
  components: { InviteUserPopup, Avatar },
  props: {
    options: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      isPopupOpen: false,
    }
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    open () {},
  },
}
</script>

<style lang="scss" scoped>
.invited_user_block {
  .sub_title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .invited_item_wrap {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .invited_user_item {
    padding: 16px;
    border-radius: 14px;
    border: 1px solid #dadada;
    display: flex;
    gap: 12px;
    align-items: center;
    .fio {
      font-weight: 600;
      margin-bottom: 4px;
    }
    .phone {
      color: #7a91a9;
    }
  }
}
</style>

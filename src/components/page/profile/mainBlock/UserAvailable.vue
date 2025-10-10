<template>
  <div class="user_available_container">
    <label class="available_toggle_mobile">
      Доступен для работ
      <Switch :value="isUserReady" @onChange="userReady" :loading="loading" :disabled="loading" />
    </label>
    <div class="main_block">
      <Avatar class="avatar_desktop" :width="64" fontSize="16px" />
      <Avatar class="avatar_mobile" :width="32" fontSize="14px" />
      <div class="description">
        <div class="header">
          <h3 class="mb_4">{{ user.fio }}</h3>
          <label class="available_toggle">
            Доступен для работ
            <Switch :value="isUserReady" @onChange="userReady" :loading="loading" :disabled="loading" />
          </label>
        </div>
        <UserRating class="mb_4" />
        <UserProfileStatus :status="profile?.cache_user_profile_state" />
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/atoms/Avatar.vue'
import UserProfileStatus from '@/components/molecules/statuses/UserProfileStatus.vue'
import UserRating from '@/components/molecules/UserRating.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'UserAvailable',
  components: { UserProfileStatus, Avatar, UserRating },
  props: {
    options: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      loading: false,
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    ...mapGetters('profilePage', ['profile']),
    isUserReady () {
      return this.user.ready_status === 'ready'
    },
  },
  mounted () {
    this.fetchProfileOnce()
  },
  unmounted () {},
  watch: {},
  methods: {
    ...mapActions('profilePage', ['fetchProfileOnce']),
    ...mapActions('user', ['putAvailability']),

    async userReady (isReady) {
      this.loading = true
      await this.putAvailability(isReady ? 'ready' : 'not_ready')
      this.loading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.user_available_container {
  .main_block {
    display: flex;
    gap: 16px;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }
  .description {
    flex: 1;
  }
  .available_toggle,
  .available_toggle_mobile {
    align-items: center;
    white-space: nowrap;
    gap: 8px;
    line-height: 32px;
    cursor: pointer;
  }
  .available_toggle {
    display: flex;
  }
  .available_toggle_mobile {
    display: none;
    margin-bottom: 12px;
  }
  .avatar_desktop {
    display: block;
  }
  .avatar_mobile {
    display: none;
  }

  @media (max-width: 1000px) {
    flex-direction: column-reverse;
    .main_block {
      gap: 12px;
    }
    .avatar_desktop {
      display: none;
    }
    .avatar_mobile {
      display: block;
    }
    .available_toggle {
      display: none;
    }
    .available_toggle_mobile {
      display: flex;
    }
    h3 {
      font-size: 18px;
      font-weight: 600;
      line-height: 22px;
    }
  }
}
</style>

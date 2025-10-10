<template>
  <div>
    <Popup v-model:show="isPartnershipOpen">
      <PartnershipInstruction @close="isPartnershipOpen = false" />
    </Popup>
    <Popup v-model:show="isSmzOpen">
      <ConnectSmz @close="isSmzOpen = false" />
    </Popup>
    <div v-if="smzMissing" class="attention_block">
      <img class="icon" src="@/assets/icons/exclamation.svg" />
      <div class="description_part">
        <div>
          <div class="header">У вас отсутствует подключённый статус самозанятого</div>
          <div class="description">Подключите статус самозанятого, чтобы откликнуться на заявку</div>
        </div>
        <div v-if="$route.query?.tab !== 'contracts'">
          <Button type="outlined" @click="isSmzOpen = true" inline>Подключить статус самозанятого</Button>
        </div>
      </div>
    </div>
    <div v-else-if="!hasUnsignedContract" class="attention_block">
      <img class="icon" src="@/assets/icons/exclamation.svg" />
      <div class="description_part">
        <div>
          <div class="header">Подпишите договор</div>
          <div class="description">Подпишите договор, чтобы начать работать</div>
        </div>
        <div v-if="$route.query?.tab !== 'contracts'">
          <Button type="outlined" @click="signContract" inline>Подписать</Button>
        </div>
      </div>
    </div>
    <div v-else-if="partnershipMissing" class="attention_block">
      <img class="icon" src="@/assets/icons/exclamation.svg" />
      <div class="description_part">
        <div>
          <div class="header">У вас не подключено партнёрство в “Мой налог”</div>
          <div class="description">Система отправила запрос. Предоставьте доступ Ruqi в сервисе «Мой налог»</div>
        </div>
        <div v-if="$route.query?.tab !== 'contracts'">
          <Button type="outlined" @click="isPartnershipOpen = true" inline>Смотреть инструкцию</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import PartnershipInstruction from '@/components/organisms/popups/PartnershipInstruction.vue'
import ConnectSmz from '@/components/organisms/popups/ConnectSmz.vue'

export default {
  name: 'AttentionBlock',
  components: { PartnershipInstruction, ConnectSmz },
  props: {},
  data () {
    return {
      isPartnershipOpen: false,
      isSmzOpen: false,
    }
  },
  computed: {
    ...mapGetters('profilePage', ['profile']),
    hasUnsignedContract () {
      return this.profile?.agreements?.some((item) => item?.status === 'ready_to_sign' || item?.status === 'created')
    },
    partnershipMissing () {
      return this.profile?.user?.partnership_status !== 'done'
    },
    smzMissing () {
      return this.profile?.user?.smz_status !== 'done'
    },
  },
  mounted () {
    this.fetchProfileOnce()
  },
  unmounted () {},
  watch: {},
  methods: {
    ...mapMutations('profilePage', ['fetchProfileOnce', 'setContractStatus']),
    ...mapActions('profilePage', ['fetchProfileOnce']),
    ...mapActions('notifications', ['showNotification']),

    signContract () {
      this.$router.push('/profile?tab=contracts')
    },
  },
}
</script>

<style lang="scss" scoped>
.attention_block {
  padding: 24px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-radius: 14px;
  background: #fef2e1;
  .description_part {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .icon {
    width: 28px;
    min-width: 28px;
    height: 28px;
  }
  .header {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 12px;
  }
  @media (max-width: 768px) {
    padding: 16px;
  }
  @media (max-width: 400px) {
    .description_part {
      min-width: 220px;
    }
  }
}
</style>

<template>
  <PopupContainer
    title="Вывод средств"
    class="friend_link_popup"
    @close="$emit('close')"
    maxWidth="400px"
  >
    <div class="withdraw_popup">
          <div class="content">
            <img src="@/assets/icons/checkmark_round.svg" />
            <div>
              <div class="text">Бонусные рубли будут добавлены к следующей вашей заявке</div>
            </div>
          </div>
          <div class="action_block">
            <Button type="outlined" inline @click="$emit('close')">Закрыть</Button>
            <Button inline @click="$emit('getBonuses')" :loading="withdrawLoading" class="ok_button">Ок</Button>
          </div>
        </div>
  </PopupContainer>
</template>

<script>
import PopupContainer from '@/components/atoms/PopupContainer.vue'

export default {
  components: {
    PopupContainer,
  },
  props: {
    withdrawLoading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.withdraw_popup {
  .content {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 12px;
  }
  .title {
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
    margin-bottom: 8px;
  }
  .text {
    font-size: 14px;
    line-height: 22px;
  }
  .action_block {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
  .ok_button {
    min-width: 80px;
  }
}
</style>

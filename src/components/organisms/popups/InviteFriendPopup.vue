<template>
  <PopupContainer
    title="Приведи друга и получай бонус к каждой заявке"
    class="friend_link_popup"
    maxWidth="1000px"
    @close="$emit('close')"
  >
    <div class="container">
      <div class="info-block">
        <div class="info-section">
          <div class="info-icon"><img src="@/assets/icon_deprecated/personal_link.svg" /></div>
          <div class="info-text">
            <div class="main-text">Делитесь ссылкой</div>
            <div class="description-text">
              После заполнения полей, получите ссылку, скопируйте ее и отправьте другу.
            </div>
          </div>
        </div>
        <div class="info-section">
          <div class="info-icon"><img src="@/assets/icon_deprecated/money_hand.svg" /></div>
          <div class="info-text">
            <div class="main-text">Получайте бонусы</div>
            <div class="description-text">
              Пригласите друга зарегистрироваться по вашей ссылке, и если в течение 30 дней с момента регистрации он
              успешно отработает 10 смен, вы получите по 400 руб. за каждую его завершённую заявку. Максимальное
              количество бонусных заявок, за которые можно получить вознаграждение, составляет 10. Бонус будет добавлен
              к вашей следующей заявке после того, как друг закроет свою заявку. Если друг не зарегистрируется в течение
              30 дней, бонусы начислены не будут. Бонусы выплачиваются только за заявки, завершённые другом в течение 30
              дней с момента его регистрации. Заявка считается закрытой, если друг получил за неё оплату.
            </div>
          </div>
        </div>
        <div class="info-section">
          <div class="info-icon"><img src="@/assets/icon_deprecated/people_community_add.svg" /></div>
          <div class="info-text">
            <div class="main-text">Количество друзей не ограниченно.</div>
            <div class="description-text">Можете приглашать бесконечное количество друзей и получать бонусы</div>
          </div>
        </div>
      </div>

      <InviteFriendForm class="data_block" />
    </div>
  </PopupContainer>
</template>

<script>
import PopupContainer from '@/components/atoms/PopupContainer.vue'
import InviteFriendForm from '@/components/organisms/InviteFriendForm.vue'

export default {
  components: {
    InviteFriendForm,
    PopupContainer,
  },
}
</script>

<style lang="scss" scoped>
.friend_link_popup {
  .container {
    max-width: 100%;
    display: flex;
    flex-direction: row;
    gap: 24px;
  }
  .info-block {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    border-radius: 10px;
    background-color: #f3f3f3;
    padding: 20px 16px;
    .info-section {
      display: flex;
      flex-direction: row;
      gap: 16px;
      align-items: flex-start;
    }
    .info-icon {
      width: 24px;
      height: auto;
    }
    .info-text {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .main-text {
      font-size: 16px;
      font-weight: 600;
      line-height: 20px;
      text-align: left;
    }
    .description-text {
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      letter-spacing: 0.1px;
      text-align: left;
      color: #666666;
    }
  }
  .data_block {
    flex: 1;
    max-width: 360px;
  }
  @media (max-width: 1000px) {
    .container {
      width: 100%;
      flex-direction: column;
      justify-content: unset;
    }
    .data_block {
      max-width: 100%;
    }
  }
}
</style>

<template>
  <Popup v-model:show="isPopupOpen">
    <PopupContainer
      class="medical_book_popup"
      title="Пригласить друга"
      maxWidth="670px"
      :loading="loading"
      @close="isPopupOpen = false"
    >
      <InviteFriendForm />
    </PopupContainer>
  </Popup>

  <div class="bring_friend_container basic_container_global">
    <BreadCrumbs class="bread_crumbs" :items="breadCrumbs" />

    <div class="banner">
      <div class="content">
        <div class="title">Реферальная программа «Приведи друга»</div>
        <div class="description">
          Пригласите друзей воспользоваться сервисом Ruqi и получите денежное вознаграждение! Для этого создайте
          уникальную ссылку, поделитесь ею с друзьями, и получайте бонусы за их достижения.
        </div>
        <div class="button">
          <Button size="l" wide @click="goToForm">Получить бонусы</Button>
        </div>
      </div>
      <div class="img">
        <img src="@/assets/icons/fiends_magnet.svg" />
      </div>
    </div>

    <h2>Условия акции</h2>
    <div class="condition_container">
      <div class="condition">
        <div class="icon">
          <img src="@/assets/icons/calendar_dark_blue.svg" />
        </div>
        <h3>Десять бонусных заявок</h3>
        Пригласите друга зарегистрироваться по вашей ссылке, и если в течение 30 дней с момента регистрации он успешно
        завершит 10 заявок, вы получите по 400 руб. за каждую его завершённую заявку. Максимальное количество бонусных
        заявок, за которые можно получить вознаграждение, составляет 10.
      </div>
      <div class="condition">
        <div class="icon">
          <img src="@/assets/icons/money_hand.svg" />
        </div>
        <h3>Начисление бонуса</h3>
        Бонус будет добавлен к вашей следующей заявке после того, как друг закроет свою заявку. Если друг не
        зарегистрируется в течение 30 дней, бонусы начислены не будут. Бонусы выплачиваются только за заявки,
        завершённые другом в течение 30 дней с момента его регистрации.
      </div>
      <div class="condition">
        <div class="icon">
          <img src="@/assets/icons/add_users.svg" />
        </div>
        <h3>Без ограничений на друзей</h3>
        Количество приглашенных друзей не ограничено. За каждую успешную заявку, завершенную вашим другом, вы будете
        получать бонус, который будет применен к вашей следующей заявке. Кроме того, приглашенные друзья будут
        способствовать повышению вашего рейтинга и уровня в сервисе.
      </div>
    </div>

    <div class="form_block" ref="formBlock">
      <div class="left_part">
        <h3>Как участвовать</h3>
        <div class="list_item mb_24">
          <div class="count">1</div>
          <div class="list_content">
            <div class="list_description">Заполните поля</div>
            <div class="list_text">Заполните форму, получите уникальную ссылку и отправьте её другу.</div>
          </div>
        </div>
        <div class="list_item mb_24">
          <div class="count">2</div>
          <div class="list_content">
            <div class="list_description">Друг регистрируется</div>
            <div class="list_text">Ваш друг должен зарегистрироваться и начать выполнять заявки</div>
          </div>
        </div>
        <div class="list_item">
          <div class="count">3</div>
          <div class="list_content">
            <div class="list_description">Получайте бонусы</div>
            <div class="list_text">Вы получаете 400 рублей за каждую заявку, успешно завершённую другом</div>
          </div>
        </div>
        <Button class="invite_friend_button" wide @click="isPopupOpen = true">Пригласить друга</Button>
      </div>
      <div class="right_part">
        <InviteFriendForm />
      </div>
    </div>
  </div>
</template>

<script>
import InviteFriendForm from '@/components/organisms/InviteFriendForm.vue'
import BreadCrumbs from '@/components/molecules/BreadCrumbs.vue'
import PopupContainer from '@/components/atoms/PopupContainer.vue'
import { scrollWithAnimation } from '@/constants/scroll'

export default {
  name: 'bringFriend',
  components: { InviteFriendForm, PopupContainer, BreadCrumbs },
  props: {},
  data () {
    return {
      isPopupOpen: false,
      breadCrumbs: [{ text: 'Акции', url: '/promo' }, { text: 'Приведи друга' }],
    }
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    goToForm () {
      const el = this.$refs.formBlock
      if (el) {
        const elTop = el.getBoundingClientRect().top
        const root = document.getElementById('default_layout')
        const scrollY = root.scrollTop
        scrollWithAnimation({
          root,
          speed: 2000,
          scrollTargetY: scrollY + elTop - 72,
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.bring_friend_container {
  padding-top: 32px;
  padding-bottom: 36px;
  .bread_crumbs {
    margin-bottom: 32px;
  }
  .banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    background: #F6F8FB;
    border-radius: 16px;
    height: 320px;
    overflow: hidden;
    padding: 50px;
    margin-bottom: 80px;
    .content {
      max-width: 645px;
    }
    .title {
      font-size: 32px;
      font-weight: 600;
      line-height: 40px;
      margin-bottom: 24px;
    }
    .description {
      font-size: 18px;
      line-height: 24px;
      margin-bottom: 24px;
    }
    .button {
      max-width: 220px;
    }
    .img {
      position: relative;
      overflow: hidden;
      width: 450px;
      height: 330px;
      img {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  h2 {
    font-size: 32px;
    font-weight: 600;
    line-height: 40px;
    margin-bottom: 32px;
  }
  .condition_container {
    display: flex;
    align-items: start;
    gap: 24px;
    margin-bottom: 80px;
    .condition {
      flex: 1;
      padding: 24px;
      border-radius: 16px;
      border: 1px solid #0000001a;
      align-self: stretch;
      h3 {
        font-size: 24px;
        line-height: 30px;
        color: #000000;
        margin-bottom: 16px;
      }
    }
    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 8px;
      background: #ebf0ff;
      margin-bottom: 24px;
    }
  }

  .form_block {
    display: flex;
    align-items: center;
    gap: 32px;
    justify-content: space-between;
    padding: 44px 32px 44px 50px;
    border-radius: 24px;
    background: #F6F8FB;
    .left_part {
      max-width: 576px;
      // color: white;
      h3 {
        font-size: 32px;
        font-weight: 600;
        line-height: 40px;
        margin-bottom: 32px;
      }
    }
    .list_item {
      display: flex;
      gap: 16px;
    }
    .count {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 600;
      line-height: 18px;
      width: 32px;
      min-width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 1px solid #263043;
    }
    .list_content {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .list_description {
      font-size: 22px;
      font-weight: 600;
      line-height: 27.5px;
    }
    .list_text {
      color: #666666;
    }
    .invite_friend_button {
      display: none;
    }
    .right_part {
      width: 437px;
      // padding: 32px;
      // background: white;
      border-radius: 16px;
    }
  }

  @media (max-width: 1000px) {
    padding-bottom: 100px;
    padding-top: 16px;
    .bread_crumbs {
      margin-bottom: 24px;
    }
    .banner {
      flex-direction: column-reverse;
      gap: 16px;
      padding: 16px;
      height: auto;
      .content {
        max-width: 100%;
        text-align: center;
      }
      .title {
        font-size: 24px;
        font-weight: 600;
        line-height: 30px;
        margin-bottom: 16px;
      }
      .description {
        font-size: 16px;
        line-height: 22px;
      }
      .button {
        max-width: 100%;
      }
      .img {
        overflow: hidden;
        width: 100%;
        min-width: 100%;
        height: 200px;
        img {
          width: 100%;
          min-width: 270px;
          max-width: 450px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
    h2 {
      font-size: 28px;
      line-height: 35px;
      margin-bottom: 24px;
    }
    .condition_container {
      flex-direction: column;
      gap: 16px;
      margin-bottom: 48px;
      .condition {
        padding: 20px;
        font-size: 14px;
        line-height: 24px;
        h3 {
          font-size: 20px;
          font-weight: 400;
          line-height: 25px;
        }
      }
      .icon {
        margin-bottom: 16px;
      }
    }
    .form_block {
      padding: 24px 20px;
      border-radius: 16px;
      .left_part {
        width: 100%;
        max-width: 100%;
        h3 {
          font-size: 28px;
          line-height: 32px;
          margin-bottom: 24px;
        }
      }
      .right_part {
        display: none;
      }
      .invite_friend_button {
        display: flex;
        margin-top: 32px;
      }

      .list_description {
        font-size: 18px;
        line-height: 22px;
      }
    }
  }
}
</style>

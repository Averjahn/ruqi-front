<template>
  <div class="promo_page basic_container_global">
    <div class="banner">
      <div class="content">
        <div class="main_block">
          <div class="title">Акции ruqi.ru</div>
          <div class="description">
            Добро пожаловать на страницу акций. Мы ценим ваш вклад и стремимся обеспечить максимально выгодные условия
            сотрудничества. Здесь представлены специальные предложения, которые помогут вам увеличить доход и ускорить
            рост вашего рейтинга.
          </div>
        </div>
        <img class="img promo_img" src="@/assets/imgs/promo_img.png" />
      </div>
    </div>
    <div class="promos_block">
      <div class="promo_container">
        <div class="content">
          <div class="main_block">
            <div class="title">Реферальная программа «Приведи друга»</div>
            <div class="description">
              Пригласите друзей воспользоваться сервисом Ruqi и получите денежное вознаграждение! Для этого создайте
              уникальную ссылку, поделитесь ею с друзьями, и получайте бонусы за их достижения.
            </div>
          </div>

          <div class="button">
            <ButtonText size="l" wide @click="$router.push('/promo/invite-friend')">Подробнее</ButtonText>
          </div>
        </div>
        <div class="img">
          <img src="@/assets/icons/fiends_magnet.svg" />
        </div>
      </div>
      <div class="promo_container revers">
        <div class="content">
          <div class="title">Покоряй вершины: ранги и достижения!</div>
          <div class="description">
            Откройте для себя новую рейтинговую систему сервиса! Узнайте, как продвигаться по рангам от новичка,
            зарабатывать награды и бонусы за свои достижения и повышать доверие заказчиков. Ваши усилия теперь не
            останутся незамеченными!
          </div>
          <div class="button">
            <ButtonText size="l" wide @click="$router.push('/promo/grades')">Подробнее</ButtonText>
          </div>
        </div>
        <div class="img">
          <img src="@/assets/icons/grades_stages.svg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  components: {},
  props: {
    options: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      list: null,
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
.promo_page {
  padding-bottom: 36px;
  .main_block {
    max-width: 830px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .banner {
    border-radius: 32px;
    background: #f6f8fb;
    margin-top: 48px;
    margin-bottom: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 17px 40px;

    gap: 115;
    // .basic_container_global {
    //   height: 100%;
    // }
    .content {
      position: relative;
      // flex-wrap: wrap;
      height: 100%;
      display: flex;
      gap: 115;
      align-items: center;
    }

    .title {
      font-size: 48px;
      font-weight: 700;
      line-height: 125%;
    }
    .description {
      font-size: 22px;
      line-height: 32px;
    }
    .promo_img {
      width: auto;
      height: auto;
      max-width: 462px;
    }
    // .img {
    //   position: absolute;
    //   right: -12px;
    //   top: -24px;
    // }
  }
  .promos_block {
    display: flex;
    flex-direction: column;
    gap: 64px;
  }
  .promo_container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 48px;
    &.revers {
      flex-direction: row-reverse;
    }
    .content {
      max-width: 680px;
    }
    .title {
      font-size: 32px;
      font-weight: 600;
      line-height: 40px;
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
      width: 550px;
      min-width: 450px;
      height: 400px;
      border-radius: 16px;
      img {
        width: 90%;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      &.grade {
        background: linear-gradient(211.76deg, #82a5d8 -23.55%, #853eb0 123.55%);
      }
    }
  }
  @media (max-width: 1000px) {
    padding-bottom: 100px;
    .banner {
      padding: 16px 16px;
      margin-bottom: 32px;
      .content {
        justify-content: center;
        align-items: center;
        flex-direction: column-reverse;
      }
      .main_block {
        margin-top: 16px;
        gap: 16px;
      }
      .title {
        align-self: center;
        font-size: 24px;
        line-height: 30px;
      }
      .description {
        font-size: 16px;
        line-height: 22px;
      }
      .img {
        max-width: 240px;
      }
    }
    .promos_block {
      gap: 24px;
    }
    .promo_container {
      flex-direction: column-reverse;
      gap: 16px;
      padding: 16px;
      border: 1px solid #0000001a;
      border-radius: 16px;
      &.revers {
        flex-direction: column-reverse;
      }
      .content {
        max-width: 100%;
      }
      .title {
        font-size: 18px;
        line-height: 26px;
      }
      .description {
        font-size: 14px;
        line-height: 22px;
        margin-bottom: 16px;
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
          width: 70%;
          min-width: 270px;
          max-width: 450px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        &.grade {
          img {
            width: 90%;
          }
        }
      }
    }
  }
}
</style>

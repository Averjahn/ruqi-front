<template>
  <div class="application_container">
    <div class="basic_container_global">
      <BreadCrumbs class="bread_crumbs" :items="breadCrumbs" />
      <div class="banner">
        <div class="left_part">
          <div class="title">Скачайте мобильное приложение RUQI</div>
          <div class="description">
            Приложение позволяет быстро находить подработку рядом с домом, выбирать заявки от надежных компаний и
            получать ежедневные выплаты. Регистрация занимает всего несколько минут, после чего вы сможете выходить на
            подработку уже через 3 часа.
          </div>
          <div class="apps_button_block">
            <a href="https://play.google.com/store/apps/details?id=ruqi.app&pcampaignid=web_share" target="_blank">
              <div class="app_container">
                <img src="@/assets/icons/google_store.svg" />
                <div class="app_text">
                  Скачать в
                  <div class="app_name">Google Play</div>
                </div>
              </div>
            </a>
            <a href="https://www.rustore.ru/catalog/app/ruqi.app" target="_blank">
              <div class="app_container">
                <img src="@/assets/icons/rustore.svg" />
                <div class="app_text">
                  Скачать в
                  <div class="app_name">RuStore</div>
                </div>
              </div>
            </a>
            <a href="https://apps.apple.com/ru/app/ruqi/id6748985382?platform=iphone" target="_blank">
              <div class="app_container">
                <img src="@/assets/icons/app_store.svg" />
                <div class="app_text">
                  Скачать в
                  <div class="app_store">App Store</div>
                </div>
              </div>
            </a>
          </div>
        </div>
        <div class="right_part">
          <img src="@/assets/imgs/phone_qr_code.svg" />
        </div>
      </div>

      <h1 class="card_title">Как это работает</h1>

      <div class="card_block">
        <div class="instruction_card">
          <div class="text">Временная занятость и подработка с ежедневными выплатами</div>
          <div class="img"><img src="@/assets/imgs/app_instruction.svg" /></div>
        </div>
        <div class="instruction_card">
          <div class="text">Получайте выплату за заявку на следующий день после закрытия</div>
          <div class="img small"><img src="@/assets/imgs/app_instruction_1.svg" /></div>
        </div>
        <div class="instruction_card">
          <div class="text">Выходите на подработку уже через 3 часа</div>
          <div class="img small"><img src="@/assets/imgs/app_instruction_2.svg" /></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BreadCrumbs from '@/components/molecules/BreadCrumbs.vue'

export default {
  name: 'application',
  components: { BreadCrumbs },
  props: {
    myTemplate: { type: Array, default: () => [] },
    myTemplate1: { type: Object, default: () => ({}) },
  },
  data () {
    return {
      breadCrumbs: [{ text: 'Акции', url: '/promo' }, { text: 'Скачать приложение' }],
    }
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    openPrivacyPolicy () {
      const route = this.$router.resolve({ path: '/privacy-policy' })
      window.open(route.href, '_blank')
    },
  },
}
</script>

<style lang="scss" scoped>
.app_store {
  font-family: SFCompact;
  font-weight: 350;
  line-height: 100%;
  font-style: light;
  letter-spacing: -0.51px;
}
.application_container {
  padding-top: 32px;
  .banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 48px;
    background: #f6f8fb;
    min-height: 532px;
    border-radius: 32px;
    padding: 38px 50px 0 50px;
    margin-bottom: 112px;
    .left_part {
      max-width: 692px;
    }
    .title {
      font-weight: 700;
      font-size: 48px;
      line-height: 60px;
      margin-bottom: 16px;
    }
    .description {
      width: 692;
      height: 84;
      gap: 12px;
      margin-bottom: 48px;
    }
    .right_part {
      line-height: 0;
    }
  }
  .apps_button_block {
    display: flex;
    justify-content: flex-start;
    gap: 8px;

    &.small {
      gap: 12px;
      .app_container {
        border: 1px solid white;
        width: 130px;
        padding: 8px 12px;
        gap: 7px;
      }
      .app_text {
        font-size: 9px;
        line-height: 11px;
      }
      .app_name {
        font-size: 12.57px;
        line-height: 15.71px;
      }
      img {
        width: 25px;
      }
    }
  }
  .app_container {
    display: flex;
    gap: 10px;
    border-radius: 8px;
    background: black;
    color: white;
    padding: 8px 16px;
    width: 163px;
    cursor: pointer;
    user-select: none;
    &:hover {
      background: rgb(35, 35, 35);
    }
  }
  .app_text {
    font-size: 12px;
    line-height: 15px;
  }
  .app_name {
    font-weight: 600;
    line-height: 20px;
  }
  .card_title {
    margin-bottom: 48px;
  }
  .card_block {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    margin-bottom: 80px;
  }
  .instruction_card {
    display: flex;
    flex: 1;
    background: #1735f5;
    padding: 24px 0 0 0;
    color: white;
    border-radius: 24px;
    height: 600px;
    flex-direction: column;
    justify-content: space-between;
    font-weight: 600;
    font-size: 24px;
    line-height: 30px;

    .text {
      padding: 0 24px;
    }

    .img {
      text-align: center;
      line-height: 0;
      min-width: 396px;
    }
  }

  .footer {
    background-color: #03123a;
    padding-top: 40px;
    padding-bottom: 40px;
    color: #ffffffcc;
    font-size: 14px;
  }
  .desktop_footer {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    .legal_block {
      max-width: 372px;
    }
    .column {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .title {
      font-weight: 600;
      font-size: 16px;
      line-height: 20px;
      color: white;
    }
    .legal_data {
      line-height: 22px;
      color: #ffffff8a;
    }
  }
  .white_text {
    color: white;
  }
  .mobile_footer {
    display: none;
  }
  .bread_crumbs {
    margin-bottom: 32px;
  }
  .privacy_policy {
    cursor: pointer;
  }
  @media (max-width: 1435px) {
    .card_block {
      justify-content: flex-start;
    }
    .instruction_card {
      width: 400px;
      max-width: 400px;
    }
  }

  @media (max-width: 1000px) {
    padding-top: 16px;
    .bread_crumbs {
      margin-bottom: 24px;
    }
    .desktop_footer {
      display: none;
    }
    .mobile_footer {
      display: block;
      .menu {
        width: 182px;
        columns: 2;
        column-gap: 20px;
        line-height: 30px;
        margin-bottom: 24px;
      }
      .title {
        font-weight: 600;
        line-height: 20px;
        margin-bottom: 12px;
        color: white;
      }
      .contact_us {
        display: flex;
        gap: 12px;
        align-items: center;
        margin-bottom: 24px;
        img {
          width: 32px;
        }
        a {
          line-height: 0;
        }
      }
    }
    .banner {
      flex-direction: column;
      gap: 16px;
      min-height: 0;
      border-radius: 16px;
      padding: 20px 16px 0 16px;
      margin-bottom: 112px;
      margin-bottom: 46px;
      .title {
        font-weight: 600;
        font-size: 24px;
        line-height: 30px;
        text-align: center;
      }
      .description {
        font-family: Source Sans Pro;
        font-weight: 400;
        font-size: 16px;
        line-height: 22px;
        text-align: center;
        color: #666666;
        margin-bottom: 24px;
      }
      .apps_button_block {
        justify-content: center;
        flex-wrap: wrap;
      }
      .app_container {
        width: 151px;
      }
      .right_part {
        img {
          width: 169px;
        }
      }
    }
    .card_title {
      margin-bottom: 32px;
    }
    .card_block {
      flex-direction: column;
      align-items: center;
    }
    .instruction_card {
      width: 100%;
      max-width: 600px;
      height: 412px;
      min-height: 412px;
      gap: 24px;
      .text {
        font-size: 18px;
        line-height: 22.63px;
      }
      .img {
        min-width: 100px;
      }
      img {
        width: 285px;
      }
      .small img {
        width: 219px;
      }
    }
  }
}
</style>

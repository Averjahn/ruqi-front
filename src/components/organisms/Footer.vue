<template>
  <div class="footer_container">
    <div class="footer">
      <div class="basic_container_global">
        <div class="desktop_footer">
          <div class="top_side">
            <div class="column_24">
              <img class="logo_block" src="@/assets/icons/logo_white_text.svg" />
              <div class="row_24">
                <a href="/">Главная</a>
                <a href="/tasks">Расписание</a>
                <a href="/finance">Финансы</a>
                <a href="/promo">Акции</a>
                <a href="/support">Поддержка</a>
              </div>
            </div>
            <div class="apps_button_block small">
              <a href="https://play.google.com/store/apps/details?id=ruqi.app&pcampaignid=web_share" target="_blank">
                <div class="app_container">
                  <img src="@/assets/icons/google_store.svg" />
                  <div class="app_name">Google Play</div>
                </div>
              </a>
              <a href="https://www.rustore.ru/catalog/app/ruqi.app" target="_blank">
                <div class="app_container">
                  <img src="@/assets/icons/rustore.svg" />
                  <div class="app_name">RuStore</div>
                </div>
              </a>
              <a href="https://apps.apple.com/ru/app/ruqi/id6748985382?platform=iphone" target="_blank">
                <div class="app_container">
                  <img src="@/assets/icons/app_store.svg" />
                  <div class="app_name">App Store</div>
                </div>
              </a>
            </div>
          </div>

          <div class="bottom_side">
            <div class="documents_block">
              <div class="white_text mb_16 privacy_police" @click="openPrivacyPolicy">Политика конфиденциальности</div>
              <div class="white_text mb_16 privacy_police" @click="showDocuments">Документы</div>
            </div>
            <div class="row_24">
              <a href="tel:+7-800-333-71-25" target="_blank" class="contacts_row">
                <img src="@/assets/icons/phone_call_light.svg" />
                <div class="phone_number">+7 800 333 71 25</div>
              </a>
              <a href="mailto:info@ruqi.ru" class="contacts_row" target="_blank">
                <img src="@/assets/icons/mail_20.svg" />
                <div class="contact_email">info@ruqi.ru</div>
              </a>

              <div class="social_buttons">
                <img src="@/assets/icons/telegram_native.svg" @click="openTgChannel" alt="" class="banner_img" />
                <img src="@/assets/icons/vk.svg" @click="openVkChannel" alt="" class="banner_img" />
              </div>
            </div>
          </div>
        </div>

        <div class="mobile_footer">
          <img class="mb_24" src="@/assets/icons/logo_white_text.svg" />
          <div class="menu">
            <a href="/">Главная</a><br />
            <a href="/tasks">Расписание</a><br />
            <a href="/finance">Финансы</a><br />
            <a href="/promo">Акции</a><br />
            <a href="/support">Поддержка</a><br />
          </div>
          <div class="apps_button_block small mb_12">
            <a href="https://play.google.com/store/apps/details?id=ruqi.app&pcampaignid=web_share" target="_blank">
              <div class="app_container">
                <img src="@/assets/icons/google_store.svg" />
                <div class="app_name">Google Play</div>
              </div>
            </a>
            <a href="https://www.rustore.ru/catalog/app/ruqi.app" target="_blank">
              <div class="app_container">
                <img src="@/assets/icons/rustore.svg" />
                <div class="app_name">RuStore</div>
              </div>
            </a>
            <a href="https://apps.apple.com/ru/app/ruqi/id6748985382?platform=iphone" target="_blank">
              <div class="app_container">
                <img src="@/assets/icons/app_store.svg" />
                <div class="app_name">App Store</div>
              </div>
            </a>
          </div>
          <div class="contact_us">
            <div class="contacts_row">
              <img src="@/assets/icons/phone_call_light.svg" />
              <div class="phone_number">+7 800 333 71 25</div>
            </div>
            <div class="contacts_row">
              <img src="@/assets/icons/mail_20.svg" />
              <div class="contact_email">info@ruqi.ru</div>
            </div>

            <div class="social_buttons">
              <img src="@/assets/icons/telegram_native.svg" @click="openTgChannel" alt="" class="banner_img" />
              <img src="@/assets/icons/vk.svg" @click="openVkChannel" alt="" class="banner_img" />
            </div>
          </div>
          <div class="documents_block">
            <div class="white_text mb_16 privacy_police" @click="openPrivacyPolicy">Политика конфиденциальности</div>
            <div class="white_text mb_16 privacy_police" @click="showDocuments">Документы</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  components: {},
  props: {},
  data () {
    return {}
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
    showDocuments () {
      const route = this.$router.resolve({ path: '/documents' })
      window.open(route.href, '_blank')
    },
    openTgChannel () {
      window.open('https://t.me/ruqi_job', '_blank')
    },
    openVkChannel () {
      window.open('https://vk.com/club232685726', '_blank')
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
.social_buttons {
  display: flex;
  height: 24px;
  gap: 8px;
}
.contact_email {
  display: block;
  text-wrap: wrap;
}
.footer_container {
  .row_24 {
    display: flex;
    flex-direction: row;
    gap: 24px;
  }
  .contacts_row {
    max-height: 20px;
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .apps_button_block {
    display: flex;
    justify-content: flex-start;
    gap: 8px;

    &.small {
      gap: 12px;
      .app_container {
        width: 130px;
        padding: 6px 12px;
        gap: 8px;
      }
      .app_name {
        font-size: 12.57px;
        line-height: 125%;
      }
      img {
        width: 25px;
      }
    }
  }
  .app_container {
    display: flex;
    gap: 10px;
    align-items: center;
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
  .app_name {
    font-size: 12.57px;
    font-weight: 600;
    line-height: 125%;
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
    flex-direction: column;
    gap: 24px;
    .top_side {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ffffff3d;
      padding-bottom: 32px;
    }
    .documents_block {
      display: flex;
      gap: 24px;
    }
    .bottom_side {
      display: flex;
      justify-content: space-between;
    }
    .column {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .column_24 {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .logo_block {
      display: block;
      max-width: 122px;
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

  .privacy_police {
    cursor: pointer;
  }

  @media (max-width: 1000px) {
    .apps_button_block {
      flex-wrap: wrap;
    }
    padding-top: 16px;
    .desktop_footer {
      display: none;
    }
    .documents_block {
      flex-direction: column;
      gap: 16px;
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
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
        margin-bottom: 24px;
        a {
          line-height: 0;
        }
      }
    }
  }
}
</style>

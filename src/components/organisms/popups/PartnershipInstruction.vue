<template>
  <PopupContainer
    :loading="loading"
    class="connect_smz_popup"
    title="Как подключить партнёрство для формирования"
    maxWidth="820px"
    @close="$emit('close')"
  >
    <div class="instruction_container_desktop">
      <div class="instruction_card">
        <img src="@/assets/imgs/partnership_instruction_pc.jpg" />
        <div>
          1. Зайдите в личный <a href="https://lkfl2.nalog.ru/lkfl" target="blank">кабинет ФНС</a>, чтобы перейти в
          раздел Партнёры
        </div>
      </div>
      <div class="instruction_card">
        <img src="@/assets/imgs/partnership_instruction_pc1.jpg" />
        2. Найдите «Платформенные Решения» среди остальных партнеров или воспользуйтесь поиском
      </div>
      <div class="instruction_card">
        <img src="@/assets/imgs/partnership_instruction_pc2.jpg" />
        3. Нажмите на кнопку «Предлагает подключиться»
      </div>
      <div class="instruction_card">
        <img src="@/assets/imgs/partnership_instruction_pc3.jpg" />
        4. После подтверждения запроса прав, вы сможете продолжить пользоваться услугами «Джем работа» находить
        подработки и выполнять их.
      </div>
    </div>
    <div class="instruction_container_mobile">
      <div>
        <div class="title">1. Установите приложение «Мой Налог» и авторизуйтесь в нём</div>
        <div class="apps_button_block">
          <a href="https://play.google.com/store/apps/details?id=com.gnivts.selfemployed&hl=ru" target="_blank">
            <div class="app_container">
              <img src="@/assets/icons/google_store.svg" />
              <div class="app_text">
                Скачать в
                <div class="app_name">Google Play</div>
              </div>
            </div>
          </a>
          <a href="https://www.rustore.ru/catalog/app/com.gnivts.selfemployed" target="_blank">
            <div class="app_container">
              <img src="@/assets/icons/rustore.svg" />
              <div class="app_text">
                Скачать в
                <div class="app_name">RuStore</div>
              </div>
            </div>
          </a>
          <a href="https://apps.apple.com/ru/app/мой-налог/id1437518854" target="_blank">
            <div class="app_container">
              <img src="@/assets/icons/app_store.svg" />
              <div class="app_text">
                Скачать в
                <div class="app_name">App Store</div>
              </div>
            </div>
          </a>
        </div>
      </div>
      <div>
        <div class="title">2. Перейдите в раздел «Прочее», нажав по своей аватарке</div>
        <div class="img_center"><img src="@/assets/imgs/partnership_instruction_mobile.jpg" /></div>
      </div>
      <div>
        <div class="title">3. Перейдите в раздел «Партнёры»</div>
        <div class="img_center"><img src="@/assets/imgs/partnership_instruction_mobile1.jpg" /></div>
      </div>
      <div>
        <div class="title">
          4.Ищите среди партнёров или воспользуйтесь поиском и подтвердить запрос прав (нужно нажать кнопку «Разрешить»)
        </div>
        <div class="img_center"><img src="@/assets/imgs/partnership_instruction_mobile2.jpg" /></div>
      </div>
    </div>

    <template v-slot:footer>
      <div class="button_row_global mt_8">
        <Button type="outlined" @click="$emit('close')">Отмена</Button>
        <Button @click="$emit('close')">Ok</Button>
      </div>
    </template>
  </PopupContainer>
</template>

<script>
import PopupContainer from '@/components/atoms/PopupContainer.vue'

export default {
  name: 'MedicalBookPopup',
  components: {
    PopupContainer,
  },
  props: {},

  data () {
    return {}
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.connect_smz_popup {
  .info_content {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 16px;
    border-radius: 8px;
    background: #f2f8ff;
    margin-bottom: 24px;
    .title {
      font-weight: 600;
      margin-bottom: 4px;
    }
    .description {
      font-size: 14px;
    }
  }
  .instruction_container_desktop {
    display: flex;
    column-gap: 32px;
    row-gap: 24px;
    flex-wrap: wrap;
    margin-bottom: 32px;
    .instruction_card {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 12px;
    }
    img {
      margin-bottom: 12px;
    }
    a {
      color: #1aa0ff;
    }
  }
  .instruction_container_mobile {
    display: none;
    margin-bottom: 24px;
  }

  .popup_scroll_wrap {
    height: calc(100% - 100px);
    overflow-y: auto;
  }

  .apps_button_block {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 8px;
  }
  .app_container {
    display: flex;
    gap: 10px;
    border-radius: 8px;
    background: black;
    color: white;
    padding: 9px 16px;
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
  .img_center {
    text-align: center;
  }

  @media (max-width: 1000px) {
    .instruction_container_desktop {
      display: none;
    }
    .instruction_container_mobile {
      display: flex;
      flex-direction: column;
      gap: 24px;
      .title {
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 16px;
      }
    }
  }
}
</style>

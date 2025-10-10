<template>
  <div class="user_info">
    <Block>
      <BlockHeader class="mb_16" :withoutButton="true">Для исполнителей</BlockHeader>
      <div class="content_container_block">
        <div class="document_item">
          <ButtonText @click="goToRoute('/privacy-policy')" class="document_title"
            >Политика в отношении обработки персональных данных</ButtonText
          >
          <div class="document_valid_from">
            {{ documentValidDate }}
          </div>
        </div>
        <div class="document_item">
          <ButtonText @click="goToRoute('/dogovor-okazaniya-uslug')" class="document_title"
            >Договор оказания услуг</ButtonText
          >
          <div class="document_valid_from">
            {{ documentValidDate }}
          </div>
        </div>
        <div class="document_item">
          <ButtonText @click="goToRoute('/edo')" class="document_title">ЭДО</ButtonText>
          <div class="document_valid_from">
            {{ documentValidDate }}
          </div>
        </div>
        <div class="document_item">
          <ButtonText @click="goToRoute('/terms-of-use')" class="document_title"
            >Пользовательское соглашение</ButtonText
          >
          <div class="document_valid_from">
            {{ documentValidDate }}
          </div>
        </div>
        <div class="document_item">
          <ButtonText @click="goToRoute('/personal')" class="document_title"
            >Согласие на обработку персональных данных</ButtonText
          >
          <div class="document_valid_from">
            {{ documentValidDate }}
          </div>
        </div>
      </div>
    </Block>
  </div>
</template>

<script>
import Block from '@/components/page/profile/Block.vue'
import BlockHeader from '@/components/page/profile/BlockHeader.vue'

export default {
  components: {
    Block,
    BlockHeader,
  },
  props: {
    myTemplate: { type: Array, default: () => [] },
    myTemplate1: { type: Object, default: () => ({}) },
  },
  data () {
    return {
      isAboutPopup: false,
      isEducationPopup: false,
      isProfessionsPopupOpen: false,
      educationEditId: null,
    }
  },
  computed: {
    documentValidDate () {
      return `Действует с ${this.$dayjs('12.08.2025', 'DD.MM.YYYY').format('DD.MM.YYYY')}`
    },
  },
  watch: {},
  mounted () {},
  methods: {
    goToRoute (route) {
      this.$router.push(route)
    },
  },
}
</script>

<style lang="scss" scoped>
.user_info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  .main_block {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .label {
    color: #c7c7c7;
    margin-bottom: 8px;
  }

  .content_container_block,
  .document_item {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .document_item {
    gap: 8px;
  }

  .document_title {
    font-size: 20px;
    color: #1735f5;
  }

  .document_valid_from {
    color: document_valid_from;
    font-size: 14px;
    color: #666;
  }

  @media (max-width: 1000px) {
    .main_block {
      display: none;
    }
    .document_title {
      font-size: 16px;
    }
    .user_info_top {
      flex-direction: column-reverse;
    }
  }
}
</style>

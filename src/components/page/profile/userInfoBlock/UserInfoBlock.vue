<template>
  <Popup v-model:show="isProfessionsPopupOpen">
    <ProfessionsPopup @close="isProfessionsPopupOpen = false" />
  </Popup>
  <Popup v-model:show="isAboutPopup">
    <AboutUserPopup @close="isAboutPopup = false" />
  </Popup>
  <Popup v-model:show="isEducationPopup">
    <EducationPopup @close="isEducationPopup = false" :educationEditId="educationEditId" />
  </Popup>

  <div class="user_info">

    <Block>
      <BlockHeader class="mb_8" @edit="isAboutPopup = true" :isEmpty="!profile.about_yourself">О себе</BlockHeader>
      <div class="content_container_block">
        Напишите коротко о ваших сильных сторонах, важных качествах, какие инструменты и технологии используете. Про
        услуги и опыт напишите

        <div v-if="profile.about_yourself" class="about_yourself">
          {{ profile.about_yourself }}
        </div>
      </div>
    </Block>

    <Block>
      <BlockHeader class="mb_8" @edit="createEducation" isEmpty>Образование</BlockHeader>
      <div class="content_container_block">
        Подробно опишите ваше образование: вуз, название специальности, тип обучения,например, «РГГУ, маркетинг
        и технологии, бакалавр» или «УГТУ УПИ, графический дизайн, курсы переподготовки»
        <div v-if="profile?.education?.length" class="education_wrap">
          <EducationCard v-for="item in profile.education" :key="item.id" :education="item" @edit="editEducation" />
        </div>
      </div>
    </Block>

    <Block>
      <BlockHeader class="mb_8" @edit="isProfessionsPopupOpen = true">Профессии и условия работы</BlockHeader>
      <div class="content_container_block">
        Подробно опишите ваше образование: вуз, название специальности, тип обучения,например, «РГГУ, маркетинг
        и технологии, бакалавр» или «УГТУ УПИ, графический дизайн, курсы переподготовки»
        <div v-if="profile?.work_schedule?.length">
          <div class="label">График работы</div>
          {{ profile.work_schedule.join(', ') }}
        </div>
        <div v-if="profile?.employment_type?.length">
          <div class="label">Тип занятости</div>
          {{
            profile.employment_type.map((item) => EMPLOYMENT_TYPE[item]?.name || 'неизвестный тип занятости').join(', ')
          }}
        </div>
        <div v-if="profile?.professions?.length" class="professions_list">
          <ProfessionLabel
            v-for="profession in profile.professions"
            :key="profession.uuid"
            :profession="profession.name"
          />
        </div>
      </div>
    </Block>
  </div>
</template>

<script>
import ProfessionLabel from '@/components/atoms/ProfessionLabel.vue'
import ProfessionsPopup from '@/components/organisms/popups/ProfessionsPopup.vue'
import AboutUserPopup from '@/components/organisms/popups/AboutUserPopup.vue'
import EducationPopup from '@/components/organisms/popups/EducationPopup.vue'
import Block from '@/components/page/profile/Block.vue'
import BlockHeader from '@/components/page/profile/BlockHeader.vue'
import EducationCard from '@/components/page/profile/userInfoBlock/EducationCard.vue'
import { EMPLOYMENT_TYPE } from '@/constants/constants'

export default {
  components: {
    AboutUserPopup,
    ProfessionsPopup,
    ProfessionLabel,
    Block,
    BlockHeader,
    EducationCard,
    EducationPopup,
  },
  props: {
    profile: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      EMPLOYMENT_TYPE,
      isAboutPopup: false,
      isEducationPopup: false,
      isProfessionsPopupOpen: false,
      educationEditId: null,
    }
  },
  computed: {},
  watch: {},
  mounted () {},
  methods: {
    editEducation (id) {
      this.educationEditId = id
      this.isEducationPopup = true
    },
    createEducation () {
      this.educationEditId = null
      this.isEducationPopup = true
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

  .professions_list {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .content_container_block {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .about_yourself {
    color: #666666;
    font-size: 14px;
    line-height: 22px;
  }

  .education_wrap {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  @media (max-width: 1000px) {
    .main_block {
      display: none;
    }
    .user_info_top {
      flex-direction: column-reverse;
    }
  }
}
</style>

<template>
  <Popup v-model:show="isPopupOpen">
    <PopupContainer maxWidth="560px" noPadding noHeader>
      <div class="congratulations_popup">
        <ButtonIconGhost class="close_button" color="transparent" @click="isPopupOpen = false">
          <img src="@/assets/icons/cross_white.svg" />
        </ButtonIconGhost>
        <img v-if="isAnimationVisible" class="confetti_animation" src="@/assets/animations/confetti_explode.gif" />
        <img class="reward_icon" src="@/assets/icons/grade1.svg" />
        <div class="text_block">
          <h5>
            Поздравляем! <br />
            Вы получаете ранг «{{ grade.name }}» {{ profile.level || 1 }} уровень
          </h5>
          <div class="rating_block">
            <img v-for="n in grade?.stars || 0" :key="n" src="@/assets/icons/star.svg" />
          </div>
        </div>
        <Button color="white" @click="onMore">Подробнее</Button>
      </div>
    </PopupContainer>
  </Popup>
</template>

<script>
import PopupContainer from '@/components/atoms/PopupContainer.vue'
import { mapActions, mapGetters } from 'vuex'
import { GRADES } from '@/constants/constants'

export default {
  name: 'RangCongratulationsPopup',
  components: { PopupContainer },
  props: {},
  data () {
    return {
      isPopupOpen: false,
      animationTimer: null,
      isAnimationVisible: false,
    }
  },
  computed: {
    ...mapGetters('profilePage', ['profile']),
    grade () {
      return GRADES[this.profile?.grade || 1]
    },
    profileGrade () {
      return this.profile?.grade || null
    },
    gradeGreetings () {
      return this.profile?.grade_greetings || null
    },
  },
  async mounted () {
    await this.fetchProfileOnce()
    this.checkGreetings()
  },
  unmounted () {
    clearTimeout(this.animationTimer)
  },
  watch: {},
  methods: {
    ...mapActions('profilePage', ['fetchProfileOnce', 'putGradeGreetings']),

    checkGreetings () {
      if (this.gradeGreetings !== this.profileGrade) {
        this.isPopupOpen = true
        this.showAnimation()
        this.putGradeGreetings(this.profileGrade)
      }
    },

    onMore () {
      this.isPopupOpen = false
      this.$router.push('/promo/grades')
    },

    showAnimation () {
      this.animationTimer = setTimeout(() => {
        this.isAnimationVisible = true
        this.animationTimer = setTimeout(() => {
          this.isAnimationVisible = false
        }, 2100)
      }, 1000)
    },
  },
}
</script>

<style lang="scss" scoped>
.congratulations_popup {
  position: relative;
  background: linear-gradient(211.76deg, #82a5d8 -23.55%, #853eb0 123.55%);
  padding: 32px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
  .close_button {
    position: absolute;
    top: 24px;
    right: 24px;
  }
  .confetti_animation {
    position: absolute;
    top: 65%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
  }
  .reward_icon {
    width: auto;
    height: 180px;
  }
  .text_block {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    text-align: center;
    color: white;
  }
  .rating_block {
    display: flex;
    gap: 4px;
    img {
      width: 32px;
    }
  }
  @media (max-width: 1000px) {
    .reward_icon {
      height: 160px;
    }
  }
  @media (max-width: 600px) {
    padding: 16px;
  }
}
</style>

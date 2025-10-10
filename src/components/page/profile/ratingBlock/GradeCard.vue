<template>
  <div :class="['grade_card_container', { active, animation, plug }]">
    <img class="confetti" src="@/assets/animations/confetti.gif" />
    <img class="img" :src="require(`@/assets/icons/grade${GRADES[grade]?.id || 1}.svg`)" />
    <img class="star_group" src="@/assets/icons/star_group.svg" />
    <div class="star_animation">
      <div class="shooting-star"></div>
      <div class="shooting-star-2"></div>
      <div class="star"></div>
      <div class="star second"></div>
      <div class="star third"></div>
      <div class="star fourth"></div>
      <div class="star fifth"></div>
    </div>
    <div class="rating">
      <img v-for="n in GRADES[grade]?.stars || 0" :key="n" src="@/assets/icons/star.svg" />
    </div>
    <div class="text_block">
      <div class="name">{{ GRADES[grade]?.name }}</div>
      <div>
        {{ GRADES[grade]?.levels[0] }}-{{ GRADES[grade]?.levels[(GRADES[grade]?.levels?.length || 1) - 1] }} уровень
      </div>
      <div class="description" v-html="GRADES[grade]?.descriptionHtml" />
    </div>
  </div>
</template>

<script>
import { GRADES, LEVELS } from '@/constants/constants'

export default {
  name: 'GradeCard',
  components: {},
  props: {
    grade: { type: Number, default: 1 },
    active: { type: Boolean, default: false },
    animation: { type: Boolean, default: false },
    plug: { type: Boolean, default: false },
  },
  data () {
    return {
      GRADES,
    }
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.grade_card_container {
  position: relative;
  flex: 1;
  min-width: 235px;
  max-width: 361px;
  min-height: 361px;
  padding: 16px;
  border-radius: 16px;
  background: #f3f3f3;
  text-align: center;
  color: #666666;
  opacity: 0.64;
  overflow: hidden;
  border: 1px solid #0000000a;
  .confetti {
    position: absolute;
    top: -75px;
    left: -47px;
    width: 244px;
  }
  span {
    color: #333335;
  }
  .text_block {
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 8px;
    .name {
      color: #263043;
    }
    .description {
      font-size: 14px;
      line-height: 22px;
      letter-spacing: 0.1px;
    }
  }

  .star_animation {
    display: none;
  }
  .img {
    position: relative;
    margin-bottom: 8px;
    z-index: 3;
  }
  @keyframes float {
    0% {
      transform: translateY(3px);
    }
    25% {
      transform: translateY(-2px);
    }
    50% {
      transform: translateY(2px);
    }
    75% {
      transform: translateY(-3px);
    }
    100% {
      transform: translateY(3px);
    }
  }
  .star_group {
    display: none;
  }
  .rating {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 4px 0;
  }
  &.animation {
    .img {
      animation: float 12s ease-in-out infinite;
    }
    .star_animation {
      display: block;
    }
  }
  &.plug {
    opacity: 0;
    user-select: 0;
    overflow: hidden;
    height: 0;
    min-height: 0;
    padding-top: 0;
    padding-bottom: 0;
    pointer-events: none;
  }
  &.active {
    color: white;
    opacity: 1;
    background: linear-gradient(211.76deg, #82a5d8 -23.55%, #853eb0 123.55%);
    border: none;
    span {
      color: white;
    }
    .star_group {
      width: 90%;
      display: block;
      position: absolute;
      top: 8px;
      left: 5%;
      z-index: 1;
    }
    .name {
      color: #fff;
    }
  }
  .shooting-star {
    z-index: 2;
    width: 1px;
    height: 50px;
    border-bottom-left-radius: 50%;
    border-bottom-right-radius: 50%;
    position: absolute;
    top: 0;
    left: -50px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), white);
    animation: animShootingStar 5s linear infinite;
    -webkit-transition: all 2000ms linear;
    transition: all 2000ms linear;
  }
  @keyframes animShootingStar {
    from {
      transform: translateY(0px) translateX(0px) rotate(-45deg);
      opacity: 1;
      height: 5px;
    }
    to {
      transform: translateY(1280px) translateX(1280px) rotate(-45deg);
      opacity: 1;
      height: 800px;
    }
  }
  .shooting-star-2 {
    z-index: 2;
    width: 1px;
    height: 50px;
    border-bottom-left-radius: 50%;
    border-bottom-right-radius: 50%;
    position: absolute;
    top: 0;
    left: 60px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), white);
    animation: animShootingStar-2 9s linear infinite;
    -webkit-transition: all 2000ms linear;
    transition: all 2000ms linear;
  }
  @keyframes animShootingStar-2 {
    from {
      transform: translateY(0px) translateX(0px) rotate(-45deg);
      opacity: 1;
      height: 5px;
    }
    to {
      transform: translateY(1920px) translateX(1920px) rotate(-45deg);
      opacity: 1;
      height: 800px;
    }
  }
  .confetti {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: none;
  }
  .star {
    z-index: 2;
    position: absolute;
    top: 101px;
    left: 10%;
    background-image: url('@/assets/icons/polar_star.svg');
    background-size: 15px 15px;
    width: 15px;
    height: 15px;
    opacity: 0.4;
    animation: starShine 3.5s linear infinite;
    -webkit-transition: all 1200ms linear;
    transition: all 1200ms linear;
  }
  .star.second {
    top: 60px;
    left: 85%;
    animation-delay: 1s;
  }
  .star.third {
    top: 130px;
    left: 100px;
    animation-delay: 1.4s;
  }
  .star.fourth {
    top: 255px;
    left: 50%;
    animation-delay: 1.8s;
  }
  .star.fifth {
    top: 175px;
    left: 65%;
    animation-delay: 2.2s;
  }
  @keyframes starShine {
    0% {
      transform: scale(0.3) rotate(0deg);
      opacity: 0.4;
    }
    25% {
      transform: scale(1) rotate(360deg);
      opacity: 1;
    }
    50% {
      transform: scale(0.3) rotate(720deg);
      opacity: 0.4;
    }
    100% {
      transform: scale(0.3) rotate(0deg);
      opacity: 0.4;
    }
  }
}
</style>

<template>
  <div class="bring_friend_container">
    <div class="basic_container_global">
      <BreadCrumbs class="bread_crumbs" :items="breadCrumbs" />
    </div>

    <HorizontalScroll wide>
      <div class="bonus_block basic_container_global">
        <BonusBlock withBorder />
      </div>
    </HorizontalScroll>

    <div class="basic_container_global">
      <div class="banner">
        <div class="content">
          <div class="title">Повышайте уровни, зарабатывайте рейтинговые звезды и получайте бонусы!</div>
          <div class="description">
            Познакомьтесь с новой рейтинговой системой сервиса! Получайте уровни, продвигайтесь по рангам, зарабатывайте
            награды и бонусы за свои достижения. Каждый ваш успех теперь будет отмечен!
          </div>
        </div>
        <div class="img">
          <img src="@/assets/icons/grades_stages.svg" />
        </div>
      </div>

      <h1 class="main_header">Звездный рейтинг</h1>

      <div class="about_stars_block">
        <div class="about_star_card wide">
          <div class="text_part">
            <h3 class="mb_16">Что такое звезды?</h3>
            <ul>
              <li>
                Звезды — это отражение вашей активности, качества работы, профессионализма и вовлеченности в сервис
              </li>
              <li>Они могут как накапливаться, так и уменьшаться</li>
              <li>
                Звезды необходимы для повышения ранга, однако вы можете прокачивать уровни в пределах текущего ранга и
                без них
              </li>
              <li>Для перехода на новый ранг наличие звезд обязательно</li>
              <li>При достижении нового ранга звезды обнуляются</li>
            </ul>
          </div>
          <img class="icon" src="@/assets/icons/three_stars.svg" />
        </div>
        <div class="about_star_card">
          <div class="text_part">
            <h3 class="mb_16">Как получить звезды?</h3>
            <ul>
              <li>За 10 лайков (успешно завершенных заявок)</li>
              <li>За регулярность: набирайте минимум 4 лайка каждую неделю</li>
              <li>За привлечение друга на платформу</li>
              <li>За статус бригадира</li>
              <li>За завершение заявок на трех разных объектах</li>
            </ul>
          </div>
          <img class="icon" src="@/assets/icons/hands_star.svg" />
        </div>
        <div class="about_star_card">
          <div class="text_part">
            <h3 class="mb_16">Как потерять звезды?</h3>
            <ul>
              <li>Недостаток лайков за неделю (меньше 4)</li>
              <li>Переход на новый ранг (сброс звезд)</li>
            </ul>
          </div>
          <img class="icon" src="@/assets/icons/star_cross.svg" />
        </div>
      </div>
    </div>

    <div class="grey_section">
      <div class="section_container basic_container_global">
        <h2 class="main_header">Уровни и ранги</h2>
        <div class="grade_block">
          <GradeDescriptionCard :grade="1" />
          <GradeDescriptionCard :grade="2" />
          <GradeDescriptionCard :grade="3" />
          <GradeDescriptionCard :grade="4" />
          <GradeDescriptionCard :grade="5" />
          <GradeDescriptionCard :grade="6" />
          <!-- <GradeDescriptionCard isPlug /> -->
        </div>
      </div>
    </div>

    <div class="basic_container_global">
      <div class="section_container">
        <h2 class="mb_32">Лайки и диcлайки</h2>
        <div class="about_likes_block">
          <div class="about_likes_card">
            <div class="icon">
              <img src="@/assets/icons/like.svg" />
            </div>
            <div class="title">Что такое лайки?</div>
            <ul>
              <li>1 лайк = успешно завершенная заявка</li>
              <li>Завершенная заявка - самостоятельная запись на нее, отсутствие штрафов и получение оплаты</li>
            </ul>
          </div>
          <div class="about_likes_card">
            <div class="icon">
              <img src="@/assets/icons/dislike.svg" />
            </div>
            <div class="title">Что такое дислайки?</div>
            <ul>
              <li>1 дислайк отнимает один лайк</li>
              <li>Дислайк можно получить за пропуск смены, негативный отзыв, незначительное нарушение</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="section_container">
        <h2 class="mb_16">Понижение уровней и ранга</h2>
        <ul class="mb_32">
          <li>
            Если вы недавно повысили уровень или ранг и у вас 0 лайков, получение дизлайка может привести к потере
            уровня или даже ранга, если он был только что достигнут..
          </li>
          <li>За серьезные нарушения отнимается 1 уровень</li>
          <li>За средние нарушения отнимается 0,5 уровня</li>
        </ul>
        <div class="penalties">
          <div class="grey_card">
            <h3 class="title">Серьезные</h3>
            <ul>
              <li>Кража, алкогольное/наркотическое опьянение</li>
              <li>Порча имущества</li>
            </ul>
          </div>
          <div class="grey_card">
            <h3 class="title">Средние</h3>
            <ul>
              <li>Доставка на неправильный склад</li>
              <li>Некорректная маркировка</li>
            </ul>
          </div>
          <div class="grey_card">
            <h3 class="title">Незначительные (дислайк)</h3>
            <ul>
              <li>Отсутствие СИЗ</li>
              <li>Нарушение поведения</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BreadCrumbs from '@/components/molecules/BreadCrumbs.vue'
import GradeDescriptionCard from '@/components/molecules/GradeDescriptionCard.vue'
import HorizontalScroll from '@/components/atoms/HorizontalScroll.vue'
import BonusBlock from '@/components/organisms/BonusBlock.vue'

export default {
  name: 'bringFriend',
  components: { BreadCrumbs, GradeDescriptionCard, HorizontalScroll, BonusBlock },
  props: {},
  data () {
    return {
      breadCrumbs: [{ text: 'Акции', url: '/promo' }, { text: 'Рейтинги (звезды)' }],
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
.bring_friend_container {
  padding-top: 32px;
  padding-bottom: 36px;
  ul {
    list-style-type: disc;
    margin-left: 5px;
    padding-left: 20px;
  }
  .bread_crumbs {
    margin-bottom: 32px;
  }
  .bonus_block {
    width: 100%;
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
      max-width: 583px;
    }
    .title {
      font-size: 32px;
      font-weight: 600;
      line-height: 125%;
    }
    .description {
      font-size: 18px;
      line-height: 28px;
    }
    .img {
      position: relative;
      overflow: hidden;
      width: 374px;
      height: 272px;
      img {
        height: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .main_header {
    margin-bottom: 48px;
  }
  .about_stars_block {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    margin-bottom: 80px;
  }
  .about_star_card {
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    padding: 24px;
    border-radius: 16px;
    border: 1px solid #0000001a;
    min-width: 40%;
    &.wide {
      min-width: 60%;
    }
    .text_part {
      line-height: 24px;
    }
  }
  .grey_section {
    background-color: #f5f5f5;
  }
  .section_container {
    padding-top: 80px;
    padding-bottom: 80px;
  }

  .grade_block {
    display: flex;
    justify-content: center;
    gap: 24px;
    flex-wrap: wrap;
  }

  .about_likes_block {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
  }
  .about_likes_card {
    flex: 1;
    min-width: 300px;
    padding: 24px;
    border-radius: 16px;
    border: 1px solid #0000001a;
    .icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ebf0ff;
      border-radius: 8px;
      margin-bottom: 24px;
    }
    .title {
      font-size: 24px;
      line-height: 30px;
      margin-bottom: 16px;
    }
  }
  .penalties {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
  }
  .grey_card {
    flex: 1;
    padding: 24px;
    background: #f5f5f5;
    border-radius: 16px;
    min-width: 344px;
    .title {
      margin-bottom: 16px;
    }
  }

  @media (max-width: 1000px) {
    padding-bottom: 100px;
    padding-top: 16px;
    .bread_crumbs {
      margin-bottom: 24px;
    }
    .bonus_block {
      margin-bottom: 16px;
    }
    .banner {
      flex-direction: column-reverse;
      gap: 16px;
      padding: 16px;
      height: auto;
      margin-bottom: 48px;
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
      .img {
        overflow: hidden;
        width: 100%;
        min-width: 100%;
        height: 200px;
        img {
          width: 100%;
          min-width: 270px;
          max-width: 385px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
    .main_header {
      margin-bottom: 24px;
    }
    .about_stars_block {
      gap: 16px;
      margin-bottom: 48px;
    }
    .about_star_card {
      min-width: 60%;
      padding: 24px 20px;
      .icon {
        width: 48px;
        min-width: 48px;
      }
    }
    .section_container {
      padding-top: 48px;
      padding-bottom: 48px;
    }
    .penalties {
      gap: 16px;
    }
    .grey_card {
      min-width: 300px;
      .title {
        margin-bottom: 12px;
      }
    }
  }

  @media (max-width: 600px) {
    .about_star_card {
      flex-direction: column-reverse;
      gap: 16px;
    }
  }
}
</style>

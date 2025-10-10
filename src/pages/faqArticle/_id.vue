<template>
  <div class="faq_article basic_container_global">
    <div class="main_container">
      <div class="content_block">
        <div class="article_header">
          <div class="text">{{ article.title }}</div>
          <img class="background" src="@/assets/icons/u_letter.svg" />
        </div>
        <div class="article_body_global" v-html="article.body" />
      </div>

      <div class="navigation_block">
        <div class="navigation_header">{{ article.category?.name }}</div>
        <div class="category_list">
          <ButtonText
            v-for="item in relatedArticles"
            :key="item.id"
            type="s"
            color="grey"
            @click="$router.push('/faq-article/' + item.id)"
          >
            {{ item.title }}
          </ButtonText>
        </div>
        <div class="navigation_footer" @click="$router.push('/support?tab=faqs')">
          К списку тем
          <img src="@/assets/icons/arrow_circle_right.svg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import useGlobalLoading from '@/composables/useGlobalLoading'

export default {
  name: 'index',
  components: {},
  props: {},
  setup () {
    const { startLoading, stopLoading, loading } = useGlobalLoading()
    return { startLoading, stopLoading, loading }
  },
  data () {
    return {
      article: {},
      articles: [],
    }
  },
  computed: {
    ...mapGetters('auth', ['isLogged']),

    relatedArticles () {
      for (let i = 0; i < this.articles?.length; i++) {
        if (this.articles[i]?.articles?.[0]?.category_id === this.article.category_id) return this.articles[i]?.articles
      }
      return []
    },
    id () {
      return this.$route.params.id
    },
  },
  async mounted () {
    this.init()
  },
  unmounted () {},
  watch: {
    id () {
      this.init()
    },
  },
  methods: {
    ...mapActions('notifications', ['showNotification']),

    async init () {
      this.startLoading()
      await Promise.all([this.fetchArticle(), this.fetchFaqs()])
      this.stopLoading()
    },

    async fetchFaqs () {
      const url = this.isLogged ? 'v2/faq/articles' : 'v2/faq/faqInfo'
      const response = await this.$axios.get(url, {
        errorMessage: 'Не удалось загрузить список статей',
      })
      if (response?.data?.success) this.articles = response.data.data
    },

    async fetchArticle () {
      const response = await this.$axios.get('v2/faq/faqArticle', {
        errorMessage: 'Не удалось загрузить основную статью',
        params: { id: this.id },
      })
      if (response?.data?.success) this.article = response.data.data
    },
  },
}
</script>

<style lang="scss" scoped>
.faq_article {
  padding-top: 32px;
  padding-bottom: 32px;
  .main_container {
    display: flex;
    align-items: flex-start;
    gap: 32px;
  }
  .content_block {
    flex: 1;
    padding: 32px;
    border-radius: 12px;
    border: 1px solid #0000001a;
  }
  .article_header {
    position: relative;
    padding: 32px;
    color: white;
    font-size: 36px;
    font-weight: 600;
    line-height: 45px;
    border-radius: 12px;
    background: #03123a;
    margin-bottom: 24px;
    .text {
      z-index: 1;
    }
    .background {
      position: absolute;
      right: 16px;
      top: -15px;
      width: 116px;
      z-index: 0;
    }
  }
  .article_body_global {
    background-color: white;
  }

  .navigation_block {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 400px;
    padding: 32px;
    border-radius: 12px;
    border: 1px solid #0000001a;
  }
  .navigation_header {
    font-size: 24px;
    font-weight: 600;
    line-height: 30px;
  }
  .category_list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .navigation_footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
    cursor: pointer;
  }

  @media (max-width: 1000px) {
    padding-bottom: 100px;
    .content_block {
      padding: 16px;
    }
    .main_container {
      flex-direction: column;
      gap: 32px;
    }
    .article_header {
      padding: 24px;
      font-size: 20px;
      font-weight: 700;
      line-height: 25px;
      .background {
        position: absolute;
        right: 16px;
        top: -15px;
        width: 116px;
        z-index: 0;
      }
    }
    .navigation_block {
      width: 100%;
      padding: 16px;
    }
    .navigation_header {
      font-size: 20px;
      line-height: 28px;
    }
    .navigation_footer {
      font-size: 18px;
      line-height: 22px;
    }
  }

  @media (max-width: 600px) {
    .content_block {
      padding: 0;
      border: none;
    }
  }
}
</style>

<template>
  <div v-if="showDay()" class="message_day">
    {{ $dayjs(previousDate).format(showYear() ? 'DD MMMM YYYY' : 'DD MMMM') }}
  </div>
  <div class="message_container" :class="{ isContractor }">
    <div class="message_wrap">
      <div v-if="isContractor" class="date">{{ $dayjs(message.created_at).format('HH:mm') }}</div>
      <div class="body">
        <div class="title">{{ getOperatorName }}</div>
        <div class="message">
          <div class="text ticket_text_global" v-html="getProcessedMessage(message.message)"></div>
          <AttachedFilesGalleryMini class="attached_gallery" :files="message.attachments" nonEditable />
        </div>
      </div>
      <div v-if="!isContractor" class="date">{{ $dayjs(message.created_at).format('HH:mm') }}</div>
    </div>
  </div>
</template>

<script>
import AttachedFilesGalleryMini from '@/components/molecules/AttachedFilesGalleryMini.vue'

export default {
  name: 'Message',
  components: { AttachedFilesGalleryMini },
  props: {
    message: {
      type: Object,
      default: () => {},
    },
    previousMessage: {
      type: Object,
      default: () => {},
    },
    participants: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      isContractor: false,
      previousDate: false,
    }
  },
  computed: {
    getOperatorName () {
      const operator = this.participants[this.message.user_id]
      const operatorName = operator?.fio === 'Ручка бот' ? operator?.fio : operator?.fio?.split(' ')[1]
      return operatorName || 'Служба поддержки'
    },
  },
  mounted () {
    this.isContractor = this.participants[this.message.user_id]?.type === 'contractor'
    this.previousDate = this.previousMessage?.created_at || this.message?.created_at
  },
  unmounted () {},
  watch: {},
  methods: {
    showDay () {
      return (
        !this.previousMessage ||
        this.$dayjs(this.previousMessage?.created_at).format('DD MM YYYY') !==
          this.$dayjs(this.message?.created_at).format('DD MM YYYY')
      )
    },
    showYear () {
      return !this.$dayjs(this.previousDate).isSame(this.$dayjs(), 'year')
    },
    formatUrl (url) {
      const urlPattern = /^(https?:\/\/)?(www\.)?([^\\/]+)(\/.*)?$/
      const match = url.match(urlPattern)
      return match[3]
    },
    getProcessedMessage (html) {
      if (typeof DOMParser === 'undefined') return html

      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      const textNodes = this.findTextNodes(doc.body)

      textNodes.forEach((node) => {
        if (node.parentNode.nodeName !== 'A') {
          const newHtml = node.data.replace(
            /(\b(https?|ftp):\/\/[^\s<]+[^\s<.)]|(\bwww\.[^\s<]+[^\s<.)]))/gi,
            (match) => {
              const url = match.startsWith('www.') ? `https://${match}` : match
              return `<a href="${url}" style="color: blue; text-decoration: underline;"
              target="_blank" rel="noopener noreferrer">${this.formatUrl(match)}</a>`
            },
          )

          if (newHtml !== node.data) {
            const wrapper = doc.createElement('span')
            wrapper.innerHTML = newHtml
            node.parentNode.replaceChild(wrapper, node)
          }
        }
      })

      return doc.body.innerHTML
    },
    findTextNodes (node) {
      const nodes = []
      const walker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) =>
            node.parentNode.nodeName !== 'SCRIPT' &&
            node.parentNode.nodeName !== 'STYLE' &&
            node.parentNode.nodeName !== 'A' &&
            node.data.trim() !== ''
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_REJECT,
        },
        false,
      )

      while (walker.nextNode()) nodes.push(walker.currentNode)
      return nodes
    },
  },
}
</script>

<style lang="scss" scoped>
.message_day {
  text-align: center;
  font-weight: 600;
  font-size: 14px;
}
.message_container {
  display: flex;

  .message_wrap {
    display: flex;
    gap: 8px;
    align-items: flex-end;
    max-width: 600px;
  }
  .message {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    border-radius: 12px 12px 12px 2px;
    padding: 12px 16px;
    background: #f3f3f3;
  }
  .title {
    font-weight: 600;
    color: #707070;
    margin-bottom: 4px;
  }
  .text {
    font-size: 16px;
  }
  .date {
    font-size: 12px;
    color: #bebebe;
  }
  &.isContractor {
    justify-content: flex-end;
    .message {
      border-radius: 12px 12px 2px 12px;
      background: #f3faff;
    }
    .title {
      display: none;
    }
  }
  .url_format {
    color: blue;
    text-decoration: underline;
  }
}
</style>

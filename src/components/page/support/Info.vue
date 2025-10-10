<template>
  <div class="info_block">
    <div class="mb_12">
      Создано {{ $dayjs(ticket.created_at).format('DD MMMM YYYY') }} в
      {{ $dayjs(ticket.created_at).format('HH:mm') }}
    </div>
    <div class="fs_18 fw_600 mb_8">{{ ticket.title }}</div>
    <div class="description mb_32">{{ messages[0]?.message }}</div>
    <template v-if="messages[0]?.attachments?.length">
      <div class="fs_18 fw_600 mb_24">Прикреплённые файлы</div>
      <AttachedFilesGallery class="attached_gallery" :files="messages[0]?.attachments" nonEditable />
    </template>
  </div>
</template>

<script>
import AttachedFilesGallery from '@/components/molecules/AttachedFilesGallery.vue'

export default {
  name: 'Info',
  components: { AttachedFilesGallery },
  props: {
    ticket: {
      type: Object,
      default: () => ({}),
    },
    messages: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      list: null,
    }
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    open () {},
  },
}
</script>

<style lang="scss" scoped>
.info_block {
  overflow-y: auto;
  .description {
    font-size: 14px;
    line-height: 22px;
    color: #666666;
  }
}
</style>

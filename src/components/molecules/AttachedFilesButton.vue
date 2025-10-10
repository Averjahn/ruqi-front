<template>
  <input ref="selectedFile" type="file" multiple style="display: none" @change="addSelectFile" />
  <div class="container">
    <Button :loading="loadingNewTicket" @click="onUploadClick" type="outlined" inline>
      Прикрепите файлы
      <img src="@/assets/icon_deprecated/attach.svg" />
    </Button>
    <div class="description">Прикрепите до 10 файлов в формате png, jpg/jpeg, pdf, docx размером не более 5Mb</div>
  </div>
</template>

<script>
export default {
  name: 'AttachedFilesButton',
  components: {},
  props: {
    options: {
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
    addSelectFile (event) {
      this.$emit('addFiles', event.target?.files)
    },
    onUploadClick () {
      this.$refs.selectedFile.value = ''
      this.$refs.selectedFile.click()
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  .description {
    flex: 1;
    min-width: 230px;
    font-size: 10px;
    line-height: 14px;
    color: #7a91a9;
  }
}
</style>

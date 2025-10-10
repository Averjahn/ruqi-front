<template>
  <div class="drag_area_container">
    <div class="drag_area" :class="{ disabled: loading }" @drop.prevent="addDragFile" @dragover.prevent>
      <input ref="selectedFile" type="file" style="display: none" @change="addSelectFile" />
      <img class="drag_img" src="@/assets/icon_deprecated/download_cloud.svg" alt="download cloud" />
      Перетащите файл в эту область
    </div>
    <div class="limitations_text">
      Размер загружаемых файлов не должен превышать <b>5 Mb.</b> Допустимы форматы <b>png, jpg или jpeg</b>
    </div>
    <Button @click="onUploadClick" :loading="loading" class="load_button">
      <img src="@/assets/icon_deprecated/file.svg" />
      загрузить Из файла
    </Button>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {}
  },
  methods: {
    addSelectFile (event) {
      if (!this.loading) this.$emit('addFile', event.target?.files?.[0])
    },
    addDragFile (event) {
      if (!this.loading) this.$emit('addFile', event.dataTransfer?.files?.[0])
    },
    onUploadClick () {
      if (this.loading) return
      this.$refs.selectedFile.value = ''
      this.$refs.selectedFile.click()
    },
  },
}
</script>

<style lang="scss">
.drag_area_container {
  .drag_area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: #f2f4f5;
    border: 1px dashed #dadada;
    border-radius: 8px;
    padding: 15px;
    height: 125px;
    font-size: 14px;
    line-height: 125%;
    box-sizing: border-box;
    user-select: none;
    margin-bottom: 8px;
    &.disabled {
      opacity: 0.4;
    }
  }
  .drag_img {
    display: block;
    margin-bottom: 8px;
  }
  .limitations_text {
    font-size: 12px;
    line-height: 16px;
    margin-bottom: 8px;
  }
  .load_button .slot {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}
</style>

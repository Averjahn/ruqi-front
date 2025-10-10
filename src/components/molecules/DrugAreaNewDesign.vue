<template>
  <div class="drag_area_container_new_design">
    <div
      class="drag_area"
      :class="{ disabled: loading, isDragging }"
      @drop.prevent="addDragFile"
      @dragover.prevent
      @dragenter.prevent="onDragEnter"
      @dragleave.prevent="onDragLeave"
    >
      <input ref="selectedFile" type="file" style="display: none" multiple @change="addSelectFile" />
      <div class="title">Перетащите файлы сюда или</div>
      <ButtonText @click="onUploadClick" :loading="loading" type="s" class="load_button">
        <Icon name="attach" /> Загрузите документы
      </ButtonText>
      <div class="limitations_text">
        <slot />
      </div>
    </div>
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
    limitText: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      isDragging: false,
      dragCounter: 0,
    }
  },
  methods: {
    onDragEnter () {
      this.dragCounter++
      if (this.dragCounter === 1) {
        this.isDragging = true
      }
    },

    onDragLeave () {
      this.dragCounter--
      if (this.dragCounter === 0) {
        this.isDragging = false
      }
    },
    addSelectFile (event) {
      if (!this.loading) this.$emit('addFiles', event.target?.files)
    },
    addDragFile (event) {
      this.isDragging = false
      this.dragCounter = 0
      if (!this.loading) this.$emit('addFiles', event.dataTransfer?.files)
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
.drag_area_container_new_design {
  .drag_area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    border: 1px dashed #bebebe;
    border-radius: 12px;
    padding: 24px;
    box-sizing: border-box;
    user-select: none;
    transition: all 200ms ease-in-out;
    &.disabled {
      opacity: 0.4;
    }
    &.isDragging {
      border: 1px dashed #b7eb8f;
      background-color: #f6ffed;
    }
  }
  .title {
    line-height: 32px;
    margin-bottom: 8px;
    color: #03123a;
  }
  .drag_img {
    display: block;
    margin-bottom: 8px;
  }
  .limitations_text {
    max-width: 324px;
    font-size: 12px;
    line-height: 16px;
    color: #666666;
  }
  .load_button {
    font-size: 20px;
    margin-bottom: 4px;
  }
}
</style>

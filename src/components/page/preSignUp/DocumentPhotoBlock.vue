<template>
  <div class="document_photo_block" :class="{ isMobileDesign }">
    <input ref="selectedFile" type="file" style="display: none" @change="addSelectFile" />
    <div class="photo_block">
      <img :src="photo" />
    </div>
    <div class="document_photo_info_block">
      <div v-if="status" class="status">
        <img :src="require('@/assets/icon_deprecated/' + icon)" />
        {{ displayedStatus }}
      </div>
      <div class="limitations_text">
        Размер загружаемых файлов не должен превышать <b>5 Mb.</b> Допустимы форматы <b>png, jpg или jpeg</b>
      </div>
      <div class="actions">
        <Button class="document_photo_button" :loading="loading" type="outlined" @click="onUploadClick">
          <img src="@/assets/icon_deprecated/refresh.svg" />
          заменить файл
        </Button>
        <Button class="document_photo_button" :loading="loading" type="outlined" @click="$emit('delete')">
          <img src="@/assets/icon_deprecated/recycle.svg" />
          Удалить файл
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    photo: {
      type: String,
      default: '',
    },
    isMobileDesign: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: '',
    },
  },
  data () {
    return {}
  },
  computed: {
    displayedStatus () {
      if (this.status === 'confirmed') return 'Документ подтвержден'
      if (this.status === 'declined') return 'Документ отклонён'
      if (this.status === 'on_check') return 'Документ на проверке'
      if (this.status === 'need_approve') return 'Документ на проверке'
      if (this.status === 'need_upload') return 'Документ не загружен'
      return 'Статус не определён'
    },
    icon () {
      if (this.status === 'confirmed') return 'check_mark_circle.svg'
      if (this.status === 'declined') return 'cross_circle_red.svg'
      if (this.status === 'on_check') return 'hourglass_yellow.svg'
      if (this.status === 'need_approve') return 'hourglass_yellow.svg'
      if (this.status === 'need_upload') return 'circle-block.svg'
      return 'circle_warning.svg'
    },
  },
  methods: {
    addSelectFile (event) {
      if (!this.loading) this.$emit('addFile', event.target?.files?.[0])
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
.document_photo_block {
  display: flex;
  gap: 16px;
  flex: 1;
  .photo_block {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    height: 222px;
    width: 160px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .document_photo_info_block {
    height: 222px;
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 16px;
    padding: 0;
    justify-content: space-between;
  }
  .status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
  }
  .actions {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }
  .document_photo_button {
    width: 100%;
    white-space: nowrap;
    .slot {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
  &.isMobileDesign {
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    .document_photo_info_block {
      width: 100%;
    }
    .status {
      justify-content: center;
    }
    .actions {
      gap: 8px;
    }

    .document_photo_button {
      flex: 1;
      font-size: 13px;
      padding: 12px 12px;
    }
  }
  .limitations_text {
    font-size: 12px;
    line-height: 16px;
  }
}
</style>

<template>
  <div ref="container" class="photo_block_container" :class="{ show_sample, isMobileDesign }">
    <div v-if="samplePhoto" class="sample_button_wrap">
      <div class="sample_button mb_8" @click="toggleSample">
        <img class="open_eye" src="@/assets/icon_deprecated/eye_blue.svg" />
        <img class="eye_off" src="@/assets/icon_deprecated/eye_off_blue.svg" />
        Образец фото
      </div>
    </div>

    <div class="photo_block_content">
      <div class="main_photo_block">
        <DocumentPhotoBlock
          v-if="showPhotoBlock"
          :photo="photo"
          :loading="loading"
          :status="status"
          :isMobileDesign="isMobileDesign"
          @addFile="addFile"
          @delete="deletePhoto"
        />
        <DragArea v-else :loading="loading" @addFile="addFile" />
      </div>
      <div v-if="samplePhoto" class="sample_photo">
        <img :src="samplePhoto" />
      </div>
    </div>
  </div>
</template>

<script>
import DragArea from '@/components/page/preSignUp/DragArea.vue'
import DocumentPhotoBlock from '@/components/page/preSignUp/DocumentPhotoBlock.vue'
import { mapActions } from 'vuex'

export default {
  name: 'UploadPhoto',
  components: { DragArea, DocumentPhotoBlock },
  props: {
    photo: {
      type: String,
      default: '',
    },
    samplePhoto: {
      type: String,
      default: '',
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
    return {
      show_sample: true,
      isChangePhotoMode: false,
      isMobileDesign: true,
    }
  },
  computed: {
    showPhotoBlock () {
      return !!this.photo && !this.isChangePhotoMode
    },
  },
  mounted () {
    this.defineView()
    window.addEventListener('resize', this.defineView)
  },
  unmounted () {
    window.removeEventListener('resize', this.defineView)
  },
  watch: {},
  methods: {
    ...mapActions('notifications', ['showNotification']),

    defineView () {
      const width = this.$refs.container.offsetWidth
      this.isMobileDesign = width < 600
    },
    toggleSample () {
      this.show_sample = !this.show_sample
    },
    checkFile (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.showNotification({ text: 'Размера файла не должен превышать 5Mb' })
        return false
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        this.showNotification({ text: 'Файл должен иметь формат png, jpg или jpeg' })
        return false
      }
      return true
    },
    addFile (file) {
      if (!this.checkFile(file)) return
      this.$emit('addFile', file)
    },
    changePhoto () {
      this.isChangePhotoMode = true
    },
    deletePhoto () {
      this.$emit('deletePhoto')
    },
  },
}
</script>

<style lang="scss" scoped>
.photo_block_container {
  .sample_button_wrap {
    text-align: right;
    padding: 0 22px;
  }

  .sample_button {
    display: inline-flex;
    color: #0082de;
    font-size: 14px;
    font-weight: 600;
    align-items: center;
    cursor: pointer;
    gap: 8px;
    user-select: none;
  }

  .open_eye {
    display: none;
  }

  .eye_off {
    display: block;
  }

  .sample_photo {
    width: 0px;
    height: 222px;
    opacity: 0;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    border-radius: 6px;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .photo_block_content {
    display: flex;
    gap: 0;
    transition: all ease-in-out 300ms;
  }
  .main_photo_block {
    flex: 1;
    width: 100%;
  }

  &.show_sample {
    .sample_photo {
      opacity: 1;
      width: 160px;
      height: 222px;
    }

    .photo_block_content {
      gap: 32px;
    }

    .open_eye {
      display: block;
    }

    .eye_off {
      display: none;
    }
  }

  &.isMobileDesign {
    .sample_button_wrap {
      text-align: center;
    }
    .photo_block_content {
      align-items: center;
      flex-direction: column-reverse;
    }
    .sample_photo {
      width: 160px;
      height: 0;
    }
    &.show_sample {
      .sample_photo {
        width: 160px;
        height: 222px;
      }
    }
  }
}
</style>

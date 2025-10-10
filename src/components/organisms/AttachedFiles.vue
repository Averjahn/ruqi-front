<template>
  <div
    class="attached_files"
    :class="{
      silent_validation_error: !silentIsValid,
    }"
  >
    <DrugAreaNewDesign @addFiles="addFiles">
      Прикрепите до 10 файлов в формате png, jpg/jpeg, pdf, docx размером не более 5Mb
    </DrugAreaNewDesign>
    <HorizontalScroll
      v-if="files.length"
      autoScrollToRight
      class="horizontal_scroll"
      :class="{
        shake,
      }"
    >
      <AttachedFilesGallery class="attached_gallery" :files="files" @deleteFile="deleteFile" />
    </HorizontalScroll>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import DrugAreaNewDesign from '@/components/molecules/DrugAreaNewDesign.vue'
import AttachedFilesGallery from '@/components/molecules/AttachedFilesGallery.vue'
import { readImageFile } from '@/constants/helpers'
import HorizontalScroll from '../atoms/HorizontalScroll.vue'

export default {
  name: 'AttachedFiles',
  inject: {
    checkValid: {
      default: false,
    },
  },
  components: { DrugAreaNewDesign, AttachedFilesGallery, HorizontalScroll },
  props: {
    disableValidation: {
      type: Boolean,
      default: false,
    },
    files: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      silentIsValid: false,
      isValid: true,
      shake: false,
    }
  },
  computed: {},
  watch: {
    files: {
      handler () {
        this.silentValidate()
        this.isValid = true
      },
      deep: true,
    },
    checkValid (val) {
      if (val) this.validate()
    },
  },
  mounted () {
    this.silentValidate()
  },
  methods: {
    ...mapActions('notifications', ['showNotification']),

    checkNumberOfFiles (files) {
      if (files.length + this.files.length > 10) {
        this.showNotification({
          text: 'Нельзя загружать больше 10 файлов',
        })
        return false
      }
      return true
    },

    async addFiles (files) {
      if (!this.checkNumberOfFiles(files)) return
      const allowedExtensions = /\.(png|jpe?g|pdf|docx)$/i
      for (const file of files) {
        if (!allowedExtensions.test(file.name)) {
          file.error = 'Файл должен иметь формат png, jpg, jpeg, pdf или docx'
        }
        if (file.size > 5 * 1024 * 1024) {
          file.error = 'Размера файла не должен превышать 5Mb'
        }
        if (file.type.startsWith('image/')) {
          file.imageDataUrl = await readImageFile(file)
        }
      }
      this.$emit('update:files', [...this.files, ...files])
    },

    async deleteFile (index) {
      this.$emit('deleteFile', index)
    },

    shakeIt () {
      this.shake = true
      setTimeout(() => {
        this.shake = false
      }, 260)
    },

    resetError () {
      this.isValid = true
    },

    validate () {
      if (!this.disableValidation) {
        for (let i = 0; i < this.files.length; i++) {
          if (!!this.files[i].error) {
            this.isValid = false
            this.shakeIt()
            return
          }
        }
        this.resetError()
      }
    },

    silentValidate () {
      this.$nextTick(() => {
        if (!this.disableValidation) {
          for (let i = 0; i < this.files.length; i++) {
            if (!!this.files[i].error) {
              this.silentIsValid = false
              return
            }
          }
          this.silentIsValid = true
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.attached_files {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.attached_gallery {
  flex-wrap: nowrap;
}
.horizontal_scroll {
  &.shake {
    animation: vertical-shaking 2s 1 ease-out;
  }
}
</style>

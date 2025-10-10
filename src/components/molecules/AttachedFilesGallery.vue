<template>
  <div>
    <Popup v-model:show="isPhotoOpen">
      <PhotoPopup :openedFile="openedFile" @close="close" />
    </Popup>
    <div class="attached_files">
      <div
        v-for="(file, index) in files"
        class="attached_item"
        :class="{ is_img: isImg(file), error: !!file.error, nonEditable }"
        :key="index"
      >
        <div class="img_block">
          <div class="img_wrap" @click="open(file)">
            <img v-if="isImg(file)" class="img" :src="file.imageDataUrl || file.file_path" draggable="false" />
            <Icon v-else class="file_type_icon" :name="getIconName(file)" :size="32" />
            <div v-if="!isImg(file) || !!file.error" class="file_info">
              <div class="file_name">{{ truncateFileName(file.name || file.file_name || '', 11) }}</div>
              <div class="file_size">{{ getSize(file) }}</div>
            </div>
          </div>
          <div class="delete" @click="$emit('deleteFile', index)">
            <img src="@/assets/icon_deprecated/cross_s.svg" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { truncateFileName, formatFileSize, downloadFile } from '@/constants/helpers'
import PhotoPopup from '@/components/organisms/popups/PhotoPopup.vue'

const FILE_ICONS = {
  pdf: 'filePdf',
  doc: 'fileDoc',
  docx: 'fileDoc',
  xls: 'fileXls',
  xlsx: 'fileXls',
}

export default {
  name: 'AttachedFilesGallery',
  components: { PhotoPopup },
  emits: ['deleteFile'],
  props: {
    files: {
      type: Array,
      default: () => [],
    },
    nonEditable: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      isPhotoOpen: false,
      openedFile: {},
    }
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    truncateFileName,

    isImg (file) {
      return file.type?.startsWith('image/')
    },
    getSize (file) {
      return formatFileSize(file?.size || 0, 1)
    },
    getIconName (file) {
      var extensionIndex = file?.name?.lastIndexOf('.')
      var extension = file?.name?.substring(extensionIndex + 1)?.substring(0, 6)
      return FILE_ICONS[extension] || 'file'
    },
    open (file) {
      if (this.isImg(file)) {
        this.openedFile = file
        this.isPhotoOpen = true
      } else {
        this.download(file)
      }
    },
    download (file) {
      if (file.file_path) downloadFile(file.file_path, file.file_name, file.type)
    },
    close () {
      this.openedFile = {}
      this.isPhotoOpen = false
    },
  },
}
</script>

<style lang="scss" scoped>
.attached_files {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  .attached_item {
    display: flex;
    align-items: center;
    gap: 16px;
    .file_type_icon {
      position: absolute;
      top: 12px;
      left: 12px;
    }
    .file_info {
      position: absolute;
      bottom: 9px;
      left: 12px;
      width: 100%;
      font-size: 14px;
      line-height: 16px;
    }
    &.is_img {
      .img_block {
        cursor: pointer;
      }
    }
    &.error {
      color: #eb4d3d;
      .file_size {
        color: #eb4d3d;
      }
      .img_wrap {
        border: 1px solid #eb4d3d;
        background-color: #ffe9e9;
        img {
          opacity: 0.2;
        }
      }
      .delete {
        display: flex;
      }
    }
    &.nonEditable .delete {
      display: none !important;
    }
  }

  .img_block {
    position: relative;
    user-select: none;
    &:hover {
      .delete {
        display: flex;
      }
    }
  }
  .delete {
    display: none;
    position: absolute;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    top: 12px;
    right: 12px;
    background: #ffffff;
    border-radius: 50%;
    cursor: pointer;
    user-select: none;
    img {
      width: 15px;
      height: 15px;
    }
  }

  .img_wrap {
    width: 118px;
    height: 116px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    overflow: hidden;
    background-color: #f3f3f3;
    .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .file_name {
    font-size: 14px;
  }
  .file_size {
    font-style: 12px;
    color: #1b1b1b;
  }
  @media (max-width: 1024px) {
    .delete {
      display: flex;
    }
  }
}
</style>

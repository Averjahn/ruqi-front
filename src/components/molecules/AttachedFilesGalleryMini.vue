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
            <img v-if="isImg(file)" class="img" :src="file.imageDataUrl || file.file_path" />
            <img v-else src="@/assets/icon_deprecated/file_grey.svg" />
          </div>
          <div class="delete" @click="$emit('deleteFile', index)">
            <img src="@/assets/icon_deprecated/cross_s.svg" />
          </div>
        </div>
        <div class="file_info">
          <div class="file_name">{{ truncateFileName(file.name || file.file_name || '', 10) }}</div>
          <div class="file_size">{{ getSize(file) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { truncateFileName, formatFileSize, downloadFile } from '@/constants/helpers'
import PhotoPopup from '@/components/organisms/popups/PhotoPopup.vue'

export default {
  name: 'AttachedFilesGalleryMini',
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
    open (file) {
      if (this.isImg(file)) {
        this.openedFile = file
        this.isPhotoOpen = true
      } else {
        if (file.file_path) downloadFile(file.file_path, file.file_name, file.type)
      }
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
    &.is_img {
      .file_info {
        display: none;
      }
      .img_block {
        cursor: pointer;
      }
    }
    &.error {
      .img_wrap {
        border: 1px solid #eb4d3d;
        background-color: #ffe6e6;
        img {
          opacity: 0.5;
        }
      }
      .file_info {
        display: block;
        color: #eb4d3d;
      }
      .file_size {
        color: #eb4d3d;
      }
      .img_block {
        .delete {
          display: flex;
        }
      }
    }
    &.nonEditable {
      .delete {
        display: none !important;
      }
    }
  }

  .img_block {
    position: relative;
    user-select: none;
    transition: transform 100ms ease-in-out;
    &:hover {
      transform: scale(1.04);
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
    top: -6px;
    right: -6px;
    background: #ebebeb;
    border-radius: 50%;
    cursor: pointer;
    user-select: none;
    img {
      width: 15px;
      height: 15px;
    }
  }

  .img_wrap {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
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
    font-weight: 600;
  }
  .file_size {
    font-style: 12px;
    color: #7a91a9;
  }
  @media (max-width: 1024px) {
    .delete {
      display: flex;
    }
  }
}
</style>

<template>
  <PopupContainer
    class="modal_popup"
    :title="openedFile.name || openedFile.file_name || 'Фото'"
    maxWidth="960px"
    @close="$emit('close')"
  >
    <template v-slot:header>
      <div class="popupHeader">
        <div class="title">{{ openedFile.name || openedFile.file_name || 'Фото' }}</div>
        <div class="actions">
          <ButtonIconGhost v-if="openedFile.file_name" @click="download(openedFile)">
            <img src="@/assets/icon_deprecated/download.svg" />
          </ButtonIconGhost>
          <ButtonIconGhost @click="$emit('close')">
            <img src="@/assets/icon_deprecated/cross.svg" />
          </ButtonIconGhost>
        </div>
      </div>
    </template>
    <div class="popup_photo_wrap">
      <img :src="openedFile.imageDataUrl || openedFile.file_path" />
    </div>
  </PopupContainer>
</template>

<script>
import { downloadFile } from '@/constants/helpers'
import PopupContainer from '@/components/atoms/PopupContainer.vue'

export default {
  name: 'PhotoPopup',
  components: { PopupContainer },
  emits: ['close'],
  props: {
    openedFile: {
      type: Object,
      default: () => ({}),
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
    download (file) {
      if (file.file_path) downloadFile(file.file_path, file.file_name, file.type)
    },
  },
}
</script>

<style lang="scss" scoped>
.popup_photo_wrap {
  max-width: 90%;
  max-height: 90%;
  margin: 0 auto;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }
}

.popupHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.title {
  font-size: 20px;
  font-weight: 700;
  word-break: break-all;
}
.actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>

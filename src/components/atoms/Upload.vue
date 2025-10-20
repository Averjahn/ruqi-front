<template>
  <div class="upload">
    <label v-if="label" class="upload__label">{{ label }}</label>

    <div
      class="upload__dropzone"
      :class="{ 'upload__dropzone--dragover': isDragOver, 'upload__dropzone--error': errorMessage, 'upload__dropzone--borderless': borderless }"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @click="openDialog"
    >
      <input
        ref="fileInput"
        class="upload__input"
        type="file"
        :multiple="multiple"
        :accept="accept"
        @change="onFileChange"
      />
      <div class="upload__content">
        <div class="upload__big-icon" aria-hidden="true">
          <img src="@/assets/icons/upload_file.svg" alt="Upload" width="40" height="40" />
        </div>
        <div class="upload__texts">
          <div class="upload__title">Перетащите файлы сюда или</div>
          <button class="upload__link" type="button" @click.stop="openDialog">
            <svg class="upload__link-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 10.833l4.167-4.166a2.5 2.5 0 113.536 3.535l-5.303 5.304A3.75 3.75 0 116.03 8.03L9.243 4.818" stroke="#1735f5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            загрузите документы
          </button>
          <div v-if="maxSizeMB" class="upload__hint">Максимальный размер файла {{ maxSizeMB }} МБ</div>
        </div>
      </div>
    </div>

    <ul v-if="filesInternal.length" class="upload__list">
      <li v-for="(f, idx) in filesInternal" :key="f.id" class="upload__item">
        <div class="upload__file">
          <div class="upload__file-name">{{ f.file.name }}</div>
          <div class="upload__file-size">{{ formatSize(f.file.size) }}</div>
        </div>
        <button class="upload__remove" type="button" @click="remove(idx)">Удалить</button>
      </li>
    </ul>

    <p v-if="errorMessage" class="upload__error">{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  name: 'Upload',
  props: {
    modelValue: { type: Array, default: () => [] }, // массив File
    label: { type: String, default: '' },
    multiple: { type: Boolean, default: true },
    accept: { type: String, default: '' },
    maxSizeMB: { type: Number, default: 50 },
    hint: { type: String, default: '' },
    borderless: { type: Boolean, default: true }
  },
  emits: ['update:modelValue', 'change'],
  data() {
    return {
      isDragOver: false,
      filesInternal: [], // [{ id, file }]
      errorMessage: ''
    }
  },
  mounted() {
    // инициализация из modelValue (если передали)
    if (Array.isArray(this.modelValue) && this.modelValue.length) {
      this.filesInternal = this.modelValue.map((file, i) => ({ id: `${Date.now()}-${i}`, file }))
    }
  },
  watch: {
    modelValue(newVal) {
      if (Array.isArray(newVal)) {
        this.filesInternal = newVal.map((file, i) => ({ id: `${Date.now()}-${i}`, file }))
      }
    }
  },
  methods: {
    openDialog() {
      this.$refs.fileInput && this.$refs.fileInput.click()
    },
    onDragOver() {
      if (this.errorMessage) this.errorMessage = ''
      this.isDragOver = true
    },
    onDragLeave() {
      this.isDragOver = false
    },
    onDrop(e) {
      this.isDragOver = false
      const dropped = Array.from(e.dataTransfer.files || [])
      this.handleFiles(dropped)
    },
    onFileChange(e) {
      const picked = Array.from(e.target.files || [])
      // сброс input, чтобы можно было выбрать тот же файл повторно
      e.target.value = ''
      this.handleFiles(picked)
    },
    handleFiles(files) {
      if (!files.length) return
      const maxBytes = this.maxSizeMB * 1024 * 1024
      const filtered = files.filter(f => (this.maxSizeMB ? f.size <= maxBytes : true))

      if (filtered.length !== files.length) {
        this.errorMessage = `Некоторые файлы превышают ${this.maxSizeMB} МБ и были пропущены`
      } else {
        this.errorMessage = ''
      }

      const next = this.multiple ? [...this.filesInternal, ...filtered.map((f) => ({ id: `${Date.now()}-${f.name}`, file: f }))] : filtered.slice(0, 1).map((f) => ({ id: `${Date.now()}-${f.name}`, file: f }))
      this.filesInternal = next
      this.emitFiles()
    },
    remove(index) {
      this.filesInternal.splice(index, 1)
      this.emitFiles()
    },
    emitFiles() {
      const files = this.filesInternal.map(i => i.file)
      this.$emit('update:modelValue', files)
      this.$emit('change', files)
    },
    formatSize(bytes) {
      if (bytes < 1024) return `${bytes} Б`
      const kb = bytes / 1024
      if (kb < 1024) return `${kb.toFixed(1)} КБ`
      const mb = kb / 1024
      return `${mb.toFixed(2)} МБ`
    }
  }
}
</script>

<style lang="scss" scoped>
.upload {
  width: 736px; // Figma MCP
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__label {
    font-size: 14px;
    line-height: 22px;
    color: #333;
  }

  &__dropzone {
    border: 1.5px dashed #bebebe; // Figma MCP
    background: #fff;
    border-radius: 12px;
    min-height: 241px; // Figma MCP
    padding: 40px 0; // Figma MCP vertical space
    transition: border-color .2s ease, background .2s ease;
    text-align: center;

    &--dragover {
      border-color: #1735f5;
      background: #f2f8ff;
    }

    &--error {
      border-color: #eb4d3d;
      background: #fff5f5;
    }

    &--borderless { border-color: transparent; }
  }

  &__input { display: none; }

  &__content { display: flex; flex-direction: column; align-items: center; gap: 24px; }

  &__big-icon { width: 40px; height: 40px; }

  &__texts { display: flex; flex-direction: column; gap: 4px; }

  &__title { font-size: 16px; line-height: 32px; color: #263043; }

  &__link {
    display: inline-flex; align-items: center; gap: 10px;
    background: transparent; border: 0; color: #1735f5; cursor: pointer;
    font-size: 18px; line-height: 26px; padding: 0;
  }
  &__link-icon { flex-shrink: 0; }

  &__hint { font-size: 12px; color: #888; }

  &__list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }

  &__item {
    display: flex; justify-content: space-between; align-items: center;
    background: #fafafa; border: 1px solid #eee; border-radius: 8px; padding: 8px 10px;
  }

  &__file { display: flex; flex-direction: column; }
  &__file-name { font-size: 14px; color: #263043; }
  &__file-size { font-size: 12px; color: #666; }

  &__remove {
    background: transparent; border: 0; color: #eb4d3d; cursor: pointer; font-size: 14px;
    &:hover { text-decoration: underline; }
  }

  &__error { color: #eb4d3d; font-size: 12px; }
}
</style>

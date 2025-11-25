<template>
  <div class="vacancy-description-editor">
    <label class="vacancy-description-editor__label">Общедоступное описание заявки</label>
    <div class="vacancy-description-editor__wrapper">
      <ckeditor
        :editor="editor"
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :config="editorConfig"
      />
    </div>
  </div>
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default {
  name: 'VacancyDescriptionEditor',
  components: {
    ckeditor: CKEditor.component
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      editor: ClassicEditor,
      editorConfig: {
        toolbar: [
          'undo',
          'redo',
          '|',
          'heading',
          '|',
          'bold',
          'italic',
          'underline',
          '|',
          'link',
          'blockQuote',
          'bulletedList',
          'numberedList',
          '|',
          'image'
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.vacancy-description-editor {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.vacancy-description-editor__label {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 14px;
  line-height: 22px;
  color: #666666;
  letter-spacing: 0.1px;
  display: block;
}

.vacancy-description-editor__wrapper {
  border: 1px solid #e3e5e4;
  border-radius: 8px;
  min-height: 300px;

  :deep(.ck-editor__editable) {
    min-height: 300px;
  }
}
</style>


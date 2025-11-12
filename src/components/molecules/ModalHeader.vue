<template>
  <div class="modal-header">
    <h2 class="modal-header__title">{{ title }}</h2>
    <button 
      class="modal-header__close-button"
      @click="$emit('close')"
    >
      <img 
        src="@/assets/icons/cross_black.svg" 
        alt="Close" 
        class="modal-header__close-icon"
      />
    </button>
  </div>
</template>

<script>
export default {
  name: 'ModalHeader',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  emits: ['close']
}
</script>

<style lang="scss" scoped>
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.modal-header__title {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 25px;
  color: #263043;
  margin: 0;
  flex: 1;
}

.modal-header__close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}

.modal-header__close-icon {
  width: 15.5px;
  height: 15.5px;
  object-fit: contain;
}
</style>


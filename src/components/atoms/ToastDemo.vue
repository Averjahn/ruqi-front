<template>
  <div class="toast-demo">
    <h4>Toast Notifications Demo</h4>
    <div class="toast-demo__grid">
      <!-- Row 1: Info -->
      <div class="toast-demo__row">
        <div class="toast-demo__item">
          <h5>Info with Buttons</h5>
          <Toast 
            type="info" 
            :isVisible="true" 
            :showButtons="true"
            @close="handleClose"
          />
        </div>
        <div class="toast-demo__item">
          <h5>Info Simple</h5>
          <Toast 
            type="info" 
            :isVisible="true" 
            :showButtons="false"
            @close="handleClose"
          />
        </div>
      </div>

      <!-- Row 2: Error -->
      <div class="toast-demo__row">
        <div class="toast-demo__item">
          <h5>Error with Buttons</h5>
          <Toast 
            type="error" 
            :isVisible="true" 
            :showButtons="true"
            @close="handleClose"
          />
        </div>
        <div class="toast-demo__item">
          <h5>Error Simple</h5>
          <Toast 
            type="error" 
            :isVisible="true" 
            :showButtons="false"
            @close="handleClose"
          />
        </div>
      </div>

      <!-- Row 3: Success -->
      <div class="toast-demo__row">
        <div class="toast-demo__item">
          <h5>Success with Buttons</h5>
          <Toast 
            type="success" 
            :isVisible="true" 
            :showButtons="true"
            @close="handleClose"
          />
        </div>
        <div class="toast-demo__item">
          <h5>Success Simple</h5>
          <Toast 
            type="success" 
            :isVisible="true" 
            :showButtons="false"
            @close="handleClose"
          />
        </div>
      </div>

      <!-- Row 4: Warning -->
      <div class="toast-demo__row">
        <div class="toast-demo__item">
          <h5>Warning with Buttons</h5>
          <Toast 
            type="warning" 
            :isVisible="true" 
            :showButtons="true"
            @close="handleClose"
          />
        </div>
        <div class="toast-demo__item">
          <h5>Warning Simple</h5>
          <Toast 
            type="warning" 
            :isVisible="true" 
            :showButtons="false"
            @close="handleClose"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from '@/components/atoms/Toast.vue'

export default {
  name: 'ToastDemo',
  components: { Toast },
  methods: {
    handleClose() {
      // console.log('Toast closed')
    }
  }
}
</script>

<style lang="scss" scoped>
.toast-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fafafa;

  h4 {
    margin: 0 0 16px 0;
    font-size: 1.2em;
    color: #263043;
  }

  &__grid {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  &__item {
    display: flex;
    flex-direction: column;
    gap: 12px;

    h5 {
      margin: 0;
      font-size: 14px;
      font-weight: 500;
      color: #666;
    }
  }
}
</style>

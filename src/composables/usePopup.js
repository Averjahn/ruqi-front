import { createRqApp } from '@/main.js'
import Popup from '@/components/atoms/Popup.vue'
import { h } from 'vue'

export default function usePopup () {
  const initPopup = (component, props = {}) => {
    const New = {
      name: 'CombinedComponent',
      emits: ['close'],
      render () {
        return h(
          Popup,
          {
            show: true,
            'onUpdate:show': () => closePopup(),
          },
          {
            default: () =>
              h(component, {
                ...props,
                onClose: () => closePopup(),
              }),
          },
        )
      },
    }

    const app = createRqApp(New)
    app.mount('#globalPopupContainer')

    const closePopup = () => {
      app.unmount()
    }

    return app
  }

  return {
    initPopup,
  }
}

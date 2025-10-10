<template>
  <transition name="fade">
    <div v-if="showConsent" class="cookie_consent">
      <div class="cookie_content">
        <div class="cookie_text">
          <span>
            Продолжая использовать этот сайт и нажимая кнопку «Принимаю», вы даете
            <a href="https://lk.ruqi.ru/privacy-policy" target="_blank" rel="noopener noreferrer"
              >согласие на обработку файлов cookie</a
            >
          </span>
        </div>
        <Button @click="accept" class="ok_button">OK</Button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'CookieConsent',
  data () {
    return {
      showConsent: false,
    }
  },
  mounted () {
    this.showConsent = !this.getCookie('cookieConsentAccepted')
  },
  methods: {
    accept () {
      this.setCookie('cookieConsentAccepted', true, 365)
      this.showConsent = false
    },
    setCookie (name, value, days) {
      let expires = ''
      if (days) {
        const date = new Date()
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
        expires = '; expires=' + date.toUTCString()
      }
      document.cookie = name + '=' + (value || '') + expires + '; path=/'
    },
    getCookie (name) {
      const nameEQ = name + '='
      const ca = document.cookie.split(';')
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) == ' ') c = c.substring(1, c.length)
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
      }
      return null
    },
  },
}
</script>

<style lang="scss" scoped>
.cookie_consent {
  z-index: 230;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  border-radius: 14px;
  margin: 48px;
  border: 1px solid #DADADA;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 560px;
  max-width: calc(100% - 40px);
  padding: 32px;
  display: flex;
  align-items: center;
  justify-self: flex-end;
  justify-content: center;
}
.cookie_content {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  gap: 32px;
}
.cookie_content {
}
.cookie_content a {
  color: #1164f6;
  text-decoration: underline;
}
.ok_button {
  width: 100%;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
@media (max-width: 1000px) {
  .cookie_consent {
    margin: 24px 0;
    padding: 32px 24px;
    justify-self: center;
  }
}
</style>

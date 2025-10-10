import { getAPIError } from '@/constants/helpers'
import axios from '@/plugins/axios'

let profileResponse = null
let certificatesResponse = null
let activeCertResp = null
let agreementsResponse = null

export const profilePage = {
  namespaced: true,
  state: {
    profile: {},
    activeCertificate: {},
    certificates: [],
    agreements: [],
    isProfileLoad: false,
    isProfileLoading: false,
    isActiveCertLoad: false,
    isCertificatesLoad: false,
    isCertificatesLoading: false,
    isAgreementsLoading: false,
    isAgreementsLoad: false,
  },
  getters: {
    profile (state) {
      return state.profile
    },
    activeCertificate (state) {
      return state.activeCertificate
    },
    agreements (state) {
      return state.agreements
    },
    certificates (state) {
      return state.certificates
    },
    isProfileLoading (state) {
      return state.isProfileLoading
    },
    isCertificatesLoading (state) {
      return state.isProfileLoading
    },
    isAgreementsLoading (state) {
      return state.isAgreementsLoading
    },
  },

  actions: {
    showError ({ dispatch }, text) {
      dispatch('notifications/showNotification', { type: 'error', text }, { root: true })
    },

    async fetchProfileOnce ({ state, dispatch }) {
      if (!state?.isProfileLoad && !state?.isProfileLoading) {
        await dispatch('fetchProfile')
      } else {
        await profileResponse
      }
    },

    async fetchProfile ({ commit, dispatch }) {
      if (!this.getters['auth/isLogged']) return
      commit('setProfileLoading', true)
      profileResponse = await axios.get('v2/user/profile')
      if (profileResponse?.data?.success) {
        commit('setProfile', profileResponse.data.data)
      } else {
        dispatch('showError', getAPIError(profileResponse) || 'Ошибка при загрузке данных профайла')
      }
      commit('setProfileLoading', false)
    },

    async fetchActiveCertificateOnce ({ state, dispatch }) {
      if (!state?.isActiveCertLoad && !state?.isCertificatesLoading) {
        await dispatch('fetchActiveCertificate')
      } else {
        await activeCertResp
      }
    },

    async fetchActiveCertificate ({ commit, dispatch }) {
      if (!this.getters['auth/isLogged']) return
      try {
        commit('setCertificatesLoading', true)
        activeCertResp = await axios.get('v3/my/eds/certificate')
        if (activeCertResp?.data?.success) {
          commit('setActiveCertificate', activeCertResp.data?.data || {})
        } else {
          dispatch('showError', getAPIError(activeCertResp) || 'Ошибка при загрузке данных ЭЦП')
        }
      } catch (error) {
        dispatch('showError', getAPIError(activeCertResp) || 'Непредвиденная ошибка при загрузке данных ЭЦП')
      } finally {
        commit('setCertificatesLoading', false)
      }
      return activeCertResp
    },

    async fetchArchiveCertificatesOnce ({ state, dispatch }) {
      if (!state?.isCertificatesLoad && !state?.isCertificatesLoading) {
        await dispatch('fetchArchiveCertificates')
      } else {
        await certificatesResponse
      }
    },

    async fetchArchiveCertificates ({ commit, dispatch }) {
      if (!this.getters['auth/isLogged']) return
      try {
        commit('setCertificatesLoading', true)
        certificatesResponse = await axios.get('v3/my/eds/certificates/archive')
        if (certificatesResponse?.data?.success) {
          commit('setCertificates', certificatesResponse?.data?.data || [])
        } else {
          dispatch('showError', getAPIError(certificatesResponse) || 'Ошибка при загрузке данных ЭЦП')
        }
      } catch (error) {
        dispatch('showError', getAPIError(certificatesResponse) || 'Непредвиденная ошибка при загрузке данных ЭЦП')
      } finally {
        commit('setCertificatesLoading', false)
      }
      return certificatesResponse
    },

    async fetchCertificatesOnce ({ state, dispatch }) {
      if (!state?.isCertificatesLoad && !state?.isCertificatesLoading) {
        await dispatch('fetchCertificates')
      } else {
        await certificatesResponse
      }
    },

    async fetchCertificates ({ commit, dispatch }) {
      if (!this.getters['auth/isLogged']) return
      commit('setCertificatesLoading', true)
      const response = await axios.get('v2/user/profile/certificates')
      certificatesResponse = response.data.data
      let certificates = response.data.data
      if (!response?.data?.success) {
        certificates = []
        dispatch('showError', getAPIError(response) || 'Ошибка при загрузке сертификата ЭЦП')
      }
      commit('setCertificates', certificates)
      commit('setCertificatesLoading', false)
      return certificates
    },

    async fetchAgreementsOnce ({ state, dispatch }) {
      if (!state?.isAgreementsLoad && !state?.isAgreementsLoading) {
        await dispatch('fetchAgreements')
      } else {
        await agreementsResponse
      }
    },

    async fetchAgreements ({ commit, dispatch }) {
      if (!this.getters['auth/isLogged']) return
      commit('setAgreementsLoading', true)
      const response = await axios.get('v3/user/agreements')
      agreementsResponse = response.data.data
      let agreements = response.data.data
      if (!response?.data?.success) {
        agreements = []
        dispatch('showError', getAPIError(response) || 'Ошибка при соглашений и договоров')
      }
      commit('setAgreements', agreements)
      commit('setAgreementsLoading', false)
      return agreements
    },

    async putProfessions ({ commit, dispatch }, data) {
      const preparedData = JSON.parse(JSON.stringify(data))
      preparedData.professions = preparedData.professions.map((item) => item.uuid)
      const response = await axios.put('v2/user/profile/workpreference', preparedData)
      if (response?.data?.success) {
        commit('setProfessions', data)
        return true
      } else {
        dispatch('showError', getAPIError(response) || 'Ошибка при сохранении профессий')
        return false
      }
    },

    async putAboutYourself ({ commit, dispatch }, aboutYourself) {
      const response = await axios.put('v2/user/profile/about', {
        about_yourself: aboutYourself,
      })
      if (response?.data?.success) {
        commit('setAboutYourself', aboutYourself)
        return true
      } else {
        dispatch('showError', getAPIError(response) || 'Ошибка при сохранении профессий')
        return false
      }
    },

    async putGradeGreetings ({ commit, dispatch }, grade) {
      const response = await axios.put('v2/user/greetings', { greetings: grade })
      if (response?.data?.success) {
        commit('setGradeGreetings', grade)
      } else {
        dispatch(
          'showError',
          getAPIError(response) || 'Не предвиденная ошибка при обновлении статуса уведомления о переходе на новый ранг',
        )
      }
    },

    async putEducation ({ commit, dispatch }, education) {
      const response = await axios.put('v2/user/educations', education)
      if (response?.data?.success) {
        commit('setEducation', response.data.data)
        return true
      } else {
        dispatch('showError', getAPIError(response) || 'Ошибка при сохранении образования')
        return false
      }
    },

    async editEducation ({ commit, dispatch }, education) {
      const response = await axios.put('v2/user/educations', education)
      if (response?.data?.success) {
        commit('editEducation', response.data.data)
        return true
      } else {
        dispatch('showError', getAPIError(response) || 'Ошибка при сохранении образования')
        return false
      }
    },

    async deleteEducations ({ commit, dispatch }, education_ids) {
      const response = await axios.delete('v2/user/educations', { params: { education_ids } })
      if (response?.data?.success) {
        commit('deleteEducations', education_ids)
        return true
      } else {
        dispatch('showError', getAPIError(response) || 'Ошибка при удалении образования')
        return false
      }
    },

    async putAddress ({ commit, dispatch }, params) {
      const response = await axios.patch('v2/user/addresses', params)
      if (response?.data?.success) {
        commit('putAddress', response?.data?.data)
        return true
      } else {
        dispatch('showError', getAPIError(response) || 'Ошибка при добавлении адреса')
        return false
      }
    },

    async putPassport ({ commit, dispatch }, { passport, user }) {
      const response = await axios.put('v2/user/passport', {
        ...passport,
        citizenship: user.citizenship,
        birthday: user.birthday,
        inn: user.settings.inn,
        gender: user.gender,
        citizenship_custom_name: user.citizenship_custom_name,
      })
      if (response?.data?.success) {
        commit('putPassport', { passport, user })
        return true
      } else {
        dispatch('showError', getAPIError(response) || 'Ошибка при обновлении данных.')
        return false
      }
    },
    async putUserInitialData ({ commit, dispatch }, { user }) {
      const response = await axios.put('v2/user/passport-info', {
        citizenship: user.citizenship,
        inn: user.settings.inn,
      })
      if (response?.data?.success) {
        commit('putUserData', { user })
        return true
      } else {
        dispatch('showError', getAPIError(response) || 'Ошибка при обновлении данных.')
        return false
      }
    },

    async updateDocumentsStatuses ({ commit, dispatch }) {
      const response = await axios.get('v2/user/documents/status')
      if (response?.data?.success) {
        commit('updateDocumentsStatuses', response.data.data)
      } else {
        dispatch('showError', getAPIError(response) || 'Ошибка при получении статуса документов')
      }
    },
  },

  mutations: {
    setProfile (state, value) {
      state.profile = value
      state.isProfileLoad = true
    },

    setActiveCertificate (state, value) {
      state.activeCertificate = value
      state.isActiveCertLoad = true
    },

    setProfileLoading (state, value) {
      state.isProfileLoading = value
    },

    setCertificatesLoading (state, value) {
      state.isCertificatesLoading = value
    },

    setAgreementsLoading (state, value) {
      state.isAgreementsLoading = value
    },

    setCertificates (state, value) {
      state.certificates = value
      state.isCertificatesLoad = true
    },

    setAgreements (state, value) {
      state.agreements = value
      state.isAgreementsLoad = true
    },

    setSnils (state, value) {
      state.profile.user.settings.snils = value
    },

    setProfessions (state, value) {
      state.profile.professions = value.professions
      state.profile.employment_type = value.employment_type
      state.profile.work_schedule = value.work_schedule
    },

    setAboutYourself (state, value) {
      state.profile.about_yourself = value
    },

    setGradeGreetings (state, value) {
      state.profile.grade_greetings = value
    },

    setEducation (state, value) {
      state.profile.education.push(value)
    },

    editEducation (state, value) {
      state.profile.education = state.profile.education.map((item) => (item.id === value.id ? value : item))
    },

    deleteEducations (state, ids) {
      state.profile.education = state.profile.education.filter((item) => !ids.includes(item.id))
    },

    setContractStatus (state, { id, status }) {
      state.agreements.forEach((item) => {
        if (item.id === id) item.status = status
      })
    },

    putAddress (state, address) {
      state.profile.addresses = JSON.parse(JSON.stringify(address))
    },

    putPassport (state, { passport, user }) {
      state.profile.passport = JSON.parse(JSON.stringify(passport))
      state.profile.user = JSON.parse(JSON.stringify(user))
    },
    putUserData (state, { user }) {
      state.profile.user = JSON.parse(JSON.stringify(user))
    },

    putInn (state, inn) {
      if (state?.profile?.user?.settings) state.profile.user.settings.inn = inn
    },

    updateDocumentsStatuses (state, statuses) {
      state.profile.documents = statuses.documents
      state.profile.cache_user_profile_state = statuses.cache_user_profile_state
    },

    setUnVerifiedEmail (state, newEmail) {
      if (state.profile?.user) state.profile.user.login_email_unverified = newEmail
    },

    setUnVerifiedPhone (state, newPhone) {
      if (state.profile?.user) state.profile.user.login_phone_unverified = newPhone
    },

    setVerifiedPhone (state, newPhone) {
      if (state.profile?.user) {
        state.profile.user.login_phone = newPhone
        state.profile.user.phone = newPhone
      }
    },
  },
}

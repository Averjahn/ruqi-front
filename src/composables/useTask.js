import { openTab } from '@/constants/helpers'
import { useStore } from 'vuex'
import { ref, computed, watch } from 'vue'
import axios from '@/plugins/axios'
import router from '@/router'
import usePopup from '@/composables/usePopup'
import MedicalBookPopup from '@/components/organisms/popups/MedicalBookPopup.vue'
import ConnectSmz from '@/components/organisms/popups/ConnectSmz.vue'
import PartnershipInstruction from '@/components/organisms/popups/PartnershipInstruction.vue'
import PassportPopup from '@/components/organisms/popups/PassportPopup.vue'
import AddPayment from '@/components/organisms/popups/AddPayment.vue'
import InviteFriendPopup from '@/components/organisms/popups/InviteFriendPopup.vue'
import RegistrationInRfPopup from '@/components/organisms/popups/RegistrationInRfPopup.vue'
import PatentPopup from '@/components/organisms/popups/PatentPopup.vue'
import { isJSON } from '@/constants/helpers'
import { getAPIError } from '@/constants/helpers'

import { TASK_ACTIONS_VIEW } from '@/constants/constants.js'

const getTaskActions = ({
  status,
  // waitSmz,
  // needSmz,
  // needPartnership,
  needPassportPhoto,
  waitPassport,
  needMedicalBook,
  needRegistrationInRf,
  needPatent,
  needPDAgreement,
  needUserAgreement,
  needPaymentCard,
  medicalBookOnCheck,
  telegram_id,
}) => {
  // if (waitSmz) return []
  // if (needSmz) return ['connectSmz']
  // if (needPartnership) return ['partnershipInstruction']
  if (needPassportPhoto) return ['addPhoto', 'cancelBanner']
  if (waitPassport) return ['cancelBanner']
  if (needRegistrationInRf) return ['addRegistrationInRf', 'cancelBanner']
  if (needPDAgreement) return ['signPDAgreement', 'cancelBanner']
  if (needUserAgreement) return ['signUserAgreement', 'cancelBanner']
  if (needPatent) return ['addPatent', 'cancelBanner']
  if (needPaymentCard) return ['addPayment', 'cancelBanner']
  if (needMedicalBook) return medicalBookOnCheck ? ['copyLink'] : ['fillMedicalBook', 'copyLink']
  if (['isRecruiting', 'is_recruting', 'is_recruting_urgently'].includes(status))
    return ['respond', 'plus400', 'copyLink']
  if (['requested', 'acceptInvited', 'working'].includes(status))
    return telegram_id ? ['cancel', 'copyLink'] : ['cancel', 'addTelegram', 'copyLink']
  if (['recruting_closed'].includes(status)) return telegram_id ? ['cancel'] : ['cancel', 'addTelegram']
  if (['refused', 'client_cancel'].includes(status)) return telegram_id ? [] : ['addTelegram']
  if (status === 'waiting_confirm') return telegram_id ? ['cancel', 'copyLink'] : ['cancel', 'addTelegram', 'copyLink']
  if (status === 'invite') return ['acceptInvite', 'refuse', 'copyLink']
  if (status === 'task_completed') return ['watchAct']
  // if (status === 'task_completed' || status === 'completed') return ['watchAct', 'downloadReceipt', 'cancelReceipt']
  if (status === 'need_to_sign_documents') return ['signAct', 'copyLink']
  return []
}

export default function useTask (task, updateTask) {
  const store = useStore()
  const { initPopup } = usePopup()
  // const waitSmz = ref(false)
  // const needSmz = ref(false)
  const needPDAgreement = ref(false)
  const needUserAgreement = ref(false)
  const needPassportPhoto = ref(false)
  const waitPassport = ref(false)
  // const needPartnership = ref(false)
  const needMedicalBook = ref(false)
  const needRegistrationInRf = ref(false)
  const needPatent = ref(false)
  const needPaymentCard = ref(false)
  const loading = ref(false)
  const fetchProfileOnce = () => store.dispatch('profilePage/fetchProfileOnce')
  const showNotification = (data) => store.dispatch('notifications/showNotification', data)
  const isProfileLoading = computed(() => store.getters['profilePage/isProfileLoading'])
  const medicalBookStatus = computed(() => store.getters['profilePage/profile']?.documents?.medical_book)
  const passportStatus = computed(() => store.getters['profilePage/profile']?.documents?.passport)
  const passportData = computed(() => store.getters['profilePage/profile']?.passport)
  const paymentTypes = computed(() => store.getters['profilePage/profile']?.paymentinfos)
  const photoNotLoaded = computed(() => ['need_upload', 'declined'].includes(passportStatus.value))
  const passportConfirmed = computed(() => ['confirmed'].includes(passportStatus.value))
  const passportOnCheck = computed(() => ['on_check'].includes(passportStatus.value))
  const paymentCardIsExist = computed(() => !!paymentTypes.value?.length)
  const isPassportExist = computed(() => !!passportData.value?.id)
  const fetchAgreementsOnce = () => store.dispatch('profilePage/fetchAgreementsOnce')
  const telegram_id = computed(() => store.getters['user/user']?.telegram_id)
  const isLoggedIn = computed(() => store.getters['auth/isLogged'])
  const profilePromise = ref(null)
  let hasProfileFetched = false
  watch(
    isProfileLoading,
    (newValue) => {
      if (!newValue && isLoggedIn.value && !hasProfileFetched) {
        profilePromise.value = fetchProfileOnce()
        hasProfileFetched = true
      }
    },
    { immediate: true },
  )

  const agreementsPromise = ref(null)
  let hasAgreementsFetched = false
  watch(
    passportConfirmed,
    (newValue) => {
      if (newValue && isLoggedIn.value && !hasAgreementsFetched) {
        agreementsPromise.value = fetchAgreementsOnce()
        hasAgreementsFetched = true
      }
    },
    { immediate: true },
  )

  const medicalBookOnCheck = computed(() =>
    ['on_check', 'at_check', 'need_approve', 'doc_on_check'].includes(medicalBookStatus.value),
  )

  const actionsList = computed(() => {
    if (isProfileLoading.value) return []
    const actions = getTaskActions({
      status: task?.value?.calcStatus || task?.value?.status,
      // waitSmz: waitSmz.value,
      // needSmz: needSmz.value,
      needPDAgreement: needPDAgreement.value,
      waitPassport: waitPassport?.value,
      needUserAgreement: needUserAgreement.value,
      needPassportPhoto: needPassportPhoto.value,
      needPaymentCard: needPaymentCard.value,
      // needPartnership: needPartnership.value,
      needMedicalBook: needMedicalBook.value,
      needRegistrationInRf: needRegistrationInRf.value,
      needPatent: needPatent.value,
      medicalBookOnCheck: medicalBookOnCheck.value,
      telegram_id: telegram_id.value,
    })
    return actions.map(
      (item) =>
        TASK_ACTIONS_VIEW[item] || {
          text: 'Не определена',
          buttonType: 'outlined',
        },
    )
  })

  let cardBannerType = computed(() => {
    if (isProfileLoading.value) return 'empty'
    const status = task?.value?.calcStatus || task?.value?.status
    if (needPassportPhoto.value) return 'needUploadPhoto'
    if (status === 'requested' && photoNotLoaded.value) return 'needUploadPhoto'
    if (needPaymentCard.value) return 'needPaymentCard'
    // if (needSmz.value) return 'needSmz'
    // if (waitSmz.value) return 'waitSmz'
    if (needPDAgreement.value) return 'needPDAgreement'
    if (needUserAgreement.value) return 'needUserAgreement'
    if (needRegistrationInRf.value) return 'needRegistrationInRf'
    if (needPatent.value) return 'needPatent'
    // if (needPartnership.value) return 'needPartnership'
    if (needMedicalBook.value) return medicalBookOnCheck.value ? 'waitMedicalBookApprove' : 'needMedicalBook'
    if (waitPassport?.value) return 'waitVerification'
    if (['client_cancel', 'refused'].includes(status)) return 'taskIsCanceled'
    if (['requested', 'acceptInvited', 'waiting_confirm', 'working', 'recruting_closed'].includes(status))
      return 'canCancelTask'
    return 'empty'
  })

  let taskBannerType = computed(() => {
    if (isProfileLoading.value) return 'empty'
    const status = task?.value?.calcStatus || task?.value?.status
    if (needPassportPhoto.value) return 'needUploadPhoto'
    if (status === 'requested' && photoNotLoaded.value) return 'needUploadPhoto'
    if (needPaymentCard.value) return 'needPaymentCard'
    // if (needSmz.value) return 'needSmz'
    // if (waitSmz.value) return 'waitSmz'
    if (needPDAgreement.value) return 'needPDAgreement'
    if (needUserAgreement.value) return 'needUserAgreement'
    if (needRegistrationInRf.value) return 'needRegistrationInRf'
    if (needPatent.value) return 'needPatent'
    // if (needPartnership.value) return 'needPartnership'
    if (needMedicalBook.value) return medicalBookOnCheck.value ? 'waitMedicalBookApprove' : 'needMedicalBook'
    if (waitPassport?.value) return 'waitVerification'
    if (status === 'task_completed') return 'taskCompleted'
    if (status === 'is_recruting_urgently') return 'recrutingUrgently'
    if (status === 'invite') return 'invite'
    // if (status === 'waiting_confirm') return 'waitingConfirm'
    if (status === 'working' || status === 'waiting_confirm') return 'working'
    if (status === 'shift_has_begun') return 'shiftHasBegun'
    if (status === 'shift_data_on_processing') return 'shiftDataProcessing'
    if (['recruting_closed', 'requested', 'acceptInvited'].includes(status)) return 'canCancelTask'
    if (['client_cancel', 'refused'].includes(status)) return 'taskIsCanceled'
    return 'empty'
  })

  const taskActions = {
    openAct: () => {
      router.push('/finance')
    },
    signPDAgreement: () => {
      router.push('/profile?tab=contracts')
    },
    signUserAgreement: () => {
      router.push('/profile?tab=contracts')
    },

    addTelegram: async () => {
      loading.value = true
      const response = await axios.get('v2/user/telegram/link', {
        errorMessage: 'Ошибка при получении ссылки на телеграм бота',
      })
      if (response?.data?.success) openTab(response.data.data?.telegramLink)
      loading.value = false
    },

    inviteFriend: () => {
      initPopup(InviteFriendPopup)
    },

    copyLink: () => {
      navigator.clipboard.writeText(window.location.origin + '/task/' + task?.value?.uuid)
      showNotification({ type: 'success', text: 'Ссылка на заявку скопирована в буфер обмена' })
    },

    addPhoto: () => {
      initPopup(PassportPopup)
      needPassportPhoto.value = false
    },

    addPayment: () => {
      initPopup(AddPayment)
      needPaymentCard.value = false
    },

    fillMedicalBook: () => {
      initPopup(MedicalBookPopup)
    },

    connectSmz: () => {
      initPopup(ConnectSmz)
    },

    addRegistrationInRf: () => {
      initPopup(RegistrationInRfPopup)
    },

    addPatent: () => {
      initPopup(PatentPopup)
    },

    partnershipInstruction: () => {
      initPopup(PartnershipInstruction)
    },

    cancelBanner: () => {
      needRegistrationInRf.value = false
      needPatent.value = false
      needPaymentCard.value = false
      needPDAgreement.value = false
      needUserAgreement.value = false
      waitPassport.value = false
      needPassportPhoto.value = false
    },

    changeStatus: async (action) => {
      loading.value = true
      await profilePromise
      if (isPassportExist?.value) await agreementsPromise

      const citizenship = store.getters['profilePage/profile']?.user?.citizenship
      const profile = store.getters['profilePage/profile']
      const agreements = store.getters['profilePage/agreements']
      const userAgreements = agreements?.filter((agreement) => agreement?.general_type === 'user_agreement')
      const pDataAgreements = agreements?.filter((agreement) => agreement?.general_type === 'personal_data')
      const isUserAgreementSigned = userAgreements?.some((agreement) =>
        ['contractor_signed', 'all_signed'].includes(agreement?.status),
      )
      const isPDAgreementSigned = pDataAgreements?.some((agreement) =>
        ['contractor_signed', 'all_signed'].includes(agreement?.status),
      )
      const documents = profile?.documents || {}
      // const partnershipStatus = store.getters['profilePage/profile']?.user?.partnership_status
      // const smzStatus = store.getters['profilePage/profile']?.user?.smz_status

      // if (
      //   action.requestStatus === 'requested' &&
      //   smzStatus !== 'done' &&
      //   ['RU', 'BY'].includes(citizenship)
      // ) {
      //   needSmz.value = true
      //   loading.value = false
      //   return
      // }

      // if (action.requestStatus === 'requested' && partnershipStatus !== 'done' && ['RU', 'BY'].includes(citizenship)) {
      //   needPartnership.value = true
      //   loading.value = false
      //   return
      // }

      // if (action.requestStatus === 'requested' && smzStatus === 'pending' && ['RU', 'BY'].includes(citizenship)) {
      //   waitSmz.value = true
      //   loading.value = false
      //   return
      // }

      if (
        action.requestStatus === 'requested' &&
        (photoNotLoaded.value || !isPassportExist.value)
      ) {
        needPassportPhoto.value = true
        loading.value = false
        return
      }
      if (action.requestStatus === 'requested' && passportOnCheck?.value) {
        waitPassport.value = true
        loading.value = false
        return
      }

      if (action.requestStatus === 'requested' && !isPDAgreementSigned) {
        needPDAgreement.value = true
        loading.value = false
        return
      }

      if (action.requestStatus === 'requested' && !isUserAgreementSigned) {
        needUserAgreement.value = true
        loading.value = false
        return
      }

      if (action.requestStatus === 'requested' && !paymentCardIsExist.value) {
        needPaymentCard.value = true
        loading.value = false
        return
      }

      if (citizenship !== 'RU') {
        const documentChecks = [
          {
            type: 'document_registration_in_rf',
            status: documents.document_registration_in_rf,
            needFlag: needRegistrationInRf,
            expiredFlag: 'registrationExpired',
          },
        ]

        if (!['BY', 'AM', 'KZ', 'KG'].includes(citizenship)) {
          documentChecks.push({
            type: 'patent',
            status: documents.patent,
            needFlag: needPatent,
            expiredFlag: 'patentExpired',
          })
        }

        const checkDocument = async ({ type, status, needFlag, expiredFlag }) => {
          const defaultInfo = { issue_date: null, expiration_date: null }
          let documentInfo = { ...defaultInfo }
          let isExpired = true

          try {
            const response = await axios.get('v2/user/documents', { params: { type } })

            if (!response.data.success) {
              this.showNotification({
                type: 'error',
                text: getAPIError(response) || `Ошибка получения данных документа ${type}`,
              })
              return { documentInfo, isExpired }
            }

            const data =
              response?.data?.data?.find((reg) => reg?.check_status !== 'declined' && reg?.status !== 'expired') ||
              response?.data?.data?.[0] ||
              {}
            const jsonData = isJSON(data.json) ? JSON.parse(data.json) : { ...defaultInfo }
            documentInfo = { ...jsonData }
            isExpired = !documentInfo.expiration_date || new Date(documentInfo.expiration_date) < new Date()

            return { documentInfo, isExpired }
          } catch (error) {
            this.showNotification({
              type: 'error',
              text: getAPIError(response) || `Ошибка получения данных документа ${type}`,
            })
            return { documentInfo, isExpired }
          }
        }

        for (const check of documentChecks) {
          const { documentInfo, isExpired } = await checkDocument(check)

          if (action.requestStatus === 'requested' && (!['confirmed', 'confirm'].includes(check.status) || isExpired)) {
            check.needFlag.value = true
            loading.value = false
            return
          }
        }
      }

      if (
        action.requestStatus === 'requested' &&
        !['confirmed', 'confirm'].includes(medicalBookStatus.value) &&
        task?.value?.requirements?.includes('Медицинская книжка')
      ) {
        needMedicalBook.value = true
        loading.value = false
        return
      }

      const response = await axios.post(
        'v2/user/tasks/status',
        {
          task_uuid: task?.value?.uuid,
          status: action.requestStatus,
        },
        {
          errorMessage: 'Ошибка сервера при попытке изменить статус',
        },
      )
      if (response?.data?.success) {
        const taskCopy = JSON.parse(JSON.stringify(task?.value))
        taskCopy.calcStatus = response?.data?.data?.calcStatus
        updateTask(taskCopy)
      }
      loading.value = false
    },
  }

  const callAction = (action) => {
    if (loading.value) return
    taskActions[action.action](action)
  }

  return {
    cardBannerType,
    actionsList,
    taskBannerType,
    callAction,
    loading,
  }
}

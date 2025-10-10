<template>
  <PopupContainer class="passport_popup" title="Паспорт" maxWidth="670px" :loading="loading" @close="$emit('close')">
    <Tabs :tabs="tabs" :value="currentTab" class="mb_16" @change="changeTab" type="contained" wide />
    <template v-if="currentTab === 'passport_data'">
      <PassportInfoBlock class="mb_24" showEditButton @success="currentTab = 'passport_photo'" />
    </template>
    <template v-else>
      <PassportPhotoLoader @loading="setLoading" @close="$emit('close')" @onBack="currentTab = 'passport_data'"/>
    </template>
  </PopupContainer>
</template>

<script>
import PopupContainer from '@/components/atoms/PopupContainer.vue'
import PassportPhotoLoader from '@/components/organisms/PassportPhotoLoader.vue'
import PassportInfoBlock from '@/components/page/profile/PassportInfoBlock.vue'

export default {
  name: 'PassportPopup',
  components: { PopupContainer, PassportPhotoLoader, PassportInfoBlock },
  props: {},
  data () {
    return {
      currentTab: 'passport_data',
      loading: false,
    }
  },
  computed: {
    tabs () {
      const tabs = [
        { text: 'Паспортные данные', value: 'passport_data' },
        { text: 'Скан паспорта', value: 'passport_photo' },
      ]
      return tabs
    },
  },
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    changeTab (value) {
      this.currentTab = value
    },
    setLoading (val) {
      this.loading = val
    },
  },
}
</script>

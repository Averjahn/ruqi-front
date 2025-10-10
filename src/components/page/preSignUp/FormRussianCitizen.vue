<template>
  <div class="mb_40">
    <h4 class="mb_24 pt_20">Шаг 2. Укажите данные вашего документа</h4>
    <div class="sign_label required_label">Фамилия</div>
    <Input v-model="computedUserData.lastname" class="form_input mb_16" :rules="rulesSets.lastName" />

    <div class="sign_label required_label">Имя</div>
    <Input v-model="computedUserData.firstname" class="form_input mb_16" :rules="rulesSets.firstName" />

    <div class="double_field">
      <div class="two_thirds">
        <div class="sign_label required_label">Отчество</div>
        <Input v-model="computedUserData.middlename" class="form_input mb_16" :rules="rulesSets.middleName" />
      </div>
      <div class="one_thirds">
        <div class="sign_label required_label">Дата рождения</div>
        <DatePicker
          v-model:date="computedUserData.birthday"
          class="form_input"
          format="DD.MM.YYYY"
          :rules="rulesSets.birth"
          :airOptions="{ maxDate: $dayjs().subtract(14, 'year'), minDate: '1930-01-01' }"
          clearable
        />
      </div>
    </div>

    <div class="sign_label required_label">Место рождения</div>
    <Input v-model="computedUserData.passport.birth_address" class="form_input mb_16" :rules="[rules.required]" />

    <div class="double_field">
      <div class="two_thirds">
        <div class="double_input">
          <div class="passport_series">
            <div class="sign_label required_label">Серия</div>
            <Input
              ref="passportSeries"
              :value="computedUserData.passport.series"
              class="form_input passport_series"
              @input="onPassportSeries"
              :rules="[rules.required, rules.passportSeries]"
            />
          </div>
          <div>
            <div class="sign_label required_label">Номер</div>
            <Input
              ref="passportNumber"
              :value="computedUserData.passport.number"
              class="form_input"
              @keydown="onKeyDownPassportNumber"
              @input="onPassportNumber"
              :rules="[rules.required, rules.passportNumber]"
            />
          </div>
        </div>
      </div>
      <div class="one_thirds">
        <div class="sign_label required_label">Дата выдачи</div>
        <DatePicker
          v-model:date="computedUserData.passport.issue_date"
          class="form_input mb_16"
          format="DD.MM.YYYY"
          :rules="[rules.required, rules.date, rules.notInFuture]"
          :airOptions="{ maxDate: $dayjs() }"
          clearable
        />
      </div>
    </div>

    <div class="double_field">
      <div class="two_thirds">
        <div class="sign_label required_label">Кем выдан</div>
        <Input
          v-model="computedUserData.passport.issue_organization_name"
          class="form_input mb_16"
          :rules="[rules.required]"
        />
      </div>
      <div class="one_thirds">
        <div class="sign_label required_label">Код подразделения</div>
        <Input
          :value="computedUserData.passport.issue_organization_code"
          class="form_input mb_16"
          @input="onDivisionCode"
          :rules="[rules.required, rules.issueCode]"
        />
      </div>
    </div>

    <div class="sign_label required_label">Адрес регистрации</div>
    <SearchAutocomplete
      class="form_input mb_16"
      v-model="computedUserData.passport.registration_address"
      :rules="[rules.required]"
    />

    <div class="sign_label required_label">ИНН</div>
    <Input
      :value="computedUserData.inn"
      class="form_input mb_16"
      maxlength="12"
      :rules="[rules.required, rules.validateInn]"
      @input="onInn"
    />

    <Info blue class="mb_16"> Указав ИНН вы сможете получать оплаты за выполненные работы быстрее и без комиссии </Info>
  </div>

  <div>
    <h4 class="mb_24">Шаг 3. Прикрепите фото</h4>
    <div class="mb_16">Прикрепите сканы или фото основного разворота паспорта (2-3 страница)</div>

    <Info yellow class="mb_16">
      На фотографии должны быть отчётливо видны серия, номер, основные данные, фотография. В поле зрения не должны
      попадать пальцы и посторонние предметы.
    </Info>

    <UploadPhoto
      class="mb_24"
      :loading="loadings.passport_page_2_3"
      :photo="photos.passport_page_2_3 && photos.passport_page_2_3.thumb_url"
      :status="photos.passport_page_2_3 && photos.passport_page_2_3.check_status"
      :samplePhoto="require('@/assets/img_deprecated/sample_passport.jpg')"
      @deletePhoto="$emit('deletePhoto', 'passport_page_2_3')"
      @addFile="$emit('addPhoto', $event, 'passport_page_2_3')"
    />

    <div class="mb_16">Сделайте фото страницы последнего места регистрации или загрузите скан</div>
    <Info yellow class="mb_16"> На фотографии должно быть отчётливо видны данные последнего места регистрации. </Info>

    <UploadPhoto
      class="mb_24"
      :loading="loadings.passport_page_4_5"
      :photo="photos.passport_page_4_5 && photos.passport_page_4_5.thumb_url"
      :status="photos.passport_page_4_5 && photos.passport_page_4_5.check_status"
      :samplePhoto="require('@/assets/img_deprecated/sample_passport_2.jpg')"
      @deletePhoto="$emit('deletePhoto', 'passport_page_4_5')"
      @addFile="$emit('addPhoto', $event, 'passport_page_4_5')"
    />
  </div>
</template>

<script>
import UploadPhoto from '@/components/organisms/UploadPhoto.vue'
import SearchAutocomplete from '@/components/organisms/SearchAutocomplete.vue'
import { mapActions } from 'vuex'
import { formatNumericString } from '@/constants/masks'
import { rules, rulesSets } from '@/constants/validations'

export default {
  components: { UploadPhoto, SearchAutocomplete },
  emits: ['addPhoto', 'deletePhoto'],
  props: {
    userData: {
      type: Object,
      required: true,
    },
    photos: {
      type: Object,
      default: () => {},
    },
    loadings: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      rules,
      rulesSets,
      loadingDocuments: false,
      loadingSelfie: false,
    }
  },
  computed: {
    computedUserData: {
      get () {
        return this.userData
      },
      set (newValue) {
        this.$emit('update:userData', newValue)
      },
    },
  },
  methods: {
    ...mapActions('notifications', ['showNotification']),

    deletePhoto () {
      this.passportPhoto = ''
    },

    onPassportSeries (event) {
      if (event.target.value.length > 3) {
        this.$refs.passportNumber.$el.querySelector('input').focus()
      }
      const { formattedValue, cursorPosition } = formatNumericString({
        value: event.target.value,
        pattern: '****',
        cursorPosition: event.target.selectionEnd,
      })
      this.computedUserData.passport.series = formattedValue ? '' : 'null'
      this.$nextTick(() => {
        this.computedUserData.passport.series = formattedValue
        this.$nextTick(() => {
          event.target.setSelectionRange(cursorPosition, cursorPosition)
        })
      })
    },
    onKeyDownPassportNumber (e) {
      if (e.key === 'Backspace' && !this.computedUserData.passport.number?.length) {
        this.$refs.passportSeries.$el.querySelector('input').focus()
      }
    },
    onPassportNumber (event) {
      const { formattedValue, cursorPosition } = formatNumericString({
        value: event.target.value,
        pattern: '******',
        cursorPosition: event.target.selectionEnd,
      })
      this.computedUserData.passport.number = formattedValue ? '' : 'null'
      this.$nextTick(() => {
        this.computedUserData.passport.number = formattedValue
        this.$nextTick(() => {
          event.target.setSelectionRange(cursorPosition, cursorPosition)
        })
      })
    },
    onInn (event) {
      const { formattedValue, cursorPosition } = formatNumericString({
        value: event.target.value,
        pattern: '************',
        cursorPosition: event.target.selectionEnd,
      })
      this.computedUserData.inn = formattedValue ? '' : 'null'
      this.$nextTick(() => {
        this.computedUserData.inn = formattedValue
        this.$nextTick(() => {
          event.target.setSelectionRange(cursorPosition, cursorPosition)
        })
      })
    },
    onDivisionCode (event) {
      const { formattedValue, cursorPosition } = formatNumericString({
        value: event.target.value,
        pattern: '***-***',
        cursorPosition: event.target.selectionEnd,
      })
      this.computedUserData.passport.issue_organization_code = formattedValue ? '' : 'null'
      this.$nextTick(() => {
        this.computedUserData.passport.issue_organization_code = formattedValue
        this.$nextTick(() => {
          event.target.setSelectionRange(cursorPosition, cursorPosition)
        })
      })
    },
  },
}
</script>

<style lang="scss">
.document_photos {
  display: flex;
  gap: 8px;
}

.passport_series {
  width: 40%;
  flex: none;
}
</style>

<template>
  <div class="mb_40">
    <h4 class="mb_24 pt_20">Шаг 2. Укажите данные вашего документа</h4>
    <div class="sign_label required_label">Фамилия (на русском)</div>
    <Input v-model="computedUserData.lastname" class="form_input mb_16" :rules="rulesSets.lastName" />

    <div class="sign_label required_label">Имя (на русском)</div>
    <Input v-model="computedUserData.firstname" class="form_input mb_16" :rules="rulesSets.firstName" />

    <div class="double_field">
      <div class="two_thirds">
        <div class="sign_label required_label">Отчество (если есть)</div>
        <Input v-model="computedUserData.middlename" class="form_input" :rules="rulesSets.middleName" />
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

    <div class="sign_label required_label">Номер документа</div>
    <Input
      ref="passportSeries"
      v-model="computedUserData.passport[getPassportNumber]"
      class="form_input passport_series"
      :rules="[rules.required]"
    />

    <template v-if="userDataCitizenship === 'BY'">
      <div class="sign_label required_label">Идентификационный номер</div>
      <Input
        ref="passportNumber"
        v-model="computedUserData.passport.by_id_number"
        class="form_input"
        :rules="[rules.required]"
      />
    </template>

    <div class="double_field">
      <div class="two_thirds">
        <div class="sign_label required_label">Дата выдачи</div>
        <DatePicker
          v-model:date="computedUserData.passport.issue_date"
          class="form_input"
          format="DD.MM.YYYY"
          :rules="[rules.required, rules.date, rules.notInFuture]"
          :airOptions="{ maxDate: $dayjs() }"
          clearable
        />
      </div>
      <div class="one_thirds">
        <div class="sign_label required_label">Срок действия</div>
        <DatePicker
          v-model:date="computedUserData.passport.expiration_date"
          class="form_input"
          format="DD.MM.YYYY"
          :rules="[rules.required, rules.date]"
          clearable
        />
      </div>
    </div>

    <div class="sign_label required_label">Кем выдан</div>
    <Input
      v-model="computedUserData.passport.issue_organization_name"
      class="form_input mb_16"
      :rules="[rules.required]"
    />

    <div class="sign_label required_label">Адрес регистрации в РФ</div>
    <SearchAutocomplete
      class="form_input mb_16"
      v-model="computedUserData.passport.registration_address"
      :rules="[rules.required]"
    />

    <div class="sign_label">ИНН</div>
    <Input
      v-model="computedUserData.inn"
      class="form_input mb_16"
      @input="onInn"
      maxlength="12"
      :rules="[rules.validateInn]"
    />
    <Info blue class="mb_16">Указав ИНН вы сможете получать оплаты за выполненные работы быстрее и без комиссии</Info>
  </div>

  <div>
    <h4 class="mb_24">Шаг 3. Прикрепите фото</h4>
    <div class="mb_16">Прикрепите сканы или фото документа, удостоверяющего личность</div>

    <Info yellow class="mb_16">
      На фотографии должны быть отчётливо видны серия, номер, основные данные, фотография. В поле зрения не должны
      попадать пальцы и посторонние предметы.
    </Info>

    <UploadPhoto
      class="mb_24"
      :loading="loadings[passportType]"
      :photo="photos[passportType] && photos[passportType].thumb_url"
      :status="photos[passportType] && photos[passportType].check_status"
      @deletePhoto="$emit('deletePhoto', passportType)"
      @addFile="$emit('addPhoto', $event, passportType)"
    />
    <div v-if="userDataCitizenship === 'KG'" class="mb_16">Обратная сторона документа (если ID-карта)</div>
    <UploadPhoto
      v-if="userDataCitizenship === 'KG'"
      class="mb_24"
      :loading="loadings['passport_kg_additional']"
      :photo="photos['passport_kg_additional'] && photos['passport_kg_additional'].thumb_url"
      :status="photos['passport_kg_additional'] && photos['passport_kg_additional'].check_status"
      @deletePhoto="$emit('deletePhoto', 'passport_kg_additional')"
      @addFile="$emit('addPhoto', $event, 'passport_kg_additional')"
    />
  </div>
</template>

<script>
import UploadPhoto from '@/components/organisms/UploadPhoto.vue'
import { formatNumericString } from '@/constants/masks'
import { rules, rulesSets } from '@/constants/validations'
import SearchAutocomplete from '@/components/organisms/SearchAutocomplete.vue'

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
    userDataCitizenship: {
      get () {
        return this?.userData?.citizenship
      },
      set (newValue) {
        this.$emit('update:userData', newValue)
      },
    },
    passportType () {
      if (this.userDataCitizenship === 'BY') {
        return 'passport_by'
      } else if (this.userDataCitizenship === 'AM') {
        return 'passport_am'
      } else if (this.userDataCitizenship === 'KZ') {
        return 'passport_kz'
      }
      return 'passport_kg'
    },
    getPassportNumber: {
      get () {
        if (this.userDataCitizenship === 'AM') {
          return 'am_number'
        } else if (this.userDataCitizenship === 'KZ') {
          return 'kz_number'
        } else if (this.userDataCitizenship === 'KG') {
          return 'kg_number'
        } else {
          return 'by_number'
        }
      },
    },
  },
  methods: {
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

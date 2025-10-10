<template>
  <Form ref="form" class="filter-form">
    <div class="form-data-group">
      <div class="label">Профессии</div>
      <Select
        v-model="currentFilters.professions"
        item-value="uuid"
        :options="professions"
        :loading="professionsLoading"
        searchable
        clearable
        multiselect
      >
        <template #selection>
          <span v-if="currentFilters.professions.length === 1">{{ professionsTitle }}</span>
          <span v-else-if="currentFilters.professions.length > 1">
            Выбрано {{ currentFilters.professions.length }}
            {{ declensionOfNumber(currentFilters.professions.length, ['профессия', 'профессии', 'профессий']) }}
          </span>
        </template>
      </Select>
    </div>

    <div class="form-data-group">
      <div class="label">Район поиска</div>
      <SearchAutocomplete v-model="currentFilters.region" :zIndex="1000" placeholder="Поиск" clearable />
    </div>

    <div class="form-data-group">
      <div class="label">Радиус поиска</div>
      <div class="radio_group">
        <Radio v-model="currentFilters.radius" name="radius" value="1">&lt; 1 км</Radio>
        <Radio v-model="currentFilters.radius" name="radius" value="10">&lt; 10 км</Radio>
        <Radio v-model="currentFilters.radius" name="radius" value="15">&lt; 15 км</Radio>
        <Radio v-model="currentFilters.radius" name="radius" value="25">&lt; 25 км</Radio>
        <Radio v-model="currentFilters.radius" name="radius" value="50">&lt; 50 км</Radio>
      </div>
    </div>

    <div class="form-data-group">
      <div class="label">Бренд</div>
      <div>
        <Checkbox
          v-for="brand in showedBrands"
          v-model="currentFilters.brand"
          :key="brand.uuid"
          :value="brand.uuid"
          class="mb_16"
        >
          {{ brand.brand }}
        </Checkbox>
        <ButtonText v-if="brands?.length > 5" type="s" @click="showAllBrands" class="show-all">{{
          brandsActionText
        }}</ButtonText>
      </div>
    </div>

    <div class="form-data-group">
      <div class="label">Тип смены</div>
      <div>
        <Checkbox v-model="currentFilters.shift_type" value="Дневная" class="mb_16">Дневная</Checkbox>
        <Checkbox v-model="currentFilters.shift_type" value="Ночная">Ночная</Checkbox>
      </div>
    </div>

    <div class="form-data-group">
      <div class="label">Продолжительность смены</div>
      <div>
        <Checkbox v-model="currentFilters.shift_duration" :value="8" class="mb_16">8 часов</Checkbox>
        <Checkbox v-model="currentFilters.shift_duration" :value="12">12 часов</Checkbox>
      </div>
    </div>

    <div class="form-data-group">
      <div class="label">Документы</div>
      <div>
        <Checkbox v-model="currentFilters.medical_book" class="mb_16">Мед. книжка</Checkbox>
        <Checkbox v-model="currentFilters.driver_license">Водительские права</Checkbox>
      </div>
    </div>

<!--     <div class="form-data-group">
      <div class="label">Зарплата от</div>
      <Input :value="currentFilters.rate.from" @input="setSalary" clearable placeholder="От" />
    </div> -->

    <div class="form-data-group">
      <div class="label">Начало работы</div>
      <DatePicker
        v-model:date="currentFilters.start_date.from"
        class="date_picker"
        format="DD.MM.YYYY"
        clearable
        placeholder="дд.мм.гггг"
      />
    </div>

    <div class="action_block">
      <Button v-if="!initialState" class="action_button mb_16" type="outlined" :disabled="loading" @click="clearAll">
        Сбросить все
      </Button>
      <Button class="action_button" :loading="loading" :disabled="loading || !hasChanges" @click="apply">
        Показать заявки
      </Button>
    </div>
  </Form>
</template>

<script>
import { declensionOfNumber, convertToBackFormat } from '@/constants/helpers'
import { mapActions, mapGetters } from 'vuex'
import SearchAutocomplete from '@/components/organisms/SearchAutocomplete.vue'
import Radio from '@/components/atoms/Radio.vue'
import { formatInteger } from '@/constants/masks'
import { INITIAL_TASK_FILTERS } from '@/constants/constants'

export default {
  components: {
    SearchAutocomplete,
    Radio,
  },
  props: {
    requestFunction: {
      type: Function,
    },
    appliedFilters: {
      type: Object,
      default: () => ({}),
    },
    disableFetch: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      loading: false,
      isFilterPopupOpen: false,
      brands: [],
      showAll: false,
      currentFilters: JSON.parse(JSON.stringify(INITIAL_TASK_FILTERS)),
      declensionOfNumber,
    }
  },
  computed: {
    ...mapGetters('dictionary', ['professions', 'professionsLoading']),
    ...mapGetters('auth', ['isLogged']),
    showedBrands () {
      return this.showAll ? this.brands : this.brands.slice(0, 5)
    },
    brandsActionText () {
      return this.showAll ? 'Свернуть' : 'Показать всё'
    },
    professionsTitle () {
      return this.professions.find((item) => item.uuid === this.currentFilters?.professions?.[0])?.name || ''
    },
    hasChanges () {
      return JSON.stringify(this.currentFilters) !== JSON.stringify(this.appliedFilters)
    },
    initialState () {
      return JSON.stringify(this.currentFilters) === JSON.stringify(INITIAL_TASK_FILTERS)
    },
    hasAppliedFilters () {
      return JSON.stringify(this.appliedFilters) !== JSON.stringify(INITIAL_TASK_FILTERS)
    },
  },
  mounted () {
    const filters = JSON.parse(localStorage.getItem('userTaskFilters')) || INITIAL_TASK_FILTERS
    this.$emit('update:appliedFilters', JSON.parse(JSON.stringify(filters)))
    this.currentFilters = JSON.parse(JSON.stringify(filters))
    if (this.isLogged && !this.disableFetch) this.fetchBrands()
    if (!this.disableFetch) this.fetchProfessionsOnce()
  },
  watch: {
    appliedFilters: {
      handler () {
        let count = 0
        for (const key in this.appliedFilters) {
          if (this.appliedFilters[key]?.toString() !== INITIAL_TASK_FILTERS[key]?.toString()) count++
        }
        this.$emit('update:filtersCounter', count)
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions('notifications', ['showNotification']),
    ...mapActions('dictionary', ['fetchProfessionsOnce']),

    async fetchBrands () {
      this.loading = true
      const response = await this.$axios.get('v2/user/brands', { errorMessage: 'Ошибка при получении списка брендов' })
      if (response?.data?.success) this.brands = response.data.data
      this.loading = false
    },

    setSalary (e) {
      const { value, cursorPosition } = formatInteger({
        value: e.target.value,
        cursorPosition: e.target.selectionEnd,
      })
      this.currentFilters.rate.from = null
      this.$nextTick(() => {
        this.currentFilters.rate.from = value
        this.$nextTick(() => {
          if (!e?.target?.setSelectionRange) return
          e.target.setSelectionRange(cursorPosition, cursorPosition)
        })
      })
    },

    apply () {
      this.$emit('apply', JSON.parse(JSON.stringify(this.currentFilters)))
    },

    showAllBrands () {
      this.showAll = !this.showAll
    },

    async clearAll () {
      if (this.hasAppliedFilters) {
        this.currentFilters = JSON.parse(JSON.stringify(INITIAL_TASK_FILTERS))
        this.$emit('apply', JSON.parse(JSON.stringify(INITIAL_TASK_FILTERS)))
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.date_picker {
  width: 100%;
}

.filter-form {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 32px;
}

.form-data-group {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 24px;
}

.label {
  font-weight: 600;
  font-size: 18px;
  line-height: 23px;
  color: #1b1b1b;
  white-space: nowrap;
}

.action_block {
  position: sticky;
  bottom: 0;
  background-color: white;
  padding-top: 12px;
  padding-bottom: 12px;
}

.show-all {
  font-size: 18px;
  font-weight: 400;
  line-height: 26px;
  text-align: left;
  color: #1735f5;
  cursor: pointer;
}

.radio_group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>

<template>
  <div
    :class="[{ error: computedError, shake, small, disabled, silent_validation_error: !silentIsValid }]"
    class="select_container"
  >
    <div v-if="label" class="field_label_global">{{ label }}</div>

    <div class="select_section_wrapper">
      <div ref="selectSection" class="select_section" @click="toggleSelect">
        <div class="select_wrap">
          <span class="title" :class="{ grey: !title }">{{ title || placeholder }}</span>
          <slot name="selection" />
        </div>
        <ButtonIconGhost v-if="clearable" ref="clearButton" @click.stop="clear" :class="{ invisible: clearDisabled }">
          <img class="clear_icon" src="@/assets/icons/cross.svg" />
        </ButtonIconGhost>
        <img class="chevron" :class="{ isOpen }" src="@/assets/icons/chevron_down.svg" />
        <ThinLineLoading class="progress_wrap" :show="loading && !isOpen" />
      </div>

      <div ref="list" class="list_container" :class="{ ignoreOverflow, isOpen }">
        <div v-if="searchable" class="search_block">
          <Input :value="searchValue" @input="onSearch" placeholder="Поиск" clearable />
        </div>
        <div class="list_items scrollbar">
          <template v-if="multiselect">
            <label v-for="item in filteredOptions" class="list_item" :key="item.id" @click.stop>
              <input
                v-if="multiselect"
                :checked="currentIds.includes(item[this.itemValue])"
                class="checkbox"
                type="checkbox"
                @change="selectItemMultiselect($event, item)"
              />
              {{ item[itemText] }}
            </label>
          </template>
          <template v-else>
            <div v-for="item in filteredOptions" class="list_item" @click="selectItem($event, item)" :key="item.id">
              {{ item[itemText] }}
            </div>
          </template>

          <div v-if="!filteredOptions.length" class="list_item_empty">Нет записей</div>
        </div>

        <div class="list_progress_wrap">
          <ThinLineLoading :show="loading" />
        </div>
      </div>
    </div>

    <FieldMessage :text="errorMessage" />
  </div>
</template>

<script>
import ThinLineLoading from '@/components/atoms/loaders/ThinLineLoading.vue'
import FieldMessage from '@/components/atoms/FieldMessage.vue'

export default {
  name: 'Select',
  components: { ThinLineLoading, FieldMessage },
  inject: {
    checkValid: {
      default: false,
    },
  },
  props: {
    options: { type: Array, default: () => [] },
    label: { type: String, default: null },
    error: { type: Boolean, default: false },
    multiselect: { type: Boolean, default: false },
    modelValue: [Object, String, Number],
    value: { type: [Object, String, Number], default: () => {} },
    searchable: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String, default: '' },
    loading: { type: Boolean, default: false },
    returnObject: { type: Boolean, default: false },
    itemValue: { type: String, default: 'id' },
    itemText: { type: String, default: 'name' },
    ignoreOverflow: { type: Boolean, default: false },
    small: { type: Boolean, default: false },
    disableValidation: { type: Boolean, default: false },
    rules: { type: Array, default: () => [] },
  },
  data () {
    return {
      list: null,
      silentIsValid: true,
      searchValue: '',
      currentValue: this.multiselect ? [] : null,
      currentType: this.type,
      shake: false,
      isOpen: false,
      isFocus: false,
      isValid: true,
      errorMessage: null,
    }
  },
  computed: {
    emptyValue () {
      return this.multiselect ? [] : null
    },
    computedError () {
      return this.error || !this.isValid
    },
    clearDisabled () {
      return this.multiselect ? !this.currentValue.length : !this.title?.length
    },
    filteredOptions () {
      let options = JSON.parse(JSON.stringify(this.options))
      options = this.isExternalSearch
        ? options
        : options.filter((item) => item[this.itemText].toUpperCase().includes(this.searchValue.toUpperCase()))
      return options
    },
    currentIds () {
      return this.returnObject ? this.currentValue.map((item) => item[this.itemValue]) : this.currentValue
    },
    title () {
      return this.options.find((item) => item[this.itemValue] === this.currentValue)?.[this.itemText] || ''
    },
    isExternalSearch () {
      return !!this.$attrs.onOnSearch
    },
  },
  mounted () {
    this.currentValue = this.value ?? this.modelValue ?? this.emptyValue
    this.list = this.$refs.list
    if (this.ignoreOverflow) document.body.appendChild(this.list)
    this.list.addEventListener('scroll', this.scrollList)
    this.silentValidate()
  },
  unmounted () {
    if (this.ignoreOverflow) this.list.parentNode.removeChild(this.list)
    document.removeEventListener('mousedown', this.documentClick)
    this.list.removeEventListener('scroll', this.scrollList)
  },
  watch: {
    error (val) {
      if (val) {
        this.shake = true
        setTimeout(() => {
          this.shake = false
        }, 260)
      }
    },
    value (val) {
      const emptyValue = JSON.parse(JSON.stringify(this.emptyValue))
      this.currentValue = val === undefined ? emptyValue : val
      this.silentValidate()
    },
    modelValue (val) {
      const emptyValue = JSON.parse(JSON.stringify(this.emptyValue))
      this.currentValue = val === undefined ? emptyValue : val
      this.silentValidate()
    },
    checkValid (val) {
      if (val) {
        this.validate()
      }
    },
  },
  methods: {
    clear () {
      const emptyValue = JSON.parse(JSON.stringify(this.emptyValue))
      if (!this.clearDisabled) {
        this.currentValue = emptyValue
        this.$emit('change', emptyValue)
        this.$emit('update:modelValue', emptyValue)
        this.clearCheckbox()
      }
    },

    scrollList () {
      const clientHeight = this.list.clientHeight
      const scrollHeight = this.list.scrollHeight
      const scrollTop = this.list.scrollTop
      if (clientHeight + scrollTop >= scrollHeight) {
        this.$emit('loadMore')
      }
    },

    clearCheckbox () {
      const nodeList = this.$refs.list.querySelectorAll('.checkbox')
      for (const element of nodeList) element.checked = false
    },

    onSearch (e) {
      this.searchValue = e.target.value
      this.$emit('onSearch', e)
    },

    selectItemMultiselect (e, value) {
      const val = this.returnObject ? JSON.parse(JSON.stringify(value)) : value[this.itemValue]
      if (e.target.checked) {
        this.currentValue.push(val)
      } else {
        this.currentValue = this.currentValue.filter((item) => {
          return this.returnObject ? item[this.itemValue] !== val[this.itemValue] : item !== val
        })
      }
      this.$emit('change', this.currentValue)
      this.$emit('update:modelValue', this.currentValue)
      this.clearValidation()
    },

    selectItem (e, value) {
      this.currentValue = this.returnObject ? JSON.parse(JSON.stringify(value)) : value[this.itemValue]
      setTimeout(() => {
        this.closeSelect()
      }, 0)
      this.$emit('change', this.currentValue)
      this.$emit('update:modelValue', this.currentValue)
      this.clearValidation()
    },

    toggleSelect (e) {
      if (this.isOpen) this.closeSelect()
      else this.openSelect()
    },

    isClickOutside (e) {
      return (
        e.target !== this.list &&
        !this.list.contains(e.target) &&
        e.target !== this.$refs.selectSection &&
        !this.$refs.selectSection.contains(e.target)
      )
    },

    documentClick (e) {
      if (this.isClickOutside(e)) {
        this.$emit('blur')
        this.isFocus = false
        if (this.isOpen) this.closeSelect()
        document.removeEventListener('mousedown', this.documentClick)
      }
    },

    focus () {
      this.openSelect()
    },

    positionList () {
      const size = this.$refs.selectSection.getBoundingClientRect()
      const listSize = this.list.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const distanceBottom = windowHeight - size.bottom
      if (distanceBottom < 310) this.list.style.top = size.top + window.scrollY - listSize.height - 5 + 'px'
      else this.list.style.top = size.top + window.scrollY + 50 + 'px'
      this.list.style.left = size.left + 'px'
      this.list.style.width = size.width + 'px'
      this.list.style.display = 'block'
    },

    openSelect () {
      if (this.ignoreOverflow) this.positionList()
      this.isOpen = true
      this.isFocus = true
      setTimeout(() => {
        document.addEventListener('mousedown', this.documentClick)
      }, 0)
    },

    closeSelect () {
      if (this.ignoreOverflow) this.list.style.left = '-9999px'
      this.isOpen = false
    },
    shakeIt () {
      this.shake = true
      setTimeout(() => {
        this.shake = false
      }, 260)
    },
    clearValidation () {
      this.isValid = true
      this.errorMessage = null
    },
    validate () {
      if (this.rules && !this.disableValidation && !this.disabled) {
        const value = this.modelValue ?? this.value
        for (let i = 0; i < this.rules.length; i++) {
          const res = this.rules[i](value)
          if (res !== true) {
            this.shakeIt()
            this.isValid = false
            this.errorMessage = res
            return
          }
        }
        this.clearValidation()
      }
    },
    //Валидация без подсветки ошибок, нужна для прокрутки к компоненту с ошибкой валидации
    silentValidate () {
      this.$nextTick(() => {
        if (this.rules && !this.disableValidation && !this.disabled) {
          const value = this.modelValue ?? this.value
          for (let i = 0; i < this.rules.length; i++) {
            if (this.rules[i](value) !== true) {
              this.silentIsValid = false
              return
            }
          }
          this.silentIsValid = true
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.select_container {
  position: relative;
  .select_section_wrapper {
    position: relative;
  }
  .select_section {
    height: 48px;
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    box-sizing: border-box;
    border: 1px solid #dadada;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    padding: 0 12px;
    cursor: pointer;
  }
  .select_wrap {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .title {
    font-size: 16px;
    &.grey {
      color: #c8c7cc;
    }
  }

  .invisible {
    visibility: hidden;
  }
  .chevron {
    transition: all 200ms ease-in-out;
    user-select: none;
    &.isOpen {
      transform: rotate(180deg);
    }
  }

  .clear_icon {
    width: 18px;
  }
  &.small {
    height: 40px;
  }
  &.error {
    .select_section {
      border-color: #fff6f5;
      background-color: #fff6f5;
    }
  }
  &.disabled {
    .select_section {
      opacity: 0.5;
      cursor: default;
      pointer-events: none;
    }
  }
  &.shake {
    animation: vertical-shaking 0.25s 1 ease-in-out;
  }
}
input {
  font-size: 16px;
}
.search_block {
  padding: 5px 13px 9px 13px;
}
.progress_wrap {
  position: absolute;
  width: 100%;
  height: 3px;
  left: 0;
  bottom: 0;
}
.list_progress_wrap {
  height: 5px;
  margin-top: 6px;
  position: sticky;
  bottom: 0;
}
.list_container {
  display: none;
  position: absolute;
  box-sizing: border-box;
  top: 56px;
  background-color: white;
  overflow: hidden;
  width: 100%;
  min-height: 30px;
  border-radius: 16px;
  z-index: 40;
  padding-top: 11px;
  box-shadow:
    0px 4px 20px 5px #1735f50a,
    0px -1px 4px 0px #1735f508;

  .list_items {
    overflow: auto;
    height: 100%;
    max-height: 270px;
  }
  .list_item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #263043;
    padding: 8px 15px;
    cursor: pointer;
    user-select: none;
    &:hover {
      background-color: #f2f8ff;
    }
  }
  .list_item_empty {
    color: #c8c7cc;
    padding: 8px 15px;
    user-select: none;
    font-size: 14px;
  }
  .checkbox {
    margin: 0;
    width: 16px;
    height: 16px;
  }
  &.isOpen {
    display: block;
  }
  &.ignoreOverflow {
    left: -9999px;
    z-index: 400;
  }
}
</style>

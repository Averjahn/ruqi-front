<template>
  <div ref="container" class="form-search-autocomplete">
    <Menu
      ref="Menu"
      v-model="isShowList"
      openMode="innerControl"
      widthAlign="button"
      horizontalAlign="leftBorder"
      :offsetY="8"
      :zIndex="zIndex"
    >
      <template #activator>
        <Input
          id="suggest"
          v-model="innerValue"
          :loading="loading"
          v-bind="$attrs"
          @click="showSuggestion"
          @input="onInput"
          autocomplete="off"
        >
          <template #left>
            <img src="@/assets/icons/magnifier.svg" />
          </template>
        </Input>
      </template>

      <div class="search_results scrollbar">
        <div v-for="(item, index) in items" :key="index" class="item-result" @click="selectItem(item.displayName)">
          {{ item.displayName }}
        </div>
      </div>
    </Menu>
  </div>
</template>

<script>
import { debounce } from '@/constants/helpers'
import { initYandexMap } from '@/plugins/ymapPlugin'
import { mapActions } from 'vuex'

export default {
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    zIndex: {
      type: Number,
      default: undefined,
    },
  },

  data () {
    return {
      loading: false,
      items: [],
      isShowList: false,
    }
  },
  computed: {
    innerValue: {
      get () {
        return this.modelValue || this.value
      },
      set (val) {
        this.$emit('update:modelValue', val)
        this.$emit('onInput', val)
        if (!val) {
          this.isShowList = false
          this.items = []
        }
      },
    },
  },
  watch: {
    isShowList (val) {
      if (val) {
        setTimeout(() => {
          document.addEventListener('click', this.closeSuggests)
        }, 0)
      } else {
        document.removeEventListener('click', this.closeSuggests)
      }
    },
  },
  mounted () {
    initYandexMap()
  },
  unmounted () {
    document.removeEventListener('click', this.closeSuggests)
  },
  methods: {
    ...mapActions('notifications', ['showNotification']),

    setItemsList: debounce(async function () {
      if (this.innerValue && window.ymaps) {
        this.loading = true
        const response = await window.ymaps.suggest(this.innerValue)
        if (Array.isArray(response)) {
          this.items = response
          this.isShowList = !!response.length
        } else {
          this.showNotification({ type: 'error', text: 'Ошибка Яндекс АПИ' })
        }
        this.loading = false
      }
    }, 400),

    onInput (e) {
      if (e?.target?.value) this.setItemsList()
    },

    showSuggestion () {
      if (this.items.length && this.innerValue.length) this.isShowList = true
    },

    selectItem (item) {
      this.innerValue = item
      this.isShowList = false
    },

    closeSuggests (e) {
      if (e.target !== this.$refs.container && !this.$refs.container.contains(e.target)) this.isShowList = false
    },
  },
}
</script>

<style lang="scss" scoped>
.form-search-autocomplete {
  position: relative;
}

#suggest {
  width: 100%;
}

.search_results {
  background: #fff;
  border-radius: 16px;
  padding: 12px 0;
  max-height: 300px;
  overflow: auto;
  box-shadow:
    0px 4px 20px 5px #1735f50a,
    0px -1px 4px 0px #1735f508;

  .item-result {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    min-height: 48px;
    cursor: pointer;
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);

    &:hover {
      background: #f6f6f6;
    }
  }
}
</style>

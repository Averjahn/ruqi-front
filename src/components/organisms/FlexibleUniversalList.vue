<template>
  <div class="universal_list">
    <div v-if="isAdaptive" class="adaptive_list">
      <div v-if="items.length" class="items_list">
        <div v-for="(item, index) in items" :key="index" class="item_card">
          <div v-for="(field, fieldIndex) in adaptiveConfig" :key="fieldIndex" class="field">
            <div v-if="field.label" class="field_label">{{ field.label }}</div>
            <div :class="{ clickable: field.clickable }" @click="field.clickable ? handleClick(item, field.key) : null">
              <div class="content_data">
                <Icon v-if="field.icon" class="label_icon" :size="20" :name="field.icon" />
                <span v-html="getFormattedValue(item, field)"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty_message">{{ emptyMessage }}</div>
    </div>
    <div v-else class="desktop_table">
      <table v-if="items.length" class="table">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index" class="row">
            <td v-for="col in columns" :key="col.key">
              <div
                :class="{ clickable: col.clickable }"
                @click="col.clickable ? handleClick(item, col.key) : null"
                v-html="getFormattedValue(item, col)"
              ></div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty_message">{{ emptyMessage }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlexibleUniversalList',
  props: {
    items: { type: Array, default: () => [] },
    columns: { type: Array, default: () => [] },
    adaptiveConfig: { type: Array, default: () => [] },
    onClick: { type: Function, default: () => {} },
    emptyMessage: { type: String, default: 'Нет данных' },
  },
  data () {
    return {
      isAdaptive: window.innerWidth <= 1000,
    }
  },
  mounted () {
    window.addEventListener('resize', this.checkAdaptive)
    this.checkAdaptive()
  },
  beforeUnmount () {
    window.removeEventListener('resize', this.checkAdaptive)
  },
  methods: {
    checkAdaptive () {
      this.isAdaptive = window.innerWidth <= 1000
    },
    handleClick (item, key) {
      this.onClick(item, key)
    },
    getFormattedValue (item, config) {
      let value = item[config.key]
      if (config.formatter) {
        value = config.formatter(value, item)
      } else if (config.render) {
        value = config.render(item)
      }
      return value ?? '-'
    },
  },
}
</script>

<style lang="scss" scoped>
.universal_list {
  width: 100%;
}

.adaptive_list {
  .items_list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .item_card {
    padding: 20px;
    border-radius: 16px;
    border: 1px solid #0000001a;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .field_label {
    color: #666;
    line-height: 22px;
  }
  .clickable {
    cursor: pointer;
    color: #1735f5;
  }
}

.desktop_table {
  border-radius: 8px;
  border: 1px solid #0000000f;
  overflow-x: auto;
  .table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;
    th {
      text-align: left;
      padding: 12px 16px;
      color: #666;
      font-weight: normal;
      border-bottom: 1px solid #eee;
    }
    td {
      padding: 16px;
    }
    tr:not(:last-child) td {
      border-bottom: 1px solid #0000001a;
    }
    th:not(:first-child) {
      position: relative;
      &::before {
        content: '';
        position: absolute;
        top: 20%;
        bottom: 20%;
        left: 0;
        width: 1px;
        background-color: #0000001a;
      }
    }
  }
  .row {
    transition: background-color 0.2s;
    &:hover {
      background-color: #f9f9f9;
    }
  }
  .clickable {
    cursor: pointer;
    color: #1735f5;
  }
}
.label_icon {
  color: #263043;
}

.content_data {
  display: flex;
  align-items: center;
  gap: 8px;
}

.empty_message {
  text-align: center;
  padding: 24px;
  color: #7a91a9;
}
</style>

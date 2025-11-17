<template>
  <div class="object-detail-content__tab-content">
    <!-- Search Bar -->
    <div class="object-detail-content__toolbar">
      <div class="object-detail-content__search">
        <Input
          v-model="contactsSearchQuery"
          placeholder="Поиск"
          class="object-detail-content__search-input"
          clearable
        >
          <template #left>
            <img src="@/assets/icon_deprecated/search.svg" alt="Search" class="object-detail-content__search-icon" />
          </template>
        </Input>
      </div>
    </div>

    <!-- Contacts Table -->
    <div class="object-detail-content__table-wrapper">
      <table class="object-detail-content__table">
        <thead>
          <tr>
            <th class="object-detail-content__th object-detail-content__th--name">
              ФИО
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="object-detail-content__sort-icon">
                <path d="M3 4.5L6 1.5L9 4.5M3 7.5L6 10.5L9 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </th>
            <th class="object-detail-content__th">Должность</th>
            <th class="object-detail-content__th">Телефон</th>
            <th class="object-detail-content__th">Email</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="contact in filteredContacts"
            :key="contact.id"
            class="object-detail-content__row"
          >
            <td class="object-detail-content__td object-detail-content__td--name">{{ contact.fullName || contact.name || '-' }}</td>
            <td class="object-detail-content__td">{{ contact.position || '-' }}</td>
            <td class="object-detail-content__td">{{ contact.phone || '-' }}</td>
            <td class="object-detail-content__td">{{ contact.email || '-' }}</td>
          </tr>
          <tr v-if="filteredContacts.length === 0" class="object-detail-content__row object-detail-content__row--empty">
            <td :colspan="4" class="object-detail-content__td">
              <p class="object-detail-content__empty">Нет контактов для отображения</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Input from '@/components/atoms/Input.vue'

export default {
  name: 'ContactsTab',
  components: {
    Input
  },
  props: {
    contacts: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      contactsSearchQuery: ''
    }
  },
  computed: {
    filteredContacts() {
      if (!this.contactsSearchQuery) return this.contacts
      const query = this.contactsSearchQuery.toLowerCase()
      return this.contacts.filter(contact =>
        (contact.fullName && contact.fullName.toLowerCase().includes(query)) ||
        (contact.position && contact.position.toLowerCase().includes(query)) ||
        (contact.phone && contact.phone.toLowerCase().includes(query)) ||
        (contact.email && contact.email.toLowerCase().includes(query))
      )
    }
  }
}
</script>

<style lang="scss" scoped>
// Стили наследуются от родительского компонента ObjectDetailContent
</style>


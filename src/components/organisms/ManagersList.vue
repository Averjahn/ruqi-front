<template>
  <div class="managers-list">
    <h2 class="managers-list__title">{{ title }}</h2>
    <div class="managers-list__cards">
      <ManagerCard
        v-for="(manager, index) in managers"
        :key="index"
        :name="manager.name"
        :role="manager.role"
        :phone="manager.phone"
        :email="manager.email"
        :avatar-url="manager.avatarUrl"
      />
    </div>
  </div>
</template>

<script>
import ManagerCard from '@/components/organisms/ManagerCard.vue'

export default {
  name: 'ManagersList',
  components: {
    ManagerCard
  },
  props: {
    title: {
      type: String,
      default: 'Менеджеры'
    },
    managers: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every(manager => 
          manager.name && 
          manager.phone && 
          manager.email
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.managers-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 10px;

  @media (max-width: 768px) {
    border-radius: 0;
  }

  &__title {
    font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
    font-weight: 600;
    font-style: normal;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0%;
    color: #000000;
    margin: 0;
  }

  &__cards {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
</style>


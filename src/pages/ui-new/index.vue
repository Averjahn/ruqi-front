<template>
  <div class="ui-new">
    <div class="ui-new__header">
      <h1>Ruki UI New</h1>
      <p>Новые компоненты для проекта Ruki</p>
      <div class="ui-new__stats">
        <div class="ui-new__stat">
          <strong>{{ componentStats.atoms }}</strong>
          <span>Atoms</span>
        </div>
        <div class="ui-new__stat">
          <strong>{{ componentStats.molecules }}</strong>
          <span>Molecules</span>
        </div>
        <div class="ui-new__stat">
          <strong>{{ componentStats.organisms }}</strong>
          <span>Organisms</span>
        </div>
        <div class="ui-new__stat">
          <strong>{{ componentStats.total }}</strong>
          <span>Total</span>
        </div>
      </div>
    </div>

    <div class="ui-new__navigation">
      <div class="ui-new__nav-item">
        <h2>Atoms</h2>
        <p>Базовые строительные блоки интерфейса</p>
        <Button type="contained" color="blue" @click="$router.push('/ui-new/atoms')">
          Перейти к Atoms
        </Button>
      </div>
      
      <div class="ui-new__nav-item">
        <h2>Molecules</h2>
        <p>Компоненты, состоящие из нескольких атомов</p>
        <Button type="contained" color="blue" @click="$router.push('/ui-new/molecules')">
          Перейти к Molecules
        </Button>
      </div>
      
      <div class="ui-new__nav-item">
        <h2>Organisms</h2>
        <p>Сложные блоки интерфейса</p>
        <Button type="contained" color="blue" @click="$router.push('/ui-new/organisms')">
          Перейти к Organisms
        </Button>
      </div>
    </div>

    <div class="ui-new__content">
      <div class="ui-new__info">
        <h2>Добро пожаловать в Ruki UI New!</h2>
        <p>Выберите категорию компонентов для просмотра:</p>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/atoms/Button.vue'

export default {
  name: 'UINew',
  components: {
    Button,
  },
  data() {
    return {
      componentStats: {
        atoms: 0,
        molecules: 0,
        organisms: 6,
        total: 6
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-new {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  &__header {
    margin-bottom: 40px;
    text-align: center;
    
    h1 {
      font-size: 3em;
      margin-bottom: 10px;
      color: #263043;
    }
    
    p {
      font-size: 1.3em;
      color: #666;
      margin-bottom: 30px;
    }
  }

  &__stats {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 60px;
    flex-wrap: wrap;
  }

  &__stat {
    text-align: center;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 12px;
    min-width: 100px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 1;
    
    strong {
      display: block;
      font-size: 2.5em;
      color: #007bff;
      margin-bottom: 5px;
    }
    
    span {
      font-size: 1.1em;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  }

  &__navigation {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-bottom: 60px;
    margin-top: 20px;
  }

  &__nav-item {
    padding: 40px;
    border: 2px solid #e8e8e8;
    border-radius: 16px;
    background: #fafafa;
    text-align: center;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    height: 100%;
    
    &:hover {
      border-color: #007bff;
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 123, 255, 0.1);
    }
    
    h2 {
      font-size: 2em;
      margin-bottom: 15px;
      color: #263043;
    }
    
    p {
      font-size: 1.1em;
      color: #666;
      margin-bottom: 25px;
      line-height: 1.6;
      flex-grow: 1;
    }
  }

  &__content {
    text-align: center;
  }

  &__info {
    h2 {
      font-size: 2.5em;
      margin-bottom: 20px;
      color: #263043;
    }
    
    p {
      font-size: 1.2em;
      color: #666;
    }
  }
}

// Адаптивность
@media (max-width: 768px) {
  .ui-new {
    padding: 15px;
    
    &__header {
      margin-bottom: 30px;
      
      h1 {
        font-size: 2.5em;
      }
      
      p {
        font-size: 1.1em;
      }
    }
    
    &__stats {
      gap: 15px;
      margin-bottom: 40px;
    }
    
    &__stat {
      padding: 15px;
      min-width: 80px;
      
      strong {
        font-size: 2em;
      }
      
      span {
        font-size: 1em;
      }
    }
    
    &__navigation {
      grid-template-columns: 1fr;
      gap: 20px;
      margin-bottom: 40px;
    }
    
    &__nav-item {
      padding: 30px 20px;
      
      h2 {
        font-size: 1.8em;
      }
      
      p {
        font-size: 1em;
      }
    }
    
    &__info {
      h2 {
        font-size: 2em;
      }
      
      p {
        font-size: 1.1em;
      }
    }
  }
}
</style>


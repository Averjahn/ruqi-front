<template>
  <div class="stepper">
    <!-- Блок с кружками и линиями -->
    <div class="stepper__points">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="stepper__point-item"
        :class="{
          'stepper__point-item--first': index === 0,
          'stepper__point-item--middle': index > 0 && index < steps.length - 1,
          'stepper__point-item--last': index === steps.length - 1
        }"
      >
        <div class="stepper__head">
          <!-- Точка -->
          <div class="stepper__point" :class="getPointClass(step.status)">
            <span class="stepper__point-number">{{ step.number }}</span>
            <!-- Обводка для активного шага -->
            <div v-if="step.status === 'active'" class="stepper__point-track"></div>
            <!-- Прогресс для активного шага -->
            <div v-if="step.status === 'active'" class="stepper__point-progress"></div>
          </div>
          
          <!-- Правая полулиния (для всех кроме последнего) -->
          <StepperLine
            v-if="index < steps.length - 1"
            :state="getLineState(step.status)"
            class="stepper__line stepper__line--right"
          />
        </div>
      </div>
    </div>
    
    <!-- Блок с текстами -->
    <div class="stepper__labels">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="stepper__label"
        :class="getLabelClass(step.status, index, steps.length)"
      >
        {{ step.label }}
      </div>
    </div>
  </div>
</template>

<script>
import StepperLine from '@/components/molecules/StepperLine.vue'

export default {
  name: 'Stepper',
  components: {
    StepperLine
  },
  props: {
    steps: {
      type: Array,
      required: true,
      validator: (steps) => {
        return steps.every(step => 
          step.number && 
          step.label && 
          ['active', 'waiting', 'completed'].includes(step.status)
        )
      }
    }
  },
  methods: {
    getPointClass(status) {
      return {
        'stepper__point--active': status === 'active',
        'stepper__point--waiting': status === 'waiting',
        'stepper__point--completed': status === 'completed'
      }
    },
    getLineState(currentStatus) {
      // Если шаг активен - линия наполовину синяя
      if (currentStatus === 'active') {
        return 'half-blue'
      }
      // Если шаг завершен - линия полностью синяя
      if (currentStatus === 'completed') {
        return 'blue'
      }
      // Если шаг ожидает - линия полностью серая
      return 'gray'
    },
    getLabelClass(status, index, total) {
      const classes = {
        'stepper__label--active': status === 'active',
        'stepper__label--waiting': status === 'waiting',
        'stepper__label--completed': status === 'completed'
      }
      
      // Первый шаг - выравнивание по левому краю
      if (index === 0) {
        classes['stepper__label--left'] = true
      }
      // Средний шаг - выравнивание по центру
      else if (index === 1 && total === 3) {
        classes['stepper__label--center'] = true
      }
      // Последний шаг - выравнивание по правому краю
      else if (index === total - 1) {
        classes['stepper__label--right'] = true
      }
      
      return classes
    },
  }
}
</script>

<style lang="scss" scoped>
.stepper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.stepper__points {
  display: flex;
  align-items: flex-start;
  gap: 0; // Без gap, линии должны стыковаться
  width: 100%;
}

.stepper__point-item {
  display: flex;
  position: relative;

  // Удаляем визуальный зазор между предыдущей линией и следующей точкой
  & + & {
    margin-left: 0;
  }

  // Первый элемент - растягивается
  &--first {
    flex: 1;
    min-width: 0;
  }
  
  // Средний элемент (второй шаг) - центрируется
  &--middle {
    flex: 1;
    min-width: 0;
    align-items: center;
    position: relative;
  }
  
  // Последний элемент - выравнивается по правому краю
  &--last {
    flex: 0 0 auto;
    align-items: flex-end;
  }
}

.stepper__head {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  
  // Для первого элемента
  .stepper__point-item--first & {
    justify-content: flex-start;
  }
  
  // Для среднего элемента - точка центрируется
  .stepper__point-item--middle & {
    justify-content: center;
  }
  
  // Для последнего элемента
  .stepper__point-item--last & {
    width: auto;
    justify-content: flex-end;
  }
}

.stepper__point {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 3; // Точка всегда поверх линий
  box-sizing: border-box;

  &--active {
    background: #1735f5;
    color: #ffffff;
  }

  &--waiting {
    background: #f1f1f1;
    color: #666666;
  }

  &--completed {
    background: #1735f5;
    color: #ffffff;
  }
}

.stepper__point-track {
  position: absolute;
  left: -4px;
  top: -4px;
  width: 40px;
  height: 40px;
  border-radius: 24px;
  // Серая часть обрамления такого же цвета, как серая линия stepper-line
  border: 2px solid #e3e5e4;
  z-index: 0;
  box-sizing: border-box;
}

.stepper__point-progress {
  position: absolute;
  left: -4px;
  top: -4px;
  width: 40px;
  height: 40px;
  border-radius: 24px;
  border: 2px solid #1735f5;
  border-right-color: transparent;
  border-bottom-color: transparent;
  // Левая и верхняя части остаются цветными — получаем половину кольца
  z-index: 1;
  transform: rotate(150deg);
  box-sizing: border-box;
}

.stepper__point-number {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  position: relative;
  z-index: 4;
}

.stepper__line {
  
  flex-shrink: 0;

  // Правая полулиния - начинается от точки и идет вправо
  &--right {
    position: relative;
    width: 50%;
    margin-left: 12px; // Отступ от точки справа (gap)
    margin-right: 12px;
    flex: 1; // Для растягивания на оставшееся пространство
    min-width: 50%; // Минимум 50% для визуального эффекта
  }
}

.stepper__labels {
  display: flex;
  justify-content: space-between;
}

.stepper__label {
  font-family: 'Source Sans 3', 'Source Sans Pro', 'Source Sans', sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 100%;
  white-space: nowrap;
  width: 200px;
  text-align: left;
  /* flex: 1; */

  &--active {
    color: #1735f5;
  }

  &--waiting {
    color: #666666;
    text-align: center;
  }

  &--completed {
    color: #1735f5;
  }
}

@media (max-width: 768px) {
  .stepper__points {
    flex-direction: column;
    gap: 16px;

    .stepper__point-item + .stepper__point-item {
      margin-left: 0;
    }

  }

  .stepper__line {
    display: none;
  }

  .stepper__labels {
    flex-direction: column;
    gap: 16px;
  }

  .stepper__label {
    text-align: left !important;
  }
}
</style>

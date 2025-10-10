<template>
  <div class="education_card">
    <div class="level">
      {{ education.level }}{{ education.level && education.graduation_year ? ',' : '' }}
      {{ education.graduation_year }}
    </div>
    <div class="institution">
      {{ education.institution }}
      <ButtonIconGhost class="edit_button" @click="$emit('edit', education.id)">
        <Icon name="pencil" :size="20" />
      </ButtonIconGhost>
    </div>
    <div class="faculty"><span class="label">Факультет:</span> {{ education.faculty }}</div>
    <div class="specialty"><span class="label">Специальность:</span> {{ education.specialty }}</div>
  </div>
</template>

<script>
export default {
  name: 'EducationCard',
  components: {},
  emits: ['edit'],
  props: {
    education: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      list: null,
    }
  },
  computed: {},
  mounted () {},
  unmounted () {},
  watch: {},
  methods: {
    open () {},
  },
}
</script>

<style lang="scss" scoped>
.education_card {
  display: grid;
  padding: 16px;
  border: 1px solid #0000001a;
  border-radius: 12px;
  grid-template-areas:
    'level institution'
    'level faculty'
    'level specialty';
  grid-template-columns: 1fr 2fr;
  row-gap: 4px;
  column-gap: 36px;
  .label {
    color: #666666;
  }
  .level {
    grid-area: level;
    color: #666666;
  }
  .institution {
    display: flex;
    justify-content: space-between;
    grid-area: institution;
    font-weight: 600;
  }
  .edit_button {
    color: #1735f5;
  }
  .faculty {
    grid-area: faculty;
  }
  .specialty {
    grid-area: specialty;
  }
  @media (max-width: 800px) {
    padding: 12px;
    grid-template-areas:
      'institution'
      'level'
      'faculty'
      'specialty';
    grid-template-columns: 1fr;
    .level,
    .faculty {
      margin-bottom: 4px;
    }
  }
}
</style>

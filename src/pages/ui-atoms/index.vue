<template>
  <div class="ui-atoms">
    <div class="ui-atoms__header">
      <h1>Atoms ({{ componentStats.atoms }})</h1>
      <p>Базовые строительные блоки интерфейса</p>
    </div>

    <div class="ui-atoms__content">
      <!-- Buttons -->
      <div class="ui-atoms__subsection">
        <h3>Buttons</h3>
        <div class="ui-atoms__showcase">
          <div class="ui-atoms__item">
            <h4>Button (Primary)</h4>
            <Button type="contained" color="blue">Primary Button</Button>
            <Button type="contained" color="blue" size="s">Small</Button>
            <Button type="contained" color="blue" size="l">Large</Button>
            <Button type="contained" disabled>Disabled</Button>
            <Button type="contained" loading>Loading</Button>
            <Button type="outlined" color="blue">Outlined Button</Button>
            <Button type="outlined" color="red">Red Outlined</Button>
            <Button type="outlined" color="grey">Grey Outlined</Button>
            <Button type="shadow" color="blue">Shadow Button</Button>
          </div>
          
          <div class="ui-atoms__item">
            <h4>ButtonText</h4>
            <ButtonText color="blue">Blue Text Button</ButtonText>
            <ButtonText color="green">Green Text Button</ButtonText>
            <ButtonText color="grey">Grey Text Button</ButtonText>
            <ButtonText color="telegram">Telegram Text Button</ButtonText>
            <ButtonText color="white">White Text Button</ButtonText>
            <ButtonText disabled>Disabled Text</ButtonText>
            <ButtonText loading>Loading Text</ButtonText>
          </div>
          
          <div class="ui-atoms__item">
            <h4>ButtonIcon</h4>
            <ButtonIcon type="contained" size="s">
              <Icon name="user" />
            </ButtonIcon>
            <ButtonIcon type="contained" size="m">
              <Icon name="user" />
            </ButtonIcon>
            <ButtonIcon type="contained" size="l">
              <Icon name="user" />
            </ButtonIcon>
            <ButtonIcon type="outlined" size="m">
              <Icon name="user" />
            </ButtonIcon>
            <ButtonIcon disabled>
              <Icon name="user" />
            </ButtonIcon>
            <ButtonIcon loading>
              <Icon name="user" />
            </ButtonIcon>
          </div>
          
          <div class="ui-atoms__item">
            <h4>ButtonIconGhost</h4>
            <ButtonIconGhost>
              <Icon name="heart" />
            </ButtonIconGhost>
          </div>
          
          <div class="ui-atoms__item">
            <h4>ButtonIconDeprecated</h4>
            <ButtonIconDeprecated>
              <Icon name="star" />
            </ButtonIconDeprecated>
            <ButtonIconDeprecated disabled>
              <Icon name="star" />
            </ButtonIconDeprecated>
          </div>
        </div>
      </div>

      <!-- Form Elements -->
      <div class="ui-atoms__subsection">
        <h3>Form Elements</h3>
        <div class="ui-atoms__showcase">
          <div class="ui-atoms__item">
            <h4>Input</h4>
            <Input v-model="inputValues.text" label="Default Input" placeholder="Enter text" />
            <Input v-model="inputValues.email" label="Email Input" type="email" placeholder="Enter email" />
            <Input v-model="inputValues.password" label="Password Input" type="password" placeholder="Enter password" />
            <Input v-model="inputValues.error" label="Error Input" error error-text="Error message" />
            <Input v-model="inputValues.disabled" label="Disabled Input" disabled value="Disabled" />
          </div>
          
          <div class="ui-atoms__item">
            <h4>Textarea</h4>
            <Textarea v-model="inputValues.textarea" label="Textarea" placeholder="Enter text" />
            <Textarea v-model="inputValues.textareaError" label="Error Textarea" error error-text="Error message" />
          </div>
          
          <div class="ui-atoms__item">
            <h4>Select</h4>
            <Select v-model="inputValues.select" label="Select" :options="selectOptions" />
            <Select v-model="inputValues.selectError" label="Error Select" error error-text="Error message" :options="selectOptions" />
          </div>
          
          <div class="ui-atoms__item">
            <h4>DatePicker</h4>
            <DatePicker v-model:date="inputValues.date" label="Date Picker" />
            <DatePicker v-model:date="inputValues.dateError" label="Error Date Picker" error error-text="Error message" />
          </div>
          
          <div class="ui-atoms__item">
            <h4>Checkbox</h4>
            <Checkbox v-model="checked1" label="Checkbox 1" />
            <Checkbox v-model="checked2" label="Checkbox 2" />
            <Checkbox v-model="checked3" label="Disabled Checkbox" disabled />
          </div>
          
          <div class="ui-atoms__item">
            <h4>Switch</h4>
            <Switch v-model="switch1" label="Switch 1" />
            <Switch v-model="switch2" label="Switch 2" />
            <Switch v-model="switch3" label="Disabled Switch" disabled />
          </div>
          
          <div class="ui-atoms__item">
            <h4>Radio</h4>
            <Radio v-model="radioValue" value="option1" label="Option 1" />
            <Radio v-model="radioValue" value="option2" label="Option 2" />
            <Radio v-model="radioValue" value="option3" label="Option 3" />
          </div>
          
          <div class="ui-atoms__item">
            <h4>ResendCodeTimer</h4>
            <div class="ui-atoms__timer-demo">
              <div class="ui-atoms__timer-item">
                <h5>Timer Active (Disabled)</h5>
                <ResendCodeTimer 
                  :duration="10" 
                  :auto-start="true"
                  @resend="handleResendCode"
                />
              </div>
              <div class="ui-atoms__timer-item">
                <h5>Timer Ready (Active)</h5>
                <ResendCodeTimer 
                  :duration="0" 
                  :auto-start="false"
                  @resend="handleResendCode"
                />
              </div>
              <div class="ui-atoms__timer-item">
                <h5>Custom Duration (30s)</h5>
                <ResendCodeTimer 
                  :duration="30" 
                  :auto-start="true"
                  @resend="handleResendCode"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Display Components -->
      <div class="ui-atoms__subsection">
        <h3>Display Components</h3>
        <div class="ui-atoms__showcase">
          <div class="ui-atoms__item">
            <h4>Badge</h4>
            <Badge type="info">Info</Badge>
            <Badge type="success">Success</Badge>
            <Badge type="warning">Warning</Badge>
            <Badge type="error">Error</Badge>
          </div>
          
          <div class="ui-atoms__item">
            <h4>Avatar</h4>
            <Avatar type="initials" :initials="'ИИ'" :width="48" />
            <Avatar type="photo" :photoUrl="null" :width="64" />
            <Avatar type="sign" :width="32" />
          </div>
          
          <div class="ui-atoms__item">
            <h4>Rating</h4>
            <Rating :rating="4.5" />
            <Rating :rating="3.2" :oneStar="true" />
          </div>
          
          <div class="ui-atoms__item">
            <h4>ProgressBar</h4>
            <ProgressBar :value="75" :targetValue="100" />
            <ProgressBar :value="30" :targetValue="50" />
          </div>
          
          <div class="ui-atoms__item">
            <h4>StepProgressBar</h4>
            <StepProgressBar :completedSteps="2" :totalSteps="5" />
            <StepProgressBar :completedSteps="4" :totalSteps="6" />
          </div>
          
          <div class="ui-atoms__item">
            <h4>Pagination</h4>
            <Pagination :totalPages="10" :currentPage="3" />
            <Pagination :totalPages="5" :currentPage="1" />
          </div>
          
          <div class="ui-atoms__item">
            <h4>Accordion</h4>
            <Accordion title="Заголовок аккордеона">
              <div>Содержимое аккордеона</div>
            </Accordion>
          </div>
        </div>
      </div>

      <!-- Banner Components -->
      <div class="ui-atoms__subsection">
        <h3>Banner Components</h3>
        <div class="ui-atoms__showcase">
          <div class="ui-atoms__item">
            <h4>BannerItem</h4>
            <BannerItem 
              icon="@/assets/icons/star.svg" 
              title="Заголовок баннера" 
              titleDescription="Описание заголовка"
              :content="{ value: '1000', action: 'Действие' }"
            />
          </div>
          
          <div class="ui-atoms__item">
            <h4>SocialBannerItem</h4>
            <SocialBannerItem 
              title="Социальные сети" 
              iconTg="@/assets/icons/telegram.svg"
              iconVk="@/assets/icons/vk.svg"
            />
          </div>
          
          <div class="ui-atoms__item">
            <h4>ViolationBannerItem</h4>
            <ViolationBannerItem 
              :isViolation="true"
              :totalViolations="3"
              cardIcon="@/assets/icons/warning.svg"
            />
          </div>
          
          <div class="ui-atoms__item">
            <h4>TopBannerDesktop</h4>
            <TopBannerDesktop 
              title="Заголовок баннера" 
              icon="@/assets/icons/star.svg"
            />
          </div>
          
          <div class="ui-atoms__item">
            <h4>TopBannerMobile</h4>
            <TopBannerMobile 
              title="Мобильный баннер" 
              icon="@/assets/icons/star.svg"
            />
          </div>
        </div>
      </div>

      <!-- Status and Labels -->
      <div class="ui-atoms__subsection">
        <h3>Status and Labels</h3>
        <div class="ui-atoms__showcase">
          <div class="ui-atoms__item">
            <h4>ProfessionLabel</h4>
            <ProfessionLabel profession="Водитель" size="m" />
            <ProfessionLabel profession="Грузчик" size="s" :checked="true" />
            <ProfessionLabel profession="Строитель" size="l" :counter="5" />
          </div>
          
          <div class="ui-atoms__item">
            <h4>SmzStatus</h4>
            <SmzStatus status="verified" />
            <SmzStatus status="pending" />
            <SmzStatus status="rejected" />
          </div>
          
          <div class="ui-atoms__item">
            <h4>ObjectLogo</h4>
            <ObjectLogo :size="48" />
            <ObjectLogo :size="64" :hidden="true" />
          </div>
        </div>
      </div>

      <!-- Interactive Components -->
      <div class="ui-atoms__subsection">
        <h3>Interactive Components</h3>
        <div class="ui-atoms__showcase">
          <div class="ui-atoms__item">
            <h4>Reveal</h4>
            <Reveal height="100px">
              <div>
                <p>Это содержимое, которое можно скрыть или показать.</p>
                <p>Дополнительный текст для демонстрации функциональности.</p>
                <p>Еще больше текста, чтобы показать работу компонента.</p>
              </div>
            </Reveal>
          </div>
          
          <div class="ui-atoms__item">
            <h4>HoverHighlighter</h4>
            <HoverHighlighter>
              <p>Наведите курсор на этот текст</p>
            </HoverHighlighter>
          </div>
          
          <div class="ui-atoms__item">
            <h4>ParallaxTilt</h4>
            <ParallaxTilt>
              <div style="padding: 20px; background: #f0f0f0; border-radius: 8px;">
                <p>Наведите курсор для эффекта наклона</p>
              </div>
            </ParallaxTilt>
          </div>
          
          <div class="ui-atoms__item">
            <h4>HorizontalScroll</h4>
            <HorizontalScroll>
              <div style="display: flex; gap: 10px; padding: 10px;">
                <div style="min-width: 100px; background: #e0e0e0; padding: 10px;">Элемент 1</div>
                <div style="min-width: 100px; background: #e0e0e0; padding: 10px;">Элемент 2</div>
                <div style="min-width: 100px; background: #e0e0e0; padding: 10px;">Элемент 3</div>
              </div>
            </HorizontalScroll>
          </div>
        </div>
      </div>

      <!-- Notifications and Popups -->
      <div class="ui-atoms__subsection">
        <h3>Notifications and Popups</h3>
        <div class="ui-atoms__showcase">
          <div class="ui-atoms__item">
            <h4>Notifications</h4>
            <Notifications :requestSuccess="true" />
          </div>
          
          <div class="ui-atoms__item">
            <h4>CookieConsent</h4>
            <CookieConsent />
            <p style="font-size: 12px; color: #666; margin-top: 10px;">
              Компонент показывается только если не принято согласие на cookies
            </p>
          </div>
          
          <div class="ui-atoms__item">
            <h4>PopupContainer</h4>
            <PopupContainer title="Тестовый контейнер">
              <p>Это содержимое попап контейнера</p>
            </PopupContainer>
          </div>
        </div>
      </div>

      <!-- Additional Components -->
      <div class="ui-atoms__subsection">
        <h3>Additional Components</h3>
        <div class="ui-atoms__showcase">
          <div class="ui-atoms__item">
            <h4>Icon</h4>
            <Icon name="user" />
            <Icon name="heart" />
            <Icon name="star" />
            <Icon name="settings" />
          </div>
          
          <div class="ui-atoms__item">
            <h4>Divider</h4>
            <Divider />
          </div>
          
          <div class="ui-atoms__item">
            <h4>Info</h4>
            <Info title="Информация" text="Это информационное сообщение" />
          </div>
          
          <div class="ui-atoms__item">
            <h4>InfoV2</h4>
            <InfoV2 title="Информация V2" text="Это информационное сообщение версии 2" />
          </div>
          
          <div class="ui-atoms__item">
            <h4>ThinLineLoading</h4>
            <ThinLineLoading :show="true" />
          </div>
          
          <div class="ui-atoms__item">
            <h4>LazyLoad</h4>
            <LazyLoad :callBack="lazyLoadCallback">
              <div style="padding: 20px; background: #f0f0f0; border-radius: 8px;">
                <p>Это содержимое загружается лениво</p>
              </div>
            </LazyLoad>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Импорты для атомов
import Accordion from '@/components/atoms/Accordion.vue'
import Avatar from '@/components/atoms/Avatar.vue'
import BannerItem from '@/components/atoms/BannerItem.vue'
import CookieConsent from '@/components/atoms/CookieConsent.vue'
import DatePickerRange from '@/components/atoms/DatePickerRange.vue'
import FieldMessage from '@/components/atoms/FieldMessage.vue'
import GlobalLoading from '@/components/atoms/GlobalLoading.vue'
import HorizontalScroll from '@/components/atoms/HorizontalScroll.vue'
import HoverHighlighter from '@/components/atoms/HoverHighlighter.vue'
import LoadingCirclesWater from '@/components/atoms/LoadingCirclesWater.vue'
import MonthDatePicker from '@/components/atoms/MonthDatePicker.vue'
import Notifications from '@/components/atoms/Notifications.vue'
import ObjectLogo from '@/components/atoms/ObjectLogo.vue'
import OtpInput from '@/components/atoms/OtpInput.vue'
import Pagination from '@/components/atoms/Pagination.vue'
import ParallaxTilt from '@/components/atoms/ParallaxTilt.vue'
import PopupContainer from '@/components/atoms/PopupContainer.vue'
import ProfessionLabel from '@/components/atoms/ProfessionLabel.vue'
import ProgressBar from '@/components/atoms/ProgressBar.vue'
import Radio from '@/components/atoms/Radio.vue'
import Rating from '@/components/atoms/Rating.vue'
import Reveal from '@/components/atoms/Reveal.vue'
import SmzStatus from '@/components/atoms/SmzStatus.vue'
import SocialBannerItem from '@/components/atoms/SocialBannerItem.vue'
import StepProgressBar from '@/components/atoms/StepProgressBar.vue'
import TopBannerDesktop from '@/components/atoms/TopBannerDesktop.vue'
import TopBannerDesktopSocial from '@/components/atoms/TopBannerDesktopSocial.vue'
import TopBannerMobile from '@/components/atoms/TopBannerMobile.vue'
import UniversalSelect from '@/components/atoms/UniversalSelect.vue'
import ViolationBannerItem from '@/components/atoms/ViolationBannerItem.vue'

export default {
  name: 'UIAtoms',
  components: {
    Accordion,
    Avatar,
    BannerItem,
    CookieConsent,
    DatePickerRange,
    FieldMessage,
    GlobalLoading,
    HorizontalScroll,
    HoverHighlighter,
    LoadingCirclesWater,
    MonthDatePicker,
    Notifications,
    ObjectLogo,
    OtpInput,
    Pagination,
    ParallaxTilt,
    PopupContainer,
    ProfessionLabel,
    ProgressBar,
    Radio,
    Rating,
    Reveal,
    SmzStatus,
    SocialBannerItem,
    StepProgressBar,
    TopBannerDesktop,
    TopBannerDesktopSocial,
    TopBannerMobile,
    UniversalSelect,
    ViolationBannerItem,
  },
  data() {
    return {
      // Form data
      inputValues: {
        text: '',
        email: '',
        password: '',
        error: '',
        disabled: '',
        textarea: '',
        textareaError: '',
        select: '',
        selectError: '',
        date: null,
        dateError: null
      },
      checked1: false,
      checked2: true,
      checked3: false,
      switch1: false,
      switch2: true,
      switch3: false,
      radioValue: 'option1',
      
      // Select options
      selectOptions: [
        { value: 'option1', text: 'Option 1' },
        { value: 'option2', text: 'Option 2' },
        { value: 'option3', text: 'Option 3' }
      ],
      
      // Component stats
      componentStats: {
        atoms: 45,
        molecules: 0,
        organisms: 0,
        total: 45
      }
    }
  },
  methods: {
    lazyLoadCallback() {
      // Безопасная обработка LazyLoad callback
      try {
        if (typeof console !== 'undefined' && console.log) {
          console.log('LazyLoad triggered')
        }
      } catch (error) {
        // Игнорируем ошибки в callback
      }
    },
    handleResendCode() {
      console.log('Resend code requested')
      // В реальном приложении здесь будет API вызов для повторной отправки SMS
    }
  },
  mounted() {
    // Мок для axios чтобы избежать ошибок API
    if (!this.$axios) {
      this.$axios = {
        get: (url) => {
          console.log('Mock axios.get called with:', url)
          return Promise.resolve({ 
            data: { 
              success: true, 
              data: {
                bonus: 0,
                referrals: [],
                link: 'mock-referral-link'
              }
            } 
          })
        },
        post: (url, data) => {
          console.log('Mock axios.post called with:', url, data)
          return Promise.resolve({ 
            data: { 
              success: true, 
              data: {} 
            } 
          })
        }
      }
    }
    
    // Мок для глобальных функций
    if (typeof window !== 'undefined') {
      window.RqloggerError = window.RqloggerError || function() {
        console.warn('RqloggerError called:', arguments)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-atoms {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  &__header {
    margin-bottom: 40px;
    
    h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
      color: #263043;
    }
    
    p {
      font-size: 1.2em;
      color: #666;
    }
  }

  &__subsection {
    margin-bottom: 60px;
    
    h3 {
      font-size: 1.8em;
      margin-bottom: 20px;
      color: #263043;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
  }

  // Timer Demo Styles
  &__timer-demo {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__timer-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    h5 {
      font-size: 14px;
      font-weight: 500;
      color: #666;
      margin: 0;
    }
  }

  &__showcase {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }

  &__item {
    padding: 24px;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    background: #fafafa;
    
    h4 {
      font-size: 1.2em;
      margin-bottom: 15px;
      color: #263043;
    }
    
    > * + * {
      margin-top: 10px;
    }
  }
}
</style>

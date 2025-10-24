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
          
          <div class="ui-atoms__item">
            <h4>CopyButton</h4>
            <div class="copy-button-demo">
              <CopyButton 
                type="outline" 
                icon="documentCopy"
                :data-to-copy="'ID заявки: 12345\nСтатус: В обработке\nДата: 14.10.2024'"
                @copy="onCopySuccess"
                @error="onCopyError"
              />
            
              <CopyButton 
                type="outline" 
                icon="documentCopy"
                :data-to-copy="'ID заявки: 12345\nСтатус: В обработке\nДата: 14.10.2024'"
                :loading="true"
                @copy="onCopySuccess"
                @error="onCopyError"
              />
              <CopyButton 
                type="outline" 
                icon="documentCopy"
                :data-to-copy="'ID заявки: 12345\nСтатус: В обработке\nДата: 14.10.2024'"
                :disabled="true"
                @copy="onCopySuccess"
                @error="onCopyError"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- MainButton - Design System -->
      <div class="ui-atoms__subsection">
        <h3>MainButton - Design System</h3>
        <div class="ui-atoms__showcase">
          <div class="ui-atoms__item">
            <h4>Primary</h4>
            <div class="main-button-demo__states">
              <MainButton type="primary" text="Button" left-icon="heart" right-icon="magnifier" />
              <MainButton type="primary" text="Button" left-icon="heart" right-icon="magnifier" disabled />
              <MainButton type="primary" text="Button" left-icon="heart" right-icon="magnifier" loading />
            </div>
          </div>
          
          <div class="ui-atoms__item">
            <h4>Error</h4>
            <div class="main-button-demo__states">
              <MainButton type="error" text="Button" left-icon="heart" right-icon="magnifier" />
              <MainButton type="error" text="Button" left-icon="heart" right-icon="magnifier" disabled />
              <MainButton type="error" text="Button" left-icon="heart" right-icon="magnifier" loading />
            </div>
          </div>
          
          <div class="ui-atoms__item">
            <h4>Neutral</h4>
            <div class="main-button-demo__states">
              <MainButton type="neutral" text="Button" left-icon="heart" right-icon="magnifier" />
              <MainButton type="neutral" text="Button" left-icon="heart" right-icon="magnifier" disabled />
              <MainButton type="neutral" text="Button" left-icon="heart" right-icon="magnifier" loading />
            </div>
          </div>
          
          <div class="ui-atoms__item">
            <h4>Primary Outline</h4>
            <div class="main-button-demo__states">
              <MainButton type="primary-outline" text="Button" left-icon="heart" right-icon="magnifier" />
              <MainButton type="primary-outline" text="Button" left-icon="heart" right-icon="magnifier" disabled />
              <MainButton type="primary-outline" text="Button" left-icon="heart" right-icon="magnifier" loading />
            </div>
          </div>
          
          <div class="ui-atoms__item">
            <h4>Error Outline</h4>
            <div class="main-button-demo__states">
              <MainButton type="error-outline" text="Button" left-icon="heart" right-icon="magnifier" />
              <MainButton type="error-outline" text="Button" left-icon="heart" right-icon="magnifier" disabled />
              <MainButton type="error-outline" text="Button" left-icon="heart" right-icon="magnifier" loading />
            </div>
          </div>
          
          <div class="ui-atoms__item">
            <h4>Primary White</h4>
            <div class="main-button-demo__states">
              <MainButton type="primary-white" text="Button" left-icon="heart" right-icon="magnifier" />
              <MainButton type="primary-white" text="Button" left-icon="heart" right-icon="magnifier" disabled />
              <MainButton type="primary-white" text="Button" left-icon="heart" right-icon="magnifier" loading />
            </div>
          </div>
        </div>
      </div>

      <!-- Upload -->
      <div class="ui-atoms__subsection">
        <h3>Upload</h3>
        <div class="ui-atoms__showcase">
          <div class="ui-atoms__item">
            <h4>Файлы</h4>
            <Upload v-model="uploadFiles" label="Загрузите документы" :max-size-m-b="50" />
          </div>
        </div>
      </div>

      <!-- Spinner -->
      <div class="ui-atoms__subsection">
        <h3>Spinner</h3>
        <div class="ui-atoms__showcase">
            <div class="ui-atoms__item">
              <h4>Loading Spinner</h4>
              <Spinner />
            </div>
          </div>
        </div>

        <!-- Snackbar -->
        <div class="ui-atoms__subsection">
          <h3>Snackbar</h3>
          <div class="ui-atoms__showcase">
            <div class="ui-atoms__item ui-atoms__item--wide">
              <h4>JobCard Skeleton</h4>
              <div class="snackbar-card-demo">
                <SkeletonJobCard />
              </div>
            </div>
          </div>
        </div>

        <!-- Toast -->
        <div class="ui-atoms__subsection">
          <h3>Toast</h3>
          <div class="ui-atoms__showcase">
            <div class="ui-atoms__item ui-atoms__item--wide">
              <h4>Toast Notifications</h4>
              <div class="toast-demo">
                <ToastDemo />
              </div>
            </div>
          </div>
        </div>

        <!-- Notification Blocks Demo -->
        <div class="ui-atoms__subsection">
          <h3>Notification Blocks Demo</h3>
          <div class="ui-atoms__showcase">
            <div class="ui-atoms__item ui-atoms__item--wide">
              <h4>All Notification States</h4>
              <div class="notification-blocks-demo">
                <ModalNotification 
                  v-for="state in notificationStates" 
                  :key="state"
                  :state="state"
                  @action="onNotificationAction"
                  class="notification-blocks-demo__item"
                />
              </div>
            </div>
            <div class="ui-atoms__item ui-atoms__item--wide">
              <h4>ModalNotification Skeleton</h4>
              <div class="notification-blocks-demo">
                <SkeletonModalNotification class="notification-blocks-demo__item" />
              </div>
            </div>
          </div>
        </div>

        <!-- Multiselect -->
        <div class="ui-atoms__subsection">
          <h3>Multiselect</h3>
          <div class="ui-atoms__showcase">
            <div class="ui-atoms__item">
              <h4>Multiselect States</h4>
              <div class="multiselect-demo">
                <div class="multiselect-demo__row">
                  <h5>Off (Empty)</h5>
                  <Multiselect 
                    placeholder="Placeholder"
                    v-model="multiselectEmpty"
                    label="Label"
                  />
                </div>
                <div class="multiselect-demo__row">
                  <h5>On (Filled)</h5>
                  <Multiselect 
                    placeholder="Placeholder"
                    v-model="multiselectFilled"
                    label="Label"
                  />
                </div>
                <div class="multiselect-demo__row">
                  <h5>Error State</h5>
                  <Multiselect 
                    placeholder="Placeholder"
                    v-model="multiselectError"
                    :error="true"
                    error-message="Prompt"
                    label="Label"
                  />
                </div>
                <div class="multiselect-demo__row">
                  <h5>Disabled State</h5>
                  <Multiselect 
                    placeholder="Placeholder"
                    v-model="multiselectDisabled"
                    :disabled="true"
                    label="Label"
                  />
                </div>
              </div>
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

      <!-- Toast Notifications -->
      <div class="ui-atoms__subsection">
        <h3>Toast Notifications</h3>
        <div class="ui-atoms__showcase ui-atoms__showcase--single">
          <div class="ui-atoms__item ui-atoms__item--wide">
            <h4>ToastDemo</h4>
            <ToastDemo />
          </div>
        </div>
      </div>

      <!-- Display Components -->
      <div class="ui-atoms__subsection">
        <h3>Display Components</h3>
        <div class="ui-atoms__showcase">
          <div class="ui-atoms__item ui-atoms__item--wide">
            <h4>Auth Tabs</h4>
            <AuthTabs :value="demoAuthTab" :old-method="demoOldMethod" @change="demoAuthTab = $event" />
          </div>
          <div class="ui-atoms__item ui-atoms__item--wide">
            <h4>Auth Phone Request API</h4>
            <AuthPhoneRequest />
          </div>
          <div class="ui-atoms__item">
            <h4>Auth Logo Header</h4>
            <AuthLogoHeader title="Вход в систему" />
          </div>
          <div class="ui-atoms__item">
            <h4>Auth Password Form (Demo)</h4>
            <AuthPasswordForm v-model="authForm" :loading="false" @submit="()=>{}" />
          </div>
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
            <h4>FooterInfo</h4>
            <FooterInfo text="Это информационный текст для футера страницы. Компонент автоматически адаптируется по высоте в зависимости от содержимого." />
            <FooterInfo text="Короткий текст" />
            <FooterInfo text="Очень длинный текст, который может занимать несколько строк и демонстрирует, как компонент адаптируется по высоте в зависимости от количества текста. Это полезно для различных информационных сообщений на страницах авторизации, регистрации и других формах." />
          </div>
          
          <div class="ui-atoms__item">
            <h4>AgreementCheck</h4>
            <AgreementCheck
              v-model="demoAgreement1"
              text="Я ознакомился (-ась) и согласен (-на) с"
              link-text="политикой в отношении обработки персональных данных"
              link-route="/privacy-policy"
            />
            <AgreementCheck
              v-model="demoAgreement2"
              text="Я ознакомился(-ась) и даю"
              link-text="согласие на обработку моих персональных данных"
              link-route="/personal"
            />
            <AgreementCheck
              v-model="demoAgreement3"
              text="Согласен с"
              link-text="условиями использования"
              link-route="/terms"
            />
          </div>
          
          <div class="ui-atoms__item">
            <h4>ThinLineLoading</h4>
            <ThinLineLoading :show="true" />
          </div>
          
          <div class="ui-atoms__item">
            <h4>Spinner</h4>
            <Spinner />
          </div>
          
          <div class="ui-atoms__item">
            <h4>DotsFlowLoader</h4>
            <DotsFlowLoader />
          </div>
          
          <div class="ui-atoms__item">
            <h4>DotsLoader</h4>
            <DotsLoader />
          </div>
          
          <div class="ui-atoms__item">
            <h4>LoadingCirclesWater</h4>
            <LoadingCirclesWater />
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
    
    <!-- Test Popup - moved to bottom -->
    <!-- <div class="ui-atoms__test-popup">
      <h4>PopupContainer</h4>
      <PopupContainer title="Тестовый контейнер">
        <p>Это содержимое попап контейнера</p>
      </PopupContainer>
    </div> -->
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
import MainButton from '@/components/atoms/MainButton.vue'
import DotsFlowLoader from '@/components/atoms/loaders/DotsFlowLoader.vue'
import DotsLoader from '@/components/atoms/loaders/DotsLoader.vue'
import Skeleton from '@/components/atoms/Skeleton.vue'
import Snackbar from '@/components/atoms/Snackbar.vue'
import CopyButton from '@/components/atoms/CopyButton.vue'
import Spinner from '@/components/atoms/Spinner.vue'
import SkeletonJobCard from '@/components/atoms/SkeletonJobCard.vue'
import SkeletonModalNotification from '@/components/atoms/SkeletonModalNotification.vue'
import Multiselect from '@/components/atoms/Multiselect.vue'
import ModalNotification from '@/components/molecules/ModalNotification.vue'
import MonthDatePicker from '@/components/atoms/MonthDatePicker.vue'
import Notifications from '@/components/atoms/Notifications.vue'
import ToastDemo from '@/components/atoms/ToastDemo.vue'
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
import AuthLogoHeader from '@/components/molecules/AuthLogoHeader.vue'
import AuthPasswordForm from '@/components/molecules/AuthPasswordForm.vue'
import AuthTabs from '@/components/molecules/AuthTabs.vue'
import AuthPhoneRequest from '@/components/molecules/AuthPhoneRequest.vue'
import Upload from '@/components/atoms/Upload.vue'

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
    MainButton,
    DotsFlowLoader,
    DotsLoader,
    Skeleton,
    Snackbar,
    CopyButton,
    Spinner,
    Upload,
    SkeletonJobCard,
    SkeletonModalNotification,
    Multiselect,
    ModalNotification,
    MonthDatePicker,
    Notifications,
    ToastDemo,
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
    AuthLogoHeader,
    AuthPasswordForm,
    AuthTabs,
    AuthPhoneRequest,
    Upload,
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
      
      // AgreementCheck demo data
      demoAgreement1: false,
      demoAgreement2: false,
      demoAgreement3: true,
      
      // Multiselect data
      multiselectEmpty: [],
      multiselectFilled: ['programmer', 'designer'],
      multiselectError: [],
      multiselectDisabled: ['programmer'],
      uploadFiles: [],
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
      },
      notificationStates: [
        'Отклик не может быть отправлен',
        'Ваши данные приняты',
        'Требуется паспорт',
        'Отклик на работу',
        'Истек срок паспорта',
        'State6',
        'документ о Регистрации РФ',
        'Загрузите Патент'
      ],
      uploadFiles: [],
      authForm: { phone_or_email: '', password: '' },
      demoAuthTab: 'by_password',
      demoOldMethod: false
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
    onCopySuccess(data) {
      console.log('Данные скопированы:', data)
      // Здесь можно показать уведомление об успешном копировании
    },
    onCopyError(error) {
      console.error('Ошибка копирования:', error)
      // Здесь можно показать уведомление об ошибке
    },
    onTimerEnd() {
      console.log('Таймер подбора завершился')
      // Здесь можно добавить логику для обработки окончания таймера
    },
    onNotificationAction(action) {
      console.log('Notification action:', action)
      // Здесь можно добавить логику для обработки действий уведомлений
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
    // padding: 24px;
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
    
    &--wide {
      grid-column: 1 / -1;
      max-width: none;
    }
  }
  
  &__test-popup {
    margin-top: 40px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 2px dashed #dee2e6;
    
    h4 {
      font-size: 1.2em;
      margin-bottom: 15px;
      color: #263043;
    }
  }
}

// MainButton Demo Styles
.main-button-demo__states {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

// Snackbar Demo Styles
.snackbar-demo {
  display: flex;
  gap: 12px;
  align-items: center;
}

.snackbar-card-demo {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  max-width: 800px;
}

  .copy-button-demo {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
  }

// Multiselect Demo Styles
.multiselect-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  &__row {
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
}

.notification-blocks-demo {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 800px;
    
    &__item {
      margin-bottom: 0;
    }
  }

</style>

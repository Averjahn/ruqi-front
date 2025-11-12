# Документация компонентов UI-Kit

Документация по компонентам, используемым в разделах `ui-new/profile`, `FAQ` и `notifications`.

## Содержание

1. [Модальные окна смены пароля](#модальные-окна-смены-пароля)
2. [Компоненты профиля](#компоненты-профиля)
3. [Базовые компоненты](#базовые-компоненты)
4. [Компоненты фильтрации](#компоненты-фильтрации)
5. [Карточки документов](#карточки-документов)

---

## Модальные окна смены пароля

### ChangePasswordModal

Модальное окно для выбора способа смены пароля.

**Расположение:** `@/components/organisms/popups/ChangePasswordModal.vue`

**Использование:**
```vue
<Popup :show="showChangePasswordModal" @update:show="showChangePasswordModal = $event">
  <ChangePasswordModal
    @close="showChangePasswordModal = false"
    @select-option="handlePasswordOptionSelect"
  />
</Popup>
```

**Props:** Нет

**Events:**
- `close` - закрытие модального окна
- `select-option` - выбор способа смены пароля (значение: `'current-password' | 'phone' | 'email'`)

**Особенности:**
- Использует `BaseModal` для базовой структуры
- Три варианта смены пароля: через текущий пароль, через телефон, через email
- Вариант "Через телефон" выделен по умолчанию

---

### ChangePasswordPhoneModal

Модальное окно для ввода номера телефона при смене пароля.

**Расположение:** `@/components/organisms/popups/ChangePasswordPhoneModal.vue`

**Использование:**
```vue
<Popup :show="showChangePasswordPhoneModal" @update:show="showChangePasswordPhoneModal = $event">
  <ChangePasswordPhoneModal
    @close="showChangePasswordPhoneModal = false"
    @get-code="handleGetCode"
  />
</Popup>
```

**Props:** Нет

**Events:**
- `close` - закрытие модального окна
- `get-code` - получение кода (передает номер телефона)

**Особенности:**
- Автоматическое форматирование номера телефона
- Максимальная ширина: 560px
- Валидация номера телефона (минимум 11 цифр)

---

### ChangePasswordCodeModal

Модальное окно для ввода кода подтверждения из Telegram.

**Расположение:** `@/components/organisms/popups/ChangePasswordCodeModal.vue`

**Использование:**
```vue
<Popup :show="showChangePasswordCodeModal" @update:show="showChangePasswordCodeModal = $event">
  <ChangePasswordCodeModal
    :phone="changePasswordPhone"
    @close="showChangePasswordCodeModal = false"
    @back="handleCodeModalBack"
    @continue="handleCodeContinue"
    @resend-code="handleResendCode"
  />
</Popup>
```

**Props:**
- `phone` (String, required) - номер телефона для отображения

**Events:**
- `close` - закрытие модального окна
- `back` - возврат к предыдущему шагу
- `continue` - продолжение с введенным кодом
- `resend-code` - повторная отправка кода

**Особенности:**
- Таймер обратного отсчета на 3 минуты (180 секунд)
- Валидация кода (минимум 4 символа)
- Автоматическое форматирование номера телефона для отображения

---

### ChangePasswordNewPasswordModal

Модальное окно для установки нового пароля.

**Расположение:** `@/components/organisms/popups/ChangePasswordNewPasswordModal.vue`

**Использование:**
```vue
<Popup :show="showChangePasswordNewPasswordModal" @update:show="showChangePasswordNewPasswordModal = $event">
  <ChangePasswordNewPasswordModal
    @close="showChangePasswordNewPasswordModal = false"
    @back="handleNewPasswordModalBack"
    @confirm="handlePasswordConfirm"
  />
</Popup>
```

**Props:** Нет

**Events:**
- `close` - закрытие модального окна
- `back` - возврат к предыдущему шагу
- `confirm` - подтверждение нового пароля (передает объект `{ password, confirmPassword }`)

**Особенности:**
- Валидация пароля:
  - Минимум 8 символов
  - Заглавные и строчные буквы
  - Хотя бы одна цифра
  - Специальные символы
  - Совпадение паролей
- Блок с требованиями к паролю
- Максимальная ширина: 560px

---

## Компоненты профиля

### ProfileMenu

Боковое меню навигации по разделам профиля.

**Расположение:** `@/components/organisms/ProfileMenu.vue`

**Использование:**
```vue
<ProfileMenu
  :active-item="activeProfileMenuItem"
  @item-click="handleProfileMenuClick"
  @update:active-item="activeProfileMenuItem = $event"
/>
```

**Props:**
- `activeItem` (String, default: `null`) - ID активного пункта меню
- `menuItems` (Array, default: массив пунктов меню) - список пунктов меню

**Events:**
- `item-click` - клик по пункту меню (передает объект пункта)
- `update:activeItem` - обновление активного пункта

**Структура menuItems:**
```javascript
{
  id: 'account', // ID пункта
  icon: require('@/assets/icons/profile/tabs/Shield-task.svg'), // Путь к иконке
  text: 'Учетная запись' // Текст пункта
}
```

**Особенности:**
- Адаптивная ширина (290px на десктопе, 100% на мобильных)
- Подсветка активного пункта
- Hover эффекты

---

### ProfileActions

Кнопки действий профиля (смена пароля, выход).

**Расположение:** `@/components/organisms/ProfileActions.vue`

**Использование:**
```vue
<ProfileActions
  @change-password="handleChangePassword"
  @logout="handleLogout"
/>
```

**Props:** Нет

**Events:**
- `change-password` - клик по кнопке "Сменить пароль"
- `logout` - клик по кнопке "Выйти из аккаунта"

**Особенности:**
- Две кнопки с иконками
- Адаптивные стили:
  - Мобильная версия: border, padding 0 16px, иконки 24px/20px
  - ПК версия: без border, padding 24px, иконки 40x40px, font-size 20px, margin-top 16px

---

### ProfileHeader

Заголовок профиля с именем пользователя.

**Расположение:** `@/components/organisms/ProfileHeader.vue`

**Использование:**
```vue
<ProfileHeader name="Джон МакКлейн" />
```

**Props:**
- `name` (String, required) - имя пользователя

**Events:** Нет

---

### PersonalData

Компонент для отображения и редактирования персональных данных.

**Расположение:** `@/components/organisms/PersonalData.vue`

**Использование:**
```vue
<PersonalData
  :personal-data="personalData"
  :contacts="contacts"
  @edit="handlePersonalDataEdit"
  @save="handlePersonalDataSave"
  @cancel="handlePersonalDataCancel"
  @phone-click="handlePhoneClick"
  @email-click="handleEmailClick"
  @telegram-link="handleTelegramLink"
/>
```

**Props:**
- `personalData` (Object, required) - объект с персональными данными
- `contacts` (Object, required) - объект с контактами

**Events:**
- `edit` - начало редактирования
- `save` - сохранение данных
- `cancel` - отмена редактирования
- `phone-click` - клик по телефону
- `email-click` - клик по email
- `telegram-link` - клик по ссылке Telegram

---

### OrganisationDataContent

Контент раздела "Об организации" с формой и документами.

**Расположение:** `@/components/organisms/OrganisationDataContent.vue`

**Использование:**
```vue
<OrganisationDataContent
  :form-data="organisationFormData"
  @update:form-data="organisationFormData = $event"
  :counterparty-types="counterpartyTypes"
  @data-filled="handleOrganisationDataFilled"
  @save="handleOrganisationSave"
  @cancel="handleOrganisationCancel"
/>
```

**Props:**
- `formData` (Object, required) - данные формы
- `counterpartyTypes` (Array, default: массив типов контрагентов) - типы контрагентов

**Events:**
- `update:form-data` - обновление данных формы
- `data-filled` - данные заполнены (например, через DaData)
- `save` - сохранение данных
- `cancel` - отмена

**Особенности:**
- Две вкладки: "Данные об организации" и "Документы"
- Интеграция с DaData для автозаполнения по ИНН
- Адаптивные кнопки действий:
  - Мобильная версия: по центру, на всю ширину
  - ПК версия: справа, с верхней границей

---

### ActsContent

Контент раздела "Акты" со списком актов и фильтрами.

**Расположение:** `@/components/organisms/ActsContent.vue`

**Использование:**
```vue
<ActsContent
  :acts="acts"
  :total-count="actsTotalCount"
  @sign="handleActSign"
  @download="handleActDownload"
  @page-change="handleActPageChange"
  @filter-change="handleFilterChange"
/>
```

**Props:**
- `acts` (Array, default: `[]`) - массив актов
- `totalCount` (Number, default: `0`) - общее количество актов

**Events:**
- `sign` - подписание акта
- `download` - скачивание акта
- `page-change` - изменение страницы пагинации
- `filter-change` - изменение фильтров

**Особенности:**
- Фильтры: поиск, дата, статус
- Мобильная версия: кнопка "Фильтры" открывает FilterModal
- Пагинация скрыта на мобильных устройствах
- Адаптивный дизайн

---

### ContractsWithPerformersContent

Контент раздела "Договора с исполнителями" со списком договоров и фильтрами.

**Расположение:** `@/components/organisms/ContractsWithPerformersContent.vue`

**Использование:**
```vue
<ContractsWithPerformersContent
  :contracts="contracts"
  :total-count="contractsTotalCount"
  @sign="handleContractSign"
  @download="handleContractDownload"
  @page-change="handleContractPageChange"
  @filter-change="handleFilterChange"
/>
```

**Props:**
- `contracts` (Array, default: `[]`) - массив договоров
- `totalCount` (Number, default: `0`) - общее количество договоров

**Events:**
- `sign` - подписание договора
- `download` - скачивание договора
- `page-change` - изменение страницы пагинации
- `filter-change` - изменение фильтров

**Особенности:**
- Фильтры: поиск, диапазон дат, статус
- Мобильная версия: кнопка "Фильтры" открывает FilterModal
- Адаптивный дизайн

---

### ElectronicSignatureContent

Контент раздела "Электронная подпись".

**Расположение:** `@/components/organisms/ElectronicSignatureContent.vue`

**Использование:**
```vue
<ElectronicSignatureContent
  @archive="handleSignatureArchive"
/>
```

**Props:** Нет

**Events:**
- `archive` - архивирование сертификата

---

## Базовые компоненты

### ModalHeader

Базовый компонент заголовка модального окна.

**Расположение:** `@/components/molecules/ModalHeader.vue`

**Использование:**
```vue
<ModalHeader
  title="Заголовок модального окна"
  @close="$emit('close')"
/>
```

**Props:**
- `title` (String, required) - заголовок модального окна

**Events:**
- `close` - закрытие модального окна

**Особенности:**
- Единообразный стиль заголовка для всех модальных окон
- Кнопка закрытия с иконкой

---

### ModalContent

Базовый компонент контента модального окна.

**Расположение:** `@/components/molecules/ModalContent.vue`

**Использование:**
```vue
<ModalContent variant="default">
  <!-- Контент модального окна -->
</ModalContent>
```

**Props:**
- `variant` (String, default: `'default'`) - вариант стиля (`'default' | 'compact'`)

**Особенности:**
- `default`: gap 24px
- `compact`: gap 16px

---

### BaseModal

Базовый компонент модального окна.

**Расположение:** `@/components/molecules/BaseModal.vue`

**Использование:**
```vue
<BaseModal
  title="Заголовок"
  variant="default"
  content-variant="default"
  @close="$emit('close')"
>
  <!-- Контент -->
  <template #actions>
    <!-- Кнопки действий -->
  </template>
</BaseModal>
```

**Props:**
- `title` (String, required) - заголовок модального окна
- `variant` (String, default: `'default'`) - вариант стиля (`'default' | 'compact'`)
- `contentVariant` (String, default: `'default'`) - вариант стиля контента

**Events:**
- `close` - закрытие модального окна

**Slots:**
- `default` - основной контент
- `actions` - кнопки действий

**Особенности:**
- Использует `ModalHeader` и `ModalContent`
- Адаптивные стили (max-width: 800px на десктопе, calc(100vw - 32px) на мобильных)
- Единообразная структура для всех модальных окон

---

## Компоненты фильтрации

### FilterModal

Модальное окно фильтров для мобильной версии.

**Расположение:** `@/components/organisms/popups/FilterModal.vue`

**Использование:**
```vue
<FilterModal
  :show="showFilterModal"
  :date="selectedDate"
  :status="selectedStatus"
  @close="showFilterModal = false"
  @apply="handleFilterApply"
  @reset="handleFilterReset"
  @update:date="handleDateUpdate"
  @update:status="selectedStatus = $event"
/>
```

**Props:**
- `show` (Boolean, default: `false`) - видимость модального окна
- `date` (Date, default: `null`) - выбранная дата
- `status` (String, default: `''`) - выбранный статус

**Events:**
- `close` - закрытие модального окна
- `apply` - применение фильтров
- `reset` - сброс фильтров
- `update:date` - обновление даты
- `update:status` - обновление статуса

**Особенности:**
- Bottom sheet для мобильных устройств
- Swipe indicator
- Home indicator spacer для iOS
- Увеличенный z-index для календаря (2100)
- Глобальный класс `filter-modal-open` на body при открытии

---

## Карточки документов

### DocumentCard

Базовый компонент карточки документа.

**Расположение:** `@/components/molecules/DocumentCard.vue`

**Использование:**
```vue
<DocumentCard
  :document="document"
  @sign="$emit('sign')"
  @download="$emit('download')"
>
  <template #details>
    <!-- Дополнительные детали -->
  </template>
</DocumentCard>
```

**Props:**
- `document` (Object, required) - объект документа

**Events:**
- `sign` - подписание документа
- `download` - скачивание документа

**Slots:**
- `details` - дополнительные детали документа

**Структура document:**
```javascript
{
  title: 'Название', // или name, или performerName
  status: {
    type: 'needs-signature' | 'signed',
    text: 'Текст статуса',
    icon: 'путь к иконке' // опционально
  },
  validityPeriod: 'Срок действия', // опционально
  documentType: 'Тип документа', // опционально
  createdDate: 'Дата создания', // опционально
  requestName: 'Название заявки', // опционально
  signedDate: 'Дата подписания' // опционально
}
```

**Особенности:**
- Адаптивный дизайн
- Кнопка "Подписать" на всю ширину на мобильных
- Кнопка скачивания в header

---

### ActCard

Карточка акта (использует DocumentCard).

**Расположение:** `@/components/molecules/ActCard.vue`

**Использование:**
```vue
<ActCard
  :act="act"
  @sign="handleSign"
  @download="handleDownload"
/>
```

**Props:**
- `act` (Object, required) - объект акта

**Events:**
- `sign` - подписание акта
- `download` - скачивание акта

---

### ContractCard

Карточка договора (использует DocumentCard).

**Расположение:** `@/components/molecules/ContractCard.vue`

**Использование:**
```vue
<ContractCard
  :contract="contract"
  @sign="handleSign"
  @download="handleDownload"
/>
```

**Props:**
- `contract` (Object, required) - объект договора

**Events:**
- `sign` - подписание договора
- `download` - скачивание договора

---

### PlatformDocumentCard

Карточка документа с платформой.

**Расположение:** `@/components/molecules/PlatformDocumentCard.vue`

**Использование:**
```vue
<PlatformDocumentCard
  :document="document"
  @sign="handleSign"
  @download="handleDownload"
/>
```

**Props:**
- `document` (Object, required) - объект документа

**Events:**
- `sign` - подписание документа
- `download` - скачивание документа

---

## Утилиты

### dateUtils

Утилиты для работы с датами.

**Расположение:** `@/utils/dateUtils.js`

**Функции:**

#### createCleanDate(date)
Создает чистый Date объект из значения, избегая циклических ссылок.

```javascript
import { createCleanDate } from '@/utils/dateUtils'

const cleanDate = createCleanDate(new Date())
```

**Параметры:**
- `date` (Date|string|number|null) - дата для преобразования

**Возвращает:** Date|null

---

#### createCleanDateRange(dateRange)
Создает массив чистых Date объектов из диапазона дат.

```javascript
import { createCleanDateRange } from '@/utils/dateUtils'

const cleanRange = createCleanDateRange([new Date(), new Date()])
```

**Параметры:**
- `dateRange` (Array|null) - диапазон дат

**Возвращает:** Array<Date>|null

---

#### isValidDateValue(value)
Проверяет, является ли значение валидной датой.

```javascript
import { isValidDateValue } from '@/utils/dateUtils'

const isValid = isValidDateValue(new Date())
```

**Параметры:**
- `value` (any) - значение для проверки

**Возвращает:** Boolean

---

## Composable

### usePasswordChangeModal

Composable для управления модальными окнами смены пароля.

**Расположение:** `@/composables/usePasswordChangeModal.js`

**Использование:**
```javascript
import { usePasswordChangeModal } from '@/composables/usePasswordChangeModal'

export default {
  mixins: [usePasswordChangeModal()],
  // ... остальной код
}
```

**Предоставляет:**
- `data()`: состояние модальных окон
- `methods`: обработчики событий для всех модальных окон смены пароля

**Методы:**
- `handleChangePassword()` - открытие первого модального окна
- `handlePasswordOptionSelect(option)` - выбор способа смены пароля
- `handleGetCode(phone)` - получение кода
- `handleCodeModalBack()` - возврат к предыдущему шагу
- `handleCodeContinue(code)` - продолжение с кодом
- `handleNewPasswordModalBack()` - возврат к предыдущему шагу
- `handlePasswordConfirm({ password, confirmPassword })` - подтверждение пароля
- `handleResendCode(phone)` - повторная отправка кода

---

## Компоненты FAQ

### FaqSearchBar

Строка поиска для FAQ с кнопкой создания запроса.

**Расположение:** `@/components/molecules/FaqSearchBar.vue`

**Использование:**
```vue
<FaqSearchBar
  v-model="searchQuery"
  @search="handleSearch"
  @create-request="handleCreateRequest"
/>
```

**Props:**
- `modelValue` (String) - значение поискового запроса (v-model)

**Events:**
- `update:modelValue` - обновление поискового запроса
- `search` - выполнение поиска
- `create-request` - создание нового запроса в поддержку

---

### FaqCard

Карточка категории FAQ для десктопной версии.

**Расположение:** `@/components/molecules/FaqCard.vue`

**Использование:**
```vue
<FaqCard
  :title="card.title"
  :links="card.links"
/>
```

**Props:**
- `title` (String, required) - заголовок категории
- `links` (Array, required) - массив ссылок на статьи

**Структура links:**
```javascript
[
  {
    text: 'Текст ссылки',
    to: '/path/to/article', // для router-link
    // или
    href: 'https://example.com', // для внешней ссылки
    underlined: false // опционально, подчеркивание ссылки
  }
]
```

---

### FaqAccordionItem

Элемент аккордеона FAQ для мобильной версии.

**Расположение:** `@/components/molecules/FaqAccordionItem.vue`

**Использование:**
```vue
<FaqAccordionItem
  :title="card.title"
  :links="card.links"
  :class="{ 'faq-accordion-item--bordered': index < cards.length - 1 }"
/>
```

**Props:**
- `title` (String, required) - заголовок категории
- `links` (Array, required) - массив ссылок на статьи

**Особенности:**
- Раскрывающийся/сворачивающийся список
- Опциональная нижняя граница через класс `faq-accordion-item--bordered`

---

### SupportRequestsList

Список запросов в поддержку.

**Расположение:** `@/components/organisms/SupportRequestsList.vue`

**Использование:**
```vue
<SupportRequestsList
  :requests="supportRequests"
  @request-click="handleRequestClick"
/>
```

**Props:**
- `requests` (Array, required) - массив запросов в поддержку

**Events:**
- `request-click` - клик по запросу

---

### SupportRequestsEmpty

Пустое состояние для списка запросов в поддержку.

**Расположение:** `@/components/organisms/SupportRequestsEmpty.vue`

**Использование:**
```vue
<SupportRequestsEmpty
  @create-request="handleCreateRequest"
/>
```

**Props:** Нет

**Events:**
- `create-request` - создание нового запроса

---

## Компоненты уведомлений

### UserNotificationItem

Элемент списка уведомлений.

**Расположение:** `@/components/molecules/UserNotificationItem.vue`

**Использование:**
```vue
<UserNotificationItem
  :item="notification"
  page-view
  @click-to-link="handleClickToLink"
  @set-read-status="handleSetReadStatus"
/>
```

**Props:**
- `item` (Object, required) - объект уведомления
- `pageView` (Boolean) - режим отображения на странице (в отличие от dropdown)

**Events:**
- `click-to-link` - клик по ссылке в уведомлении
- `set-read-status` - изменение статуса прочтения

**Структура item:**
```javascript
{
  id: 1,
  title: 'Заголовок уведомления',
  text: 'Текст уведомления',
  link: '/path/to/page',
  read: false,
  createdAt: '2024-01-01T00:00:00Z',
  type: 'info' // тип уведомления
}
```

---

## Примечания

### Адаптивность

Все компоненты адаптивны и поддерживают:
- Десктопную версию (min-width: 769px)
- Мобильную версию (max-width: 768px)

### Стилизация

Компоненты используют:
- SCSS для стилей
- Scoped стили для изоляции
- CSS переменные для цветов
- Адаптивные медиа-запросы

### События

Все компоненты следуют Vue.js конвенциям:
- Props для входящих данных
- Events для исходящих действий
- v-model для двустороннего связывания (где применимо)

---

## Примеры использования

### Полный flow смены пароля

```vue
<template>
  <div>
    <ProfileActions @change-password="handleChangePassword" />
    
    <!-- Модальные окна -->
    <Popup :show="showChangePasswordModal" @update:show="showChangePasswordModal = $event">
      <ChangePasswordModal
        @close="showChangePasswordModal = false"
        @select-option="handlePasswordOptionSelect"
      />
    </Popup>
    
    <Popup :show="showChangePasswordPhoneModal" @update:show="showChangePasswordPhoneModal = $event">
      <ChangePasswordPhoneModal
        @close="showChangePasswordPhoneModal = false"
        @get-code="handleGetCode"
      />
    </Popup>
    
    <Popup :show="showChangePasswordCodeModal" @update:show="showChangePasswordCodeModal = $event">
      <ChangePasswordCodeModal
        :phone="changePasswordPhone"
        @close="showChangePasswordCodeModal = false"
        @back="handleCodeModalBack"
        @continue="handleCodeContinue"
        @resend-code="handleResendCode"
      />
    </Popup>
    
    <Popup :show="showChangePasswordNewPasswordModal" @update:show="showChangePasswordNewPasswordModal = $event">
      <ChangePasswordNewPasswordModal
        @close="showChangePasswordNewPasswordModal = false"
        @back="handleNewPasswordModalBack"
        @confirm="handlePasswordConfirm"
      />
    </Popup>
  </div>
</template>

<script>
import { usePasswordChangeModal } from '@/composables/usePasswordChangeModal'

export default {
  mixins: [usePasswordChangeModal()],
  // ... остальной код
}
</script>
```

---

## Обновления

- **2024**: Созданы базовые компоненты ModalHeader, ModalContent, BaseModal
- **2024**: Добавлены утилиты dateUtils для работы с датами
- **2024**: Создан composable usePasswordChangeModal
- **2024**: Добавлен компонент DocumentCard для переиспользования


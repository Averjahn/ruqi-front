export const TASK_ACTIONS_VIEW = {
  respond: {
    text: 'Откликнуться',
    longText: 'Откликнуться',
    buttonType: 'contained',
    action: 'changeStatus',
    requestStatus: 'requested',
    // color: 'green',
  },
  confirm: {
    text: 'Подтвердить',
    longText: 'Подтвердить участие',
    buttonType: 'contained',
    action: 'changeStatus',
    requestStatus: 'working',
    // color: 'green',
  },
  cancel: {
    text: 'Отменить',
    longText: 'Отказаться',
    buttonType: 'outlined',
    requestStatus: 'user_refused',
    action: 'changeStatus',
  },
  cancelBanner: {
    text: 'Отменить',
    longText: 'Отказаться',
    buttonType: 'outlined',
    requestStatus: 'user_refused',
    action: 'cancelBanner',
  },
  acceptInvite: {
    text: 'Принять',
    longText: 'Принять',
    buttonType: 'contained',
    action: 'changeStatus',
    requestStatus: 'working',
    // color: 'green',
  },
  refuse: {
    text: 'Отозвать отклик',
    longText: 'Отозвать отклик',
    buttonType: 'outlined',
    requestStatus: 'user_refused',
    action: 'changeStatus',
  },
  watchAct: {
    text: 'Посмотреть акт',
    longText: 'Посмотреть акт выполненных работ',
    buttonType: 'outlined',
    action: 'openAct',
  },
  signAct: {
    text: 'Подписать акт',
    longText: 'Подписать акт выполненных работ',
    buttonType: 'contained',
    action: 'openAct',
  },
  signPDAgreement: {
    text: 'Подписать',
    longText: 'Подписать',
    buttonType: 'contained',
    action: 'signPDAgreement',
  },
  signUserAgreement: {
    text: 'Подписать',
    longText: 'Подписать',
    buttonType: 'contained',
    action: 'signUserAgreement',
  },
  downloadReceipt: {
    text: 'Скачать чек',
    longText: 'Скачать чек',
    buttonType: 'outlined',
    action: 'openAct',
    leftIcon: require('@/assets/icons/arrow_download.svg'),
  },
  cancelReceipt: {
    text: 'Аннулировать чек',
    longText: 'Аннулировать чек',
    buttonType: 'outlined',
    color: 'red',
    action: 'openAct',
    leftIcon: require('@/assets/icons/document_cancel.svg'),
  },
  addPhoto: {
    text: 'Внести данные',
    longText: 'Внести данные',
    buttonType: 'contained',
    action: 'addPhoto',
  },
  fillMedicalBook: {
    text: 'Внести данные',
    longText: 'Внести данные',
    buttonType: 'contained',
    action: 'fillMedicalBook',
  },
  plus400: {
    text: '+400₽ к заявке',
    longText: '+400₽ к заявке',
    buttonType: 'outlined',
    action: 'inviteFriend',
  },
  copyLink: {
    component: 'ButtonIcon',
    buttonType: 'outlined',
    action: 'copyLink',
    icon: require('@/assets/icons/copy.svg'),
  },
  addTelegram: {
    text: 'Привязать',
    longText: 'Привязать',
    buttonType: 'outlined',
    action: 'addTelegram',
    leftIcon: require('@/assets/icons/telegram.svg'),
  },
  connectSmz: {
    text: 'Подключить статус самозанятого',
    longText: 'Подключить статус самозанятого',
    buttonType: 'outlined',
    action: 'connectSmz',
  },
  partnershipInstruction: {
    text: 'Смотреть инструкцию',
    longText: 'Смотреть инструкцию',
    buttonType: 'outlined',
    action: 'partnershipInstruction',
  },
  addRegistrationInRf: {
    text: 'Загрузить документ',
    longText: 'Загрузить документ',
    buttonType: 'outlined',
    action: 'addRegistrationInRf',
  },
  addPatent: {
    text: 'Загрузить документ',
    longText: 'Загрузить документ',
    buttonType: 'outlined',
    action: 'addPatent',
  },
  addPayment: {
    text: 'Добавить',
    longText: 'Добавить',
    buttonType: 'outlined',
    action: 'addPayment',
  },
}

export const EMPLOYMENT_TYPE = {
  full_time: { id: 'full_time', name: 'Полный день' },
  part_time: { id: 'part_time', name: 'Частичная занятость' },
  flexible: { id: 'flexible', name: 'Гибкий график' },
}

export const CITIZENSHIP_OPTIONS = {
  RU: { id: 'RU', name: 'Россия' },
  BY: { id: 'BY', name: 'Республика Беларусь' },
  AM: { id: 'AM', name: 'Республика Армения' },
  KZ: { id: 'KZ', name: 'Республика Казахстан' },
  KG: { id: 'KG', name: 'Республика Кыргызстан' },
  OTHER: { id: 'OTHER', name: 'Другое' },
}

export const GENDER = {
  male: { id: 'male', name: 'Мужской' },
  female: { id: 'female', name: 'Женский' },
}

export const IDENTITY_DOCUMENT_TYPE = {
  IP: { id: 'IP', name: 'Заграничный паспорт' },
}

export const USER_NOTIFICATIONS = {
  need_upload_documents_1: {
    getLink: () => '/profile',
    linkText: 'Перейти в профиль',
  },
  need_upload_documents_24: {
    getLink: () => '/profile',
    linkText: 'Перейти в профиль',
  },
  need_upload_documents_72: {
    getLink: () => '/profile',
    linkText: 'Перейти в профиль',
  },
  confirm_attendance: {
    getLink: (notification) => '/task/' + notification?.task?.uuid,
    linkText: 'Перейти в заявку',
  },
  fns_create_receipt_error: {
    getLink: (notification) => '/task/' + notification?.task?.uuid,
    linkText: 'Перейти в заявку',
  },
  vacancies_available: {
    getLink: (notification) => '/task/' + notification?.task?.uuid,
    linkText: 'Перейти',
  },
  recruitment: {
    getLink: (notification) => '/object/' + notification?.object?.uuid,
    linkText: 'Перейти к объекту',
  },
  survey: {
    getLink: (notification) => notification?.mailing_list?.url,
    linkText: 'Пройти опрос',
  },
  announcement: {
    getLink: () => '/promo',
    linkText: 'Посмотреть',
  },
  add_payment_method: {
    getLink: () => '/profile',
    linkText: 'Перейти в профиль',
  },
}

export const YANDEX_MAP_API_TOKEN = process.env.YANDEX_MAP_API_TOKEN

export const LEVELS = {
  1: { id: 1, likes: 0 },
  2: { id: 2, likes: 5 },
  3: { id: 3, likes: 10 },
  4: { id: 4, likes: 15 },
  5: { id: 5, likes: 20 },
  6: { id: 6, likes: 25 },
  7: { id: 7, likes: 30 },
  8: { id: 8, likes: 40 },
  9: { id: 9, likes: 50 },
  10: { id: 10, likes: 60 },
  11: { id: 11, likes: 75 },
  12: { id: 12, likes: 90 },
  13: { id: 13, likes: 105 },
  14: { id: 14, likes: 130 },
  15: { id: 15, likes: 155 },
  16: { id: 16, likes: 185 },
  17: { id: 17, likes: 215 },
  18: { id: 18, likes: 245 },
  19: { id: 19, likes: 275 },
  20: { id: 20, likes: 305 },
}

export const GRADES = {
  1: {
    id: 1,
    name: 'Новичок',
    stars: 1,
    icon: 'grade1Monochrome.svg',
    iconColor: 'grade1Color.svg',
    levels: [1, 2, 3],
    descriptionHtml: 'Стартовый ранг для всех новичков на платформе',
    bonus: 'Базовые бонусы',
  },
  2: {
    id: 2,
    name: 'Гриндератор',
    stars: 2,
    icon: 'grade2Monochrome.svg',
    iconColor: 'grade2Color.svg',
    levels: [4, 5, 6],
    descriptionHtml:
      'За достижение этого ранга начисляется <b>1 000</b> бонусных рублей, которые можно вывести со следующей заявкой',
    bonus: 'Накопление бонусов',
  },
  3: {
    id: 3,
    name: 'Повелитель подработок',
    stars: 3,
    icon: 'grade3Monochrome.svg',
    iconColor: 'grade3Color.svg',
    levels: [7, 8, 9],
    descriptionHtml:
      'За достижение этого ранга начисляется <b>3 000</b> бонусных рублей, которые можно вывести со следующей заявкой',
    bonus: 'Возможность вывода средств',
  },
  4: {
    id: 4,
    name: 'Незаменимый',
    stars: 4,
    icon: 'grade4Monochrome.svg',
    iconColor: 'grade4Color.svg',
    levels: [10, 11, 12],
    descriptionHtml:
      'За достижение этого ранга вы можете получить от <b>80</b> до <b>120</b> рублей к каждой заявке. Бонус зависит от продолжительности заявки',
    bonus: 'Премии',
  },
  5: {
    id: 5,
    name: 'Золотые руки',
    stars: 5,
    icon: 'grade5Monochrome.svg',
    iconColor: 'grade5Color.svg',
    levels: [13, 14, 15],
    descriptionHtml:
      'За достижение этого ранга начисляется <b>10 000</b> бонусных рублей, которые можно вывести со следующей заявкой. А также от <b>160</b> до <b>200</b> рублей к каждой заявке. Бонус зависит от продолжительности заявки',
    bonus: 'Повышенные бонусы',
  },
  6: {
    id: 6,
    name: 'Легенда',
    stars: 5,
    icon: 'grade6Monochrome.svg',
    iconColor: 'grade6Color.svg',
    levels: [16, 17, 18, 19, 20],
    descriptionHtml:
    'За достижение этого ранга начисляется <b>15 000</b> бонусных рублей, которые можно вывести со следующей заявкой. А также от <b>200 до 300</b> рублей к каждой заявке. Бонус зависит от продолжительности заявки',
    bonus: 'Повышенные бонусы',
  },
}

export const ACHIEVEMENTS = {
  successes: [
    {
      alias: 'one_of_us',
      name: 'Один из нас',
      description: 'Заполнение профиля и прохождение модерации',
      icon: 'achievement_oneOfUs.png',
    },
    {
      alias: 'first_star',
      name: 'Первая звездочка',
      description: 'Получена первая звезда в системе',
      icon: 'achievement_firstStar.png',
    },
    {
      alias: 'excellent_debut',
      name: 'Отличный дебют',
      description: 'За первую успешную заявку (первый лайк)',
      icon: 'achievement_excellentDebut.png',
    },
    {
      alias: 'leader_on_place',
      name: 'Лидер на месте',
      description: 'За получение статуса "Бригадир',
      icon: 'achievement_leaderInPlace.png',
    },
    {
      alias: 'like_for_like',
      name: 'Лайк за лайком',
      description: 'За первые 10 лайков',
      icon: 'achievement_likeForLike.png',
    },
    {
      alias: 'you_are_a_magnet',
      name: 'Ты — магнит',
      description: 'За первого приведенного друга',
      icon: 'achievement_youreAmagnet.png',
    },
    {
      alias: 'first_milestone',
      name: 'Первый рубеж',
      description: 'За получение второго уровня',
      icon: 'achievement_firstMilestone.png',
    },
    // {
    //   alias: 'tireless',
    //   name: 'Неутомимый',
    //   description: 'За то что в течении месяца работал минимум 4 смены в неделю',
    //   icon: 'achievement_tireless.png',
    // },
    {
      alias: 'type_payment_gateway_is_open',
      name: 'Платежный шлюз открыт',
      description: 'За подключение оплаты',
      icon: 'achievement_payment.png',
    },
    {
      alias: 'working_boss',
      name: 'Босс подработки',
      description: 'Апать больше нечего. Ты на вершине!',
      icon: 'achievement_workingBoss.png',
    },
    {
      alias: 'passed_everything',
      name: 'Тот, кто прошёл всё',
      description: 'Последний ранг покорён. Теперь ты в клубе тех, кто смог.',
      icon: 'achievement_passedEverything.png',
    },
  ],
  failures: [
    {
      alias: 'we_are_not_perfect',
      name: 'Все мы не идеальны',
      description: 'За получение первого дислайка',
      icon: 'achievement_firstChallenge.png',
    },
    {
      alias: 'first_failure',
      name: 'Первый сбой',
      description: 'За первое понижение уровня',
      icon: 'achievement_firstFailure.png',
    },
  ],
}

export const INITIAL_TASK_FILTERS = {
  professions: [],
  region: '',
  radius: null,
  start_date: { from: null },
  rate: { from: null },
  medical_book: false,
  driver_license: false,
  shift_type: [],
  brand: [],
  shift_duration: [],
}

export const CONTRACTOR_ACT_STATUSES = {
  created: {
    id: 'created',
    displayed: 'Акт сформирован',
    color: '#7a91a9',
  },
  ready_to_sign: {
    id: 'ready_to_sign',
    displayed: 'Акт готов к подписанию',
    color: '#9747FF',
  },
  manager_signed: {
    id: 'manager_signed',
    displayed: 'Подписан менеджером',
    color: '#F4D150',
  },
  contractor_signed: {
    id: 'contractor_signed',
    displayed: 'Подписан исполнителем',
    color: '#F4D150',
  },
  all_signed: {
    id: 'all_signed',
    displayed: 'Подписан всеми',
    color: '#0082DE',
  },
  paid: {
    id: 'paid',
    displayed: 'Оплачен',
    color: '#71D472',
  },
  error_paid: {
    id: 'error_paid',
    displayed: 'Ошибка оплаты',
    color: '#EB4D3D',
  },
  canceled: {
    id: 'canceled',
    displayed: 'Отменен',
    color: '#BEBEBE',
  },
  pay_in_progress: {
    id: 'pay_in_progress',
    displayed: 'Подписывается',
    color: '#9747FF',
  },
}

export const TICKET_STATUSES = {
  open: {
    id: 'open',
    displayed: 'На рассмотрении',
    color: '#EB4D3D',
    border_color: '#FFBB96',
    bg_color: '#FFF2E8',
  },
  closed_by_support: {
    id: 'closed_by_support',
    displayed: 'Решено',
    color: '#71D472',
    border_color: '#B7EB8F',
    bg_color: '#F6FFED',
  },
  closed_by_contractor: {
    id: 'closed_by_contractor',
    displayed: 'Решено',
    color: '#71D472',
    border_color: '#B7EB8F',
    bg_color: '#F6FFED',
  },
}

export const CONTRACT_STATUSES = {
  ready_to_sign: {
    id: 'ready_to_sign',
    displayed: 'Нужно подписать',
    color: '#F38816',
  },
  manager_signed: {
    id: 'manager_signed',
    displayed: 'Нужно подписать',
    color: '#F38816',
  },
  pending: {
    id: 'pending',
    displayed: 'Подписывается',
    color: '#0082de',
  },
  pulling_exceed: {
    id: 'pulling_exceed',
    displayed: 'Подписывается',
    color: '#0082de',
  },
  contractor_signed: {
    id: 'contractor_signed',
    displayed: 'Подписан',
    color: '#71D472',
  },
  all_signed: {
    id: 'all_signed',
    displayed: 'Подписан',
    color: '#71D472',
  },
}

export const SMZ_STATUSES = {
  null: {
    id: 'null',
    displayed: 'Самозанятость не подключена',
    icon: 'smz_grey.svg',
  },
  pending: {
    id: 'pending',
    displayed: 'Самозанятость в обработке',
    icon: 'smz_yellow.svg',
  },
  done: {
    id: 'done',
    displayed: 'Самозанятость подключена',
    icon: 'smz.svg',
  },
  error: {
    id: 'error',
    displayed: 'Ошибка подключения самозанятости',
    icon: 'smz_red.svg',
  },
}

export const NEW_SMZ_STATUSES = {
  null: {
    id: 'null',
    displayed: 'Самозанятость не подключена',
    icon: 'smz_inactive.svg',
  },
  pending: {
    id: 'pending',
    displayed: 'Самозанятость в обработке',
    icon: 'smz_inactive.svg',
  },
  done: {
    id: 'done',
    displayed: 'Самозанятость подключена',
    icon: 'smz_active.svg',
  },
  error: {
    id: 'error',
    displayed: 'Ошибка подключения самозанятости',
    icon: 'smz_inactive.svg',
  },
}

export const VIOLATIONS_TYPES = {
  theft_or_substitution_of_goods: 'Кража или подмена товара', // 1 уровень
  intoxication: 'Нахождение на работе в состоянии алкогольного или наркотического опьянения', // 1 уровень
  damage_to_property: 'Порча имущества склада', // 0.5 уровня
  incorrect_packaging_or_labeling: 'Некорректная упаковка или маркировка товара', // дизлайк
  violation_of_rules_of_conduct:
  'Нарушение правил поведения на складе или внутренний логистики заказчика', // 0,5 уровня
  transfer_of_more_goods: 'Передача большего количества товаров, чем указано в плане поставок', // 1 уровень
  being_without_ppe: 'Нахождение без СИЗ', // 0,5 уровня
  not_worked: 'Не вышел', //  дизлайк (3 и более 0,5 уровня)
}
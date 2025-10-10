import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import updateLocale from 'dayjs/plugin/updateLocale'
const utc = require('dayjs/plugin/utc')

dayjs.extend(customParseFormat)
dayjs.extend(updateLocale)
dayjs.extend(utc)
dayjs.updateLocale('en', {
  months: [
    'Января',
    'Февраля',
    'Марта',
    'Апреля',
    'Мая',
    'Июня',
    'Июля',
    'Августа',
    'Сентября',
    'Октября',
    'Ноября',
    'Декабря',
  ],
})

export default dayjs

import dayjs from '@/plugins/dayjs'
export const EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// Валидация ИНН при вводе (без проверки длины)
export const validateInnFormat = (inn) => {
  if (typeof inn === 'number') {
    inn = inn.toString()
  } else if (typeof inn !== 'string') {
    inn = ''
  }
  if (inn.length === 0) {
    return true // Пустое значение валидно при вводе
  }
  if (/[^0-9]/.test(inn)) {
    return 'ИНН может состоять только из цифр'
  }
  return true
}

// Валидация ИНН с проверкой длины (для blur)
export const validateInn = (inn) => {
  if (typeof inn === 'number') {
    inn = inn.toString()
  } else if (typeof inn !== 'string') {
    inn = ''
  }
  if (inn.length < 1) {
    return 'ИНН пуст'
  } else if (/[^0-9]/.test(inn)) {
    return 'ИНН может состоять только из цифр'
  } else if (![10, 12].includes(inn.length)) {
    return 'ИНН может состоять только из 10 или 12 цифр'
  } else {
    const checkDigit = function (inn, coefficients) {
      let n = 0
      for (const i in coefficients) {
        n += coefficients[i] * inn[i]
      }
      return parseInt((n % 11) % 10)
    }
    switch (inn.length) {
      case 10:
        if (checkDigit(inn, [2, 4, 10, 3, 5, 9, 4, 6, 8]) === parseInt(inn[9])) {
          return true
        }
        break
      case 12:
        if (
          checkDigit(inn, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) === parseInt(inn[10]) &&
          checkDigit(inn, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]) === parseInt(inn[11])
        ) {
          return true
        }
        break
    }
    return 'Неправильное контрольное число'
  }
}

export const required = (value) => !!value || 'Заполните поле'
export const validateKpp = (kpp) => {
  if (typeof kpp === 'number') {
    kpp = kpp.toString()
  } else if (typeof kpp !== 'string') {
    kpp = ''
  }
  if (!kpp.length) {
    return 'КПП пуст'
  } else if (kpp.length !== 9) {
    return 'КПП может состоять только из 9 знаков (цифр или заглавных букв латинского алфавита от A до Z)'
  } else if (!/^[0-9]{4}[0-9A-Z]{2}[0-9]{3}$/.test(kpp)) {
    return 'Неправильный формат КПП'
  } else {
    return true
  }
}

export const luhnAlgorithm = (cardNumber) => {
  return (
    cardNumber.split('').reduce(function (sum, d, n) {
      return sum + parseInt((n + cardNumber.length) % 2 ? d : [0, 2, 4, 6, 8, 1, 3, 5, 7, 9][d])
    }, 0) %
      10 ===
    0
  )
}

export const isCardNumberValid = (ccNumb) => {
  ccNumb = ccNumb.replace(/\s/g, '')
  if (ccNumb.length < 15) return 'Номер карты должен состоять минимум из 15 цифр'
  if (ccNumb.length > 19) return 'Номер карты может состоять максимум из 19 цифр'
  const valid = '0123456789' // Valid digits in a credit card number
  const len = ccNumb.length // The length of the submitted cc number
  let iCCN = parseInt(ccNumb) // Integer of ccNumb
  const sCCN = ccNumb.toString() // String of ccNumb
  let iTotal = 0 // Integer total set at zero
  let bNum = true // By default assume it is a number
  let bResult = false // By default assume it is NOT a valid cc
  let temp // Temporary letiable for parsing string
  let calc // Used for calculation of each digit
  // Determine if the ccNumb is in fact all numbers
  for (let j = 0; j < len; j++) {
    temp = '' + sCCN.substring(j, j + 1)
    if (!valid.includes(temp)) {
      bNum = false
    }
  }
  // If it is NOT a number, you can either alert to the fact, or just pass a failure
  if (!bNum) {
    /* alert("Not a Number"); */
    bResult = false
  }
  // Determine if it is the proper length
  if (len === 0 && bResult) {
    // Nothing, the field is blank AND passed above # check
    bResult = false
  } else if (len >= 15) {
    // ccNumb is a number and the proper length - let's
    // see if it is a valid card number
    // 15 or 16 for Amex or V/MC
    for (let i = len; i > 0; i--) {
      // LOOP through the digits of the card
      calc = parseInt(iCCN) % 10 // Right most digit
      calc = parseInt(calc) // Assure it is an integer
      iTotal += calc // Running total of the card number as we loop - Do Nothing to first digit
      i-- // Decrement the count - move to the next digit in the card
      iCCN = iCCN / 10 // Subtracts right most digit from ccNumb
      calc = parseInt(iCCN) % 10 // NEXT right most digit
      calc = calc * 2 // multiply the digit by two
      // Instead of some screwy method of converting 16 to a string
      // and then parsing 1 and 6 and then adding them to make 7,
      // I use a simple switch statement to change the value
      // of calc2 to 7 if 16 is the multiple.
      switch (calc) {
        case 10:
          calc = 1
          break // 5*2=10 & 1+0 = 1
        case 12:
          calc = 3
          break // 6*2=12 & 1+2 = 3
        case 14:
          calc = 5
          break // 7*2=14 & 1+4 = 5
        case 16:
          calc = 7
          break // 8*2=16 & 1+6 = 7
        case 18:
          calc = 9
          break // 9*2=18 & 1+8 = 9
        default:
        // 4*2= 8 &   8 = 8  - the same for all lower numbers
      }
      iCCN = iCCN / 10 // Subtracts right most digit from ccNum
      iTotal += calc // Running total of the card number as we loop
    } // END OF LOOP
    if (iTotal % 10 === 0) {
      // Check to see if the sum Mod 10 is zero
      bResult = true // This IS (or could be) a valid credit card number.
    } else {
      bResult = false // This could NOT be a valid credit card number
    }
  }
  if (!bResult) {
    // workaround for some cardnumbers got false negarive result
    // recheck cardnumber with another verification function to be sure
    return luhnAlgorithm(ccNumb)
  }
  return bResult
}

export const validateBik = (bik) => {
  if (typeof bik === 'number') {
    bik = bik.toString()
  } else if (typeof bik !== 'string') {
    bik = ''
  }
  if (bik.length < 1) {
    return 'БИК пуст'
  } else if (/[^0-9]/.test(bik)) {
    return 'БИК может состоять только из цифр'
  } else if (bik.length !== 9) {
    return 'БИК может состоять только из 9 цифр'
  }
  return true
}

export const validatePaymentAccount = (value, bik) => {
  if (validateBik(bik) === true) {
    if (typeof value === 'number') {
      value = value.toString()
    } else if (typeof value !== 'string') {
      value = ''
    }
    if (value.length < 1) {
      return 'Р/С пуст'
    } else if (/[^0-9]/.test(value)) {
      return 'Р/С может состоять только из цифр'
    } else if (value.length < 20) {
      return 'Р/С не должен быть меньше 20 цифр'
    } else if (value.length > 20) {
      return 'Р/С не должен быть больше 20 цифр'
    } else {
      const bikRs = bik.toString().slice(-3) + value
      let checksum = 0
      const coefficients = [7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1]
      for (const i in coefficients) {
        checksum += coefficients[i] * (bikRs[i] % 10)
      }
      return checksum % 10 === 0 ? true : 'Неправильное контрольное число, проверьте так же БИК'
    }
  }
  return 'Проверьте правильность номера БИК'
}

export function isSnilsValid (value) {
  value = value.replace(/\D/g, '')
  if (value.length !== 11) {
    return 'Неверная длина СНИЛС'
  }
  const checkSum = parseInt(value.slice(9), 10)
  const sum =
    value[0] * 9 +
    value[1] * 8 +
    value[2] * 7 +
    value[3] * 6 +
    value[4] * 5 +
    value[5] * 4 +
    value[6] * 3 +
    value[7] * 2 +
    value[8] * 1

  if (sum < 100 && sum === checkSum) {
    return true
  } else if ((sum === 100 || sum === 101) && checkSum === 0) {
    return true
  } else if (sum > 101 && (sum % 101 === checkSum || (sum % 101 === 100 && checkSum === 0))) {
    return true
  }

  return 'Неверная контрольная сумма в СНИЛС'
}

// Валидация полного наименования организации - только формат (при вводе)
export const validateFullNameFormat = (v) => {
  if (!v || v.length === 0) return true // Пустое значение валидно при вводе
  if (/[a-zA-Z]/.test(v)) return 'Не может содержать латинские символы'
  return true
}

// Валидация полного наименования организации - полная (при blur)
export const validateFullName = (v) => {
  if (!v) return 'Обязательное поле'
  if (/[a-zA-Z]/.test(v)) return 'Не может содержать латинские символы'
  return true
}

// Валидация КПП - только формат (при вводе)
export const validateKppDigitsFormat = (v) => {
  if (!v || v.length === 0) return true // Пустое значение валидно при вводе
  if (!/^[0-9]+$/.test(v)) return 'КПП может состоять только из цифр'
  return true
}

// Валидация КПП - полная (при blur)
export const validateKppDigits = (v) => {
  if (!v) return 'Обязательное поле'
  if (!/^[0-9]+$/.test(v)) return 'КПП может состоять только из цифр'
  return true
}

// Валидация ОГРН - только формат (при вводе)
export const validateOgrnFormat = (v) => {
  if (!v || v.length === 0) return true // Пустое значение валидно при вводе
  if (!/^[0-9]+$/.test(v)) return 'ОГРН может состоять только из цифр'
  return true
}

// Валидация ОГРН - полная (при blur)
export const validateOgrn = (v) => {
  if (!v) return 'Обязательное поле'
  if (!/^[0-9]+$/.test(v)) return 'ОГРН может состоять только из цифр'
  return true
}

// Валидация ОКАТО - только формат (при вводе)
export const validateOkatoFormat = (v) => {
  if (!v || v.length === 0) return true // Пустое значение валидно при вводе
  if (!/^[0-9]+$/.test(v)) return 'ОКАТО может состоять только из цифр'
  return true
}

// Валидация ОКАТО - полная (при blur)
export const validateOkato = (v) => {
  if (!v) return 'Обязательное поле'
  if (!/^[0-9]+$/.test(v)) return 'ОКАТО может состоять только из цифр'
  return true
}

// Валидация ФИО - только формат (при вводе)
export const validateFullNamePersonFormat = (v) => {
  if (!v || v.length === 0) return true // Пустое значение валидно при вводе
  if (!/^[а-яёА-ЯЁ\s-]+$/.test(v)) return 'ФИО может состоять только из русских букв'
  return true
}

// Валидация ФИО - полная (при blur)
export const validateFullNamePerson = (v) => {
  if (!v) return 'Обязательное поле'
  if (!/^[а-яёА-ЯЁ\s-]+$/.test(v)) return 'ФИО может состоять только из русских букв'
  const words = v.trim().split(/\s+/).filter(w => w.length > 0)
  if (words.length < 2 || words.length > 3) return 'ФИО должно состоять из 2 или 3 слов'
  return true
}

// Валидация должности - только формат (при вводе)
export const validatePositionFormat = (v) => {
  if (!v || v.length === 0) return true // Пустое значение валидно при вводе
  if (!/^[а-яёА-ЯЁ\s-,]+$/.test(v)) return 'Должность может состоять только из русских букв и запятых'
  return true
}

// Валидация должности - полная (при blur)
export const validatePosition = (v) => {
  if (!v) return 'Обязательное поле'
  if (!/^[а-яёА-ЯЁ\s-,]+$/.test(v)) return 'Должность может состоять только из русских букв и запятых'
  return true
}

// Валидация "На основании чего" - только формат (при вводе)
export const validateBasisFormat = (v) => {
  if (!v || v.length === 0) return true // Пустое значение валидно при вводе
  if (/[a-zA-Z]/.test(v)) return 'Не может содержать латинские символы'
  return true
}

// Валидация "На основании чего" - полная (при blur)
export const validateBasis = (v) => {
  if (!v) return 'Обязательное поле'
  if (/[a-zA-Z]/.test(v)) return 'Не может содержать латинские символы'
  return true
}

// Валидация почтового адреса - только формат (при вводе)
export const validateMailingAddressFormat = (v) => {
  if (!v || v.length === 0) return true // Пустое значение валидно при вводе
  if (/[a-zA-Z]/.test(v)) return 'Не может содержать латинские символы'
  return true
}

// Валидация почтового адреса - полная (при blur)
export const validateMailingAddress = (v) => {
  if (!v) return 'Обязательное поле'
  if (/[a-zA-Z]/.test(v)) return 'Не может содержать латинские символы'
  return true
}

// Валидация юридического адреса - только формат (при вводе)
export const validateLegalAddressFormat = (v) => {
  if (!v || v.length === 0) return true // Пустое значение валидно при вводе
  if (/[a-zA-Z]/.test(v)) return 'Не может содержать латинские символы'
  return true
}

// Валидация юридического адреса - полная (при blur)
export const validateLegalAddress = (v) => {
  if (!v) return 'Обязательное поле'
  if (/[a-zA-Z]/.test(v)) return 'Не может содержать латинские символы'
  return true
}

export const rules = {
  isSnilsValid: (v) => !v || isSnilsValid(v),
  cyrillic: (v) => !v || /^[а-яё\s]*$/gi.test(v) || 'Только кириллица',
  noStartSpace: (v) => !v || /^[^\s].*$/gi.test(v) || 'Запрещён пробел в начале строки',
  noSpaceRepeat: (v) => !v || /^(?!.*\s\s).*$/gi.test(v) || 'Не больше одного пробела подряд',
  cyrillicDash: (v) => !v || /^[а-яё-\s]*$/gi.test(v) || 'Только кириллица и дефис',
  cyrillicExt: (v) => !v || /^[0-9а-яё.,()-\s№"]*$/gi.test(v) || 'Только кириллица, цифры, пробелы и символы: [.,-"№]',
  passportSeries: (v) => !v || /^[A-Z0-9]{2,4}$/.test(v) || 'Минимум 2 символа',
  onlyNumbers: (v) => !v || /^[0-9]+$/.test(v) || 'Только цифры',
  phoneFormat: (v) => !v || /^[0-9 ()+-]+$/.test(v) || 'Только цифры, пробел и символы + - ( )',
  phoneLength: (v) => !v || v?.replace(/\D/g, '')?.length > 10 || 'Номер должен состоять минимум из 11 цифр',
  passportNumber: (v) => !v || /^[A-Z0-9]{6,15}$/.test(v) || 'Минимум 6 символов',
  issueCode: (v) => !v || /^\d{3}-\d{3}$/.test(v) || 'Только 6 цифр',
  required: (v) => {
    if (Array.isArray(v)) return !!v.length || 'Обязательное поле'
    return !!v || 'Обязательное поле'
  },
  email: (v) => EMAIL_REGEXP.test(v) || 'Введите корректный email',
  min7Sign: (v) => v?.length > 6 || 'Минимум 7 символов',
  max20Sign: (v) => v?.length < 21 || 'Максимум 20 символов',
  requiredLetter: (v) => /[A-Za-z]/.test(v) || 'Должен содержать латинскую букву',
  requiredDigit: (v) => /[0-9]/.test(v) || 'Должен содержать цифру',
  bankCard: (v) => isCardNumberValid(v) || 'Некорректная контрольная сумма',
  passwordAllowedSign: (v) =>
    /^[A-Za-z0-9!@#$%^&*()-_+=;:,.\/?\\|`~[\]{}]+$/g.test(v) ||
    'Только латиница, цифры и символы ! @ # $ % ^ & * ( ) — _ + = ; : , ./ ?  | ` ~ [ ] { }',
  date: (v) => !v || dayjs(v, ['DD.MM.YYYY', 'YYYY-MM-DD'], true).isValid() || 'Введите корректную дату',
  year: (v) => !v || dayjs('' + v, 'YYYY', true).isValid() || 'Введите корректный год',
  minBirthDate: (v) => dayjs(v, 'DD.MM.YYYY', true) >= dayjs('1930-01-01') || 'Минимум 1930г',
  adult: (v) => dayjs().diff(dayjs(v, 'DD.MM.YYYY', true), 'year') >= 18 || 'Несовершеннолетний',
  notInFuture: (v) => dayjs(v, 'DD.MM.YYYY', true) <= dayjs() || 'Не позже текущей',
  validateInn,
  validateFullName,
  validateKppDigits,
  validateOgrn,
  validateOkato,
  validateFullNamePerson,
  validatePosition,
  validateBasis,
  validateMailingAddress,
  validateLegalAddress,
}

export const rulesSets = {
  phone: [rules.phoneFormat, rules.phoneLength],
  password: [
    rules.required,
    rules.passwordAllowedSign,
    rules.requiredLetter,
    rules.requiredDigit,
    rules.min7Sign,
    rules.max20Sign,
  ],
  lastName: [rules.required, rules.cyrillicDash, rules.noStartSpace, rules.noSpaceRepeat],
  firstName: [rules.required, rules.cyrillicDash, rules.noStartSpace, rules.noSpaceRepeat],
  middleName: [rules.cyrillicDash, rules.noStartSpace, rules.noSpaceRepeat],
  birth: [rules.required, rules.date, rules.minBirthDate, rules.adult],
}

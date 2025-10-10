import { urlParamsFromObject } from '@/constants/helpers'
const ymapSettings = {
  apiKey: 'a27e3df2-3b6c-4f9a-99e7-18ee954c7ff0',
  // suggest_apikey: '1728b922-ecbb-4845-b2ab-7cd4e79026c7',
  // 'b22b0e09-4ee8-4b7a-8be9-f5a13597fe60'
  // '00516f7a-3605-439c-82d1-2ea287000098'
  suggest_apikey: 'd64380dd-327c-400f-ba2e-86030c20b484',
  lang: 'ru_RU',
  coordorder: 'latlong',
  enterprise: false,
  mode: process.env.NODE_ENV === 'development' ? 'debug' : 'release',
}

const YMAP_SCRIPT_ID = 'yandexMapScript21'

const createScript = (onLoad) => {
  const script = document.createElement('script')
  script.src = 'https://api-maps.yandex.ru/2.1/?' + urlParamsFromObject(ymapSettings)
  script.type = 'text/javascript'
  script.id = YMAP_SCRIPT_ID
  document.body.appendChild(script)
  script.addEventListener('load', onLoad)
}

export const initYandexMap = (init) => {
  if (document.getElementById(YMAP_SCRIPT_ID)) {
    if (!window.ymaps) document.getElementById(YMAP_SCRIPT_ID).addEventListener('load', () => window.ymaps.ready(init))
    else window.ymaps.ready(init)
  } else {
    createScript(() => window.ymaps.ready(init))
  }
}

export const initYandexMapAsync = () => {
  return new Promise((resolve) => {
    const onLoad = () => window.ymaps.ready(resolve)
    if (document.getElementById(YMAP_SCRIPT_ID)) {
      if (!window.ymaps) document.getElementById(YMAP_SCRIPT_ID).addEventListener('load', onLoad)
      else onLoad()
    } else {
      createScript(onLoad)
    }
  })
}

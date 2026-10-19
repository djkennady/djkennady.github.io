import type { Lang } from '../content/types'

const isLang = (v: string | null | undefined): v is Lang => v === 'ru' || v === 'en'

/** Порядок приоритетов: ?lang= в адресе, затем запомненный выбор, затем язык
 *  браузера. Параметр в адресе нужен, чтобы дать иностранному промоутеру
 *  прямую ссылку на английскую версию. */
export function resolveLang(env: { search: string; stored: string | null; navigator: string }): Lang {
  const fromUrl = new URLSearchParams(env.search).get('lang')
  if (isLang(fromUrl)) return fromUrl
  if (isLang(env.stored)) return env.stored
  return env.navigator.toLowerCase().startsWith('ru') ? 'ru' : 'en'
}

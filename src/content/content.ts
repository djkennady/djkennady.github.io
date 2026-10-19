import type { Content, Lang } from './types'

const SC = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/'

export const content: Record<Lang, Content> = {
  ru: {
    ui: {
      onRequest: 'по запросу',
      copy: 'Скопировать',
      copied: 'Скопировано',
      soundOn: 'Включить звук',
      soundOff: 'Выключить звук',
      scrollHint: 'Листай',
    },
    hero: {
      name: 'DJ Kennady',
      realName: 'Егор Морозов',
      city: 'Москва',
      ctaBooking: 'Букинг',
      ctaBrand: 'ETIQET',
    },
    manifesto: {
      lines: [
        'Я ставлю музыку и шью одежду.',
        'Это одна работа, просто разными руками.',
        'На деке решаешь, каким будет вечер. За машинкой — каким будет утро после него.',
      ],
      facts: [
        { value: '7', label: 'лет за деком' },
        { value: '14', label: 'городов' },
        { value: '2', label: 'дропа ETIQET' },
      ],
    },
    music: {
      title: 'Сеты',
      tracks: [
        {
          num: '01',
          title: 'Ночная смена',
          length: '58:20',
          platform: 'soundcloud',
          embedUrl: `${SC}1000000001`,
          poster: '/media/track-01.webp',
        },
        {
          num: '02',
          title: 'Гараж на Сходне',
          length: '1:12:04',
          platform: 'soundcloud',
          embedUrl: `${SC}1000000002`,
          poster: '/media/track-02.webp',
        },
        {
          num: '03',
          title: 'ETIQET Drop 02 Mix',
          length: '41:37',
          platform: 'soundcloud',
          embedUrl: `${SC}1000000003`,
          poster: '/media/track-03.webp',
        },
      ],
    },
    shows: {
      title: 'Где играл',
      shots: [
        {
          src: '/media/booth.jpg',
          kind: 'image',
          alt: 'Егор за пультом Pioneer в красном свете клуба NEFTЬ',
        },
        {
          src: '/media/portrait-motion.jpg',
          kind: 'image',
          alt: 'Чёрно-белый кадр: Егор в оверсайз-футболке с вытянутой рукой',
        },
        { src: '/media/portrait-wall.jpg', kind: 'image', alt: 'Егор у красной стены под студийным светом' },
        { src: '/media/portrait-hands.jpg', kind: 'image', alt: 'Егор со сложенными ладонями на красном фоне' },
        { src: '/media/portrait-close.jpg', kind: 'image', alt: 'Крупный портрет Егора на красном фоне' },
        { src: '/media/portrait-profile.jpg', kind: 'image', alt: 'Егор в профиль, тёплый свет сбоку' },
      ],
      list: [
        { date: '2026-11-07', city: 'Москва', venue: 'Мутабор', upcoming: true },
        { date: '2026-11-22', city: 'Санкт-Петербург', venue: 'Присутствие', upcoming: true },
        { date: '2026-09-27', city: 'Москва', venue: 'NEFTЬ', upcoming: false },
        { date: '2026-08-16', city: 'Казань', venue: 'Werk', upcoming: false },
        { date: '2026-07-12', city: 'Сочи', venue: 'Ровесник', upcoming: false },
        { date: '2026-06-21', city: 'Нижний Новгород', venue: 'Сияние', upcoming: false },
        { date: '2026-05-30', city: 'Екатеринбург', venue: 'Фабрика', upcoming: false },
        { date: '2026-04-18', city: 'Москва', venue: 'Выход', upcoming: false },
      ],
    },
    etiqet: {
      title: 'ETIQET',
      text: 'Минимализм, качество, стиль. 100% хлопок, ограниченное количество, первые партии уже скоро. ETIQET — не просто одежда, это напоминание.',
      instagramUrl: 'https://instagram.com/etiqet',
      model: null,
      print: '/media/etiqet-wordmark.png',
      items: [
        {
          name: 'Новый дроп',
          price: 'предзаказ',
          image: '/media/etiqet-drop.jpg',
          kind: 'image',
          alt: 'Постер дропа ETIQET: двое в чёрных оверсайз-футболках',
        },
        {
          name: 'Футболка ETIQET',
          price: null,
          image: '/media/etiqet-tee.mp4',
          kind: 'video',
          alt: 'Видео: чёрная футболка ETIQET крупным планом',
        },
      ],
    },
    reel: { src: '/media/reel.mp4', poster: '/media/reel-poster.jpg' },
    contact: {
      bookingEmail: 'booking@djkennady.ru',
      telegram: '@djkennady',
      socials: [
        { label: 'Instagram', url: 'https://instagram.com/djkennady' },
        { label: 'SoundCloud', url: 'https://soundcloud.com/djkennady' },
        { label: 'Telegram', url: 'https://t.me/djkennady' },
        { label: 'YouTube', url: 'https://youtube.com/@djkennady' },
      ],
    },
  },
  en: {
    ui: {
      onRequest: 'on request',
      copy: 'Copy',
      copied: 'Copied',
      soundOn: 'Sound on',
      soundOff: 'Sound off',
      scrollHint: 'Scroll',
    },
    hero: {
      name: 'DJ Kennady',
      realName: 'Egor Morozov',
      city: 'Moscow',
      ctaBooking: 'Booking',
      ctaBrand: 'ETIQET',
    },
    manifesto: {
      lines: [
        'I play records and I make clothes.',
        'Same job, different hands.',
        'Behind the decks you decide how the night goes. Behind the sewing machine, how the morning after looks.',
      ],
      facts: [
        { value: '7', label: 'years behind the decks' },
        { value: '14', label: 'cities' },
        { value: '2', label: 'ETIQET drops' },
      ],
    },
    music: {
      title: 'Sets',
      tracks: [
        {
          num: '01',
          title: 'Night Shift',
          length: '58:20',
          platform: 'soundcloud',
          embedUrl: `${SC}1000000001`,
          poster: '/media/track-01.webp',
        },
        {
          num: '02',
          title: 'Garage on Skhodnya',
          length: '1:12:04',
          platform: 'soundcloud',
          embedUrl: `${SC}1000000002`,
          poster: '/media/track-02.webp',
        },
        {
          num: '03',
          title: 'ETIQET Drop 02 Mix',
          length: '41:37',
          platform: 'soundcloud',
          embedUrl: `${SC}1000000003`,
          poster: '/media/track-03.webp',
        },
      ],
    },
    shows: {
      title: 'Played at',
      shots: [
        {
          src: '/media/booth.jpg',
          kind: 'image',
          alt: 'Egor behind Pioneer decks in the red light of NEFT club',
        },
        {
          src: '/media/portrait-motion.jpg',
          kind: 'image',
          alt: 'Black and white frame: Egor in an oversized tee, arm outstretched',
        },
        { src: '/media/portrait-wall.jpg', kind: 'image', alt: 'Egor against a red wall under studio light' },
        { src: '/media/portrait-hands.jpg', kind: 'image', alt: 'Egor with hands pressed together on a red background' },
        { src: '/media/portrait-close.jpg', kind: 'image', alt: 'Close portrait of Egor on a red background' },
        { src: '/media/portrait-profile.jpg', kind: 'image', alt: 'Egor in profile, warm side light' },
      ],
      list: [
        { date: '2026-11-07', city: 'Moscow', venue: 'Mutabor', upcoming: true },
        { date: '2026-11-22', city: 'Saint Petersburg', venue: 'Prisutstvie', upcoming: true },
        { date: '2026-09-27', city: 'Moscow', venue: 'NEFT', upcoming: false },
        { date: '2026-08-16', city: 'Kazan', venue: 'Werk', upcoming: false },
        { date: '2026-07-12', city: 'Sochi', venue: 'Rovesnik', upcoming: false },
        { date: '2026-06-21', city: 'Nizhny Novgorod', venue: 'Siyanie', upcoming: false },
        { date: '2026-05-30', city: 'Yekaterinburg', venue: 'Fabrika', upcoming: false },
        { date: '2026-04-18', city: 'Moscow', venue: 'Vykhod', upcoming: false },
      ],
    },
    etiqet: {
      title: 'ETIQET',
      text: 'Minimalism, quality, style. 100% cotton, limited edition, first batches coming soon. ETIQET is not just clothing, it is a reminder.',
      instagramUrl: 'https://instagram.com/etiqet',
      model: null,
      print: '/media/etiqet-wordmark.png',
      items: [
        {
          name: 'New drop',
          price: 'preorder',
          image: '/media/etiqet-drop.jpg',
          kind: 'image',
          alt: 'ETIQET drop poster: two people in black oversized tees',
        },
        {
          name: 'ETIQET tee',
          price: null,
          image: '/media/etiqet-tee.mp4',
          kind: 'video',
          alt: 'Video: a black ETIQET tee up close',
        },
      ],
    },
    reel: { src: '/media/reel.mp4', poster: '/media/reel-poster.jpg' },
    contact: {
      bookingEmail: 'booking@djkennady.ru',
      telegram: '@djkennady',
      socials: [
        { label: 'Instagram', url: 'https://instagram.com/djkennady' },
        { label: 'SoundCloud', url: 'https://soundcloud.com/djkennady' },
        { label: 'Telegram', url: 'https://t.me/djkennady' },
        { label: 'YouTube', url: 'https://youtube.com/@djkennady' },
      ],
    },
  },
}

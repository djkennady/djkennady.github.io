import type { Content, Lang } from './types'

const SC = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/'

export const content: Record<Lang, Content> = {
  ru: {
    ui: {
      onRequest: 'по запросу',
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
        { src: '/media/shot-01.webp', kind: 'image', alt: 'Танцпол в дыму, руки над головами' },
        { src: '/media/shot-02.webp', kind: 'image', alt: 'Егор за пультом, свет сзади' },
        { src: '/media/shot-03.mp4', kind: 'video', alt: 'Съёмка с дека во время сета' },
        { src: '/media/shot-04.webp', kind: 'image', alt: 'Очередь на входе в клуб' },
        { src: '/media/shot-05.webp', kind: 'image', alt: 'Портрет в футболке ETIQET' },
        { src: '/media/shot-06.webp', kind: 'image', alt: 'Колонки и стробоскоп крупным планом' },
      ],
      list: [
        { date: '2026-11-07', city: 'Москва', venue: 'Мутабор', upcoming: true },
        { date: '2026-11-22', city: 'Санкт-Петербург', venue: 'Присутствие', upcoming: true },
        { date: '2026-09-27', city: 'Москва', venue: 'Арма', upcoming: false },
        { date: '2026-08-16', city: 'Казань', venue: 'Werk', upcoming: false },
        { date: '2026-07-12', city: 'Сочи', venue: 'Ровесник', upcoming: false },
        { date: '2026-06-21', city: 'Нижний Новгород', venue: 'Сияние', upcoming: false },
        { date: '2026-05-30', city: 'Екатеринбург', venue: 'Фабрика', upcoming: false },
        { date: '2026-04-18', city: 'Москва', venue: 'Выход', upcoming: false },
      ],
    },
    etiqet: {
      title: 'ETIQET',
      text: 'Одежда, которую я делаю для тех же людей, для которых ставлю музыку. Небольшие партии, плотный хлопок, принты, которые не стираются после пятой стирки. Новый дроп уходит за выходные.',
      instagramUrl: 'https://instagram.com/etiqet',
      model: null,
      print: null,
      items: [
        { name: 'Футболка Night Shift', price: '4 900 ₽', image: '/media/item-01.webp', alt: 'Чёрная футболка с принтом на спине' },
        { name: 'Худи Drop 02', price: '9 400 ₽', image: '/media/item-02.webp', alt: 'Серое худи с вышивкой на груди' },
        { name: 'Кепка ETIQET', price: '2 600 ₽', image: '/media/item-03.webp', alt: 'Чёрная кепка с логотипом' },
        { name: 'Лонгслив Archive', price: null, image: '/media/item-04.webp', alt: 'Белый лонгслив с принтом на рукаве' },
      ],
    },
    reel: { src: '/media/reel.mp4', poster: '/media/reel-poster.webp' },
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
        { src: '/media/shot-01.webp', kind: 'image', alt: 'Dancefloor in smoke, hands in the air' },
        { src: '/media/shot-02.webp', kind: 'image', alt: 'Egor behind the booth, backlit' },
        { src: '/media/shot-03.mp4', kind: 'video', alt: 'Footage shot from the decks mid-set' },
        { src: '/media/shot-04.webp', kind: 'image', alt: 'Queue at the club entrance' },
        { src: '/media/shot-05.webp', kind: 'image', alt: 'Portrait in an ETIQET tee' },
        { src: '/media/shot-06.webp', kind: 'image', alt: 'Speakers and a strobe up close' },
      ],
      list: [
        { date: '2026-11-07', city: 'Moscow', venue: 'Mutabor', upcoming: true },
        { date: '2026-11-22', city: 'Saint Petersburg', venue: 'Prisutstvie', upcoming: true },
        { date: '2026-09-27', city: 'Moscow', venue: 'Arma', upcoming: false },
        { date: '2026-08-16', city: 'Kazan', venue: 'Werk', upcoming: false },
        { date: '2026-07-12', city: 'Sochi', venue: 'Rovesnik', upcoming: false },
        { date: '2026-06-21', city: 'Nizhny Novgorod', venue: 'Siyanie', upcoming: false },
        { date: '2026-05-30', city: 'Yekaterinburg', venue: 'Fabrika', upcoming: false },
        { date: '2026-04-18', city: 'Moscow', venue: 'Vykhod', upcoming: false },
      ],
    },
    etiqet: {
      title: 'ETIQET',
      text: 'Clothes I make for the same people I play for. Small runs, heavy cotton, prints that survive more than five washes. A new drop is gone over a weekend.',
      instagramUrl: 'https://instagram.com/etiqet',
      model: null,
      print: null,
      items: [
        { name: 'Night Shift tee', price: '49 EUR', image: '/media/item-01.webp', alt: 'Black tee with a back print' },
        { name: 'Drop 02 hoodie', price: '94 EUR', image: '/media/item-02.webp', alt: 'Grey hoodie with chest embroidery' },
        { name: 'ETIQET cap', price: '26 EUR', image: '/media/item-03.webp', alt: 'Black cap with the logo' },
        { name: 'Archive longsleeve', price: null, image: '/media/item-04.webp', alt: 'White longsleeve with a sleeve print' },
      ],
    },
    reel: { src: '/media/reel.mp4', poster: '/media/reel-poster.webp' },
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

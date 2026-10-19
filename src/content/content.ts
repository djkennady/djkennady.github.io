import type { Content, Lang } from './types'

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
      city: 'Набережные Челны',
      ctaBooking: 'Букинг',
      ctaBrand: 'ETIQET',
    },
    manifesto: {
      lines: [
        'Я играю музыку и создаю одежду.',
        'И в том, и в другом — мой вкус, мой ритм и то, как я чувствую людей.',
        'Что-то хочется услышать ещё раз. Что-то — носить каждый день.',
      ],
      facts: [
        { value: '10', label: 'лет за вертушками' },
        { value: '7', label: 'городов' },
        { value: '4', label: 'дропа ETIQET' },
      ],
    },
    music: {
      title: 'Сеты',
      tracks: [],
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
        {
          date: '2026-10-23',
          city: 'Набережные Челны',
          venue: 'LAKI · вечеринка MTV',
          upcoming: true,
        },
        { date: '2026-10-24', city: 'Набережные Челны', venue: 'The Bird', upcoming: true },
      ],
    },
    etiqet: {
      title: 'ETIQET',
      text: 'Минимализм, качество, стиль. 100% хлопок, ограниченное количество, первые партии уже скоро. ETIQET — не просто одежда, это напоминание.',
      instagramUrl: 'https://www.instagram.com/dj_kennady/',
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
      bookingEmail: 'djkennady96@gmail.com',
      telegram: '@djkennady',
      socials: [
        { label: 'Instagram', url: 'https://www.instagram.com/dj_kennady/' },
        { label: 'Telegram', url: 'https://t.me/djkennady' },
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
      city: 'Naberezhnye Chelny',
      ctaBooking: 'Booking',
      ctaBrand: 'ETIQET',
    },
    manifesto: {
      lines: [
        'I play music and I make clothes.',
        'Both carry my taste, my rhythm and the way I read a room.',
        'Some of it you want to hear again. Some of it you want to wear every day.',
      ],
      facts: [
        { value: '10', label: 'years on the turntables' },
        { value: '7', label: 'cities' },
        { value: '4', label: 'ETIQET drops' },
      ],
    },
    music: {
      title: 'Sets',
      tracks: [],
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
        {
          date: '2026-10-23',
          city: 'Naberezhnye Chelny',
          venue: 'LAKI · MTV party',
          upcoming: true,
        },
        { date: '2026-10-24', city: 'Naberezhnye Chelny', venue: 'The Bird', upcoming: true },
      ],
    },
    etiqet: {
      title: 'ETIQET',
      text: 'Minimalism, quality, style. 100% cotton, limited edition, first batches coming soon. ETIQET is not just clothing, it is a reminder.',
      instagramUrl: 'https://www.instagram.com/dj_kennady/',
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
      bookingEmail: 'djkennady96@gmail.com',
      telegram: '@djkennady',
      socials: [
        { label: 'Instagram', url: 'https://www.instagram.com/dj_kennady/' },
        { label: 'Telegram', url: 'https://t.me/djkennady' },
      ],
    },
  },
}

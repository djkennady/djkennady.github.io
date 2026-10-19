export type Lang = 'ru' | 'en'

export type Social = { label: string; url: string }

export type Track = {
  num: string
  title: string
  length: string
  platform: 'soundcloud' | 'spotify' | 'youtube'
  embedUrl: string
  poster: string
}

export type Show = { date: string; city: string; venue: string; upcoming: boolean }

export type Item = { name: string; price: string | null; image: string; alt: string }

export type Shot = { src: string; kind: 'image' | 'video'; alt: string }

export type Content = {
  /** Короткие интерфейсные строки. В коде их нельзя писать литералом —
   *  иначе английская версия поедет с русскими словами. */
  ui: {
    onRequest: string
    copy: string
    copied: string
    soundOn: string
    soundOff: string
    scrollHint: string
  }
  hero: { name: string; realName: string; city: string; ctaBooking: string; ctaBrand: string }
  manifesto: { lines: string[]; facts: { value: string; label: string }[] }
  music: { title: string; tracks: Track[] }
  shows: { title: string; shots: Shot[]; list: Show[] }
  etiqet: {
    title: string
    text: string
    instagramUrl: string
    /** GLB-модель футболки и файл принта. null — штатное состояние: сцена
     *  тогда показывает ткань и не пытается грузить несуществующий файл. */
    model: string | null
    print: string | null
    items: Item[]
  }
  reel: { src: string; poster: string }
  contact: { bookingEmail: string; telegram: string; socials: Social[] }
}

import { torsoProfile, sleeveProfile, SHIRT } from './shirtProfile'

it('грудь шире подола', () => {
  expect(torsoProfile(0.85).rx).toBeGreaterThan(torsoProfile(0).rx)
})

it('корпус почти прямой: это оверсайз, а не приталенная футболка', () => {
  const low = [0, 0.15, 0.3, 0.45].map((v) => torsoProfile(v).rx)
  const spread = (Math.max(...low) - Math.min(...low)) / Math.min(...low)
  expect(spread).toBeLessThan(0.06)
})

it('футболка плоская, а не круглая в сечении', () => {
  for (const v of [0, 0.3, 0.6, 1]) {
    const { rx, rz } = torsoProfile(v)
    expect(rz).toBeLessThan(rx)
    expect(rz).toBeGreaterThan(0)
  }
})

it('сечение нигде не схлопывается', () => {
  for (let v = 0; v <= 1; v += 0.05) {
    expect(torsoProfile(v).rx).toBeGreaterThan(0.3)
  }
})

it('рукав сужается от проймы к краю', () => {
  expect(sleeveProfile(1)).toBeLessThan(sleeveProfile(0))
  expect(sleeveProfile(1)).toBeGreaterThan(0)
})

it('рукав уходит вниз, а не торчит горизонтально', () => {
  expect(SHIRT.sleeveDrop).toBeGreaterThan(0)
})

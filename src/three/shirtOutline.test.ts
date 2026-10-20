import { shirtOutline, SHIRT } from './shirtOutline'

const points = shirtOutline()

it('силуэт замкнут и состоит из осмысленного числа точек', () => {
  expect(points.length).toBeGreaterThan(8)
  const [first] = points
  const last = points[points.length - 1]
  expect(first).not.toEqual(last) // замыкает сама фигура, дубля точки нет
})

it('силуэт симметричен относительно вертикальной оси', () => {
  for (const [x, y] of points) {
    const mirrored = points.some(([mx, my]) => Math.abs(mx + x) < 1e-6 && Math.abs(my - y) < 1e-6)
    expect(mirrored, `нет зеркальной точки для ${x}, ${y}`).toBe(true)
  }
})

it('рукава шире корпуса', () => {
  const widest = Math.max(...points.map(([x]) => Math.abs(x)))
  // Окат рукава чуть выступает за опорную точку, поэтому сравнение не
  // точное: охраняем пропорцию, а не конкретную координату.
  expect(widest).toBeGreaterThanOrEqual(SHIRT.sleeveX)
  expect(widest).toBeGreaterThan(SHIRT.bodyX)
  expect(SHIRT.sleeveX).toBeGreaterThan(SHIRT.bodyX)
})

it('горловина опускается ниже линии плеч', () => {
  expect(SHIRT.neckDrop).toBeLessThan(SHIRT.shoulderY)
})

it('подол ниже подмышек', () => {
  expect(SHIRT.hemY).toBeLessThan(SHIRT.armpitY)
})

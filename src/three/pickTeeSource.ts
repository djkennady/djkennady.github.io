export type TeeSource = { kind: 'model'; url: string } | { kind: 'shirt' }

/** GLB-модели футболки может не быть — это штатный путь, а не поломка.
 *  Тогда блок бренда показывает футболку, собранную прямо в сцене: силуэт с
 *  рукавами, объём и логотип на груди. */
export function pickTeeSource(modelUrl: string | null): TeeSource {
  return modelUrl ? { kind: 'model', url: modelUrl } : { kind: 'shirt' }
}

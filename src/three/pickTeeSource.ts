export type TeeSource = { kind: 'model'; url: string } | { kind: 'fabric' }

/** GLB-модели футболки может не быть — это штатный путь, а не поломка.
 *  Тогда блок бренда показывает ту же ткань с принтом: рабочий результат,
 *  который позже меняется на модель без переделки секции. */
export function pickTeeSource(modelUrl: string | null): TeeSource {
  return modelUrl ? { kind: 'model', url: modelUrl } : { kind: 'fabric' }
}

/** Прозрачный пиксель. Загрузчики текстур нельзя звать условно, поэтому
 *  там, где картинки нет, подставляется он — и 404 не случается. */
export const BLANK =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII='

import { glyphChunk } from './glyph.glsl'

export const revealVertex = /* glsl */ `
  uniform float uMinY;
  uniform float uMaxY;

  varying float vH;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    vec4 world = modelMatrix * vec4(position, 1.0);
    vec4 mv = viewMatrix * world;
    vView = normalize(-mv.xyz);

    // Высота точки в долях габарита — та же формула, что normalizeHeight в
    // revealBounds.ts. Считается в мировых координатах, потому что габарит
    // приходит из Box3.setFromObject: у GLB бывают вложенные трансформы, и
    // локальный position.y разошёлся бы с этим габаритом. Вращение модели
    // идёт вокруг Y и мировую высоту не трогает, поэтому проход остаётся
    // горизонтальным, пока футболка крутится.
    vH = clamp((world.y - uMinY) / max(uMaxY - uMinY, 0.00001), 0.0, 1.0);

    gl_Position = projectionMatrix * mv;
  }
`

export const revealFragment = /* glsl */ `
  uniform vec3 uFg;
  uniform float uTime;
  uniform float uFront;
  uniform float uGlow;
  uniform float uBand;
  uniform float uDensity;
  uniform sampler2D uPrint;
  uniform float uHasPrint;

  varying float vH;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;

  ${glyphChunk}

  void main() {
    vec2 mask = revealMask(vH, uFront, uBand);

    // Выше фронта модели ещё нет. Именно discard, а не нулевая альфа: иначе
    // непроявленная половина всё равно пишется в буфер глубины и выгрызает
    // дыру в фоновом дожде.
    if (mask.x < 0.5) discard;

    // Знаки ползут по самой поверхности вниз, в ту же сторону, что фон.
    vec2 grid = vec2(vUv.x, vUv.y - uTime * 0.09) * uDensity;
    vec2 cell = floor(grid);
    float seed = hash21(cell);
    // Знак изредка перещёлкивается — без этого поверхность выглядит
    // напечатанной, а не живой.
    float tick = floor(uTime * 2.5 + seed * 10.0);
    float glyph = glyphCell(fract(grid), seed + tick);

    // Контур: грани, уходящие от взгляда по касательной, набирают плотность.
    // Отсюда берётся вайрфрейм силуэта без отдельной геометрии рёбер.
    float rim = 1.0 - abs(dot(normalize(vNormal), normalize(vView)));
    rim = pow(clamp(rim, 0.0, 1.0), 2.2);

    // Принт не красится, а добавляет плотности: в монохроме вордмарк — это
    // просто более насыщенные чернила на груди, и проявляется он вместе с
    // мешем, а не поверх него.
    vec4 print = texture2D(uPrint, vUv);
    float printed = print.a * uHasPrint;

    float ink = rim * 0.62 + glyph * 0.34 + printed * 0.55 + mask.y * uGlow * 1.5;

    gl_FragColor = vec4(uFg, clamp(ink, 0.0, 1.0));
  }
`

import { glyphChunk } from './glyph.glsl'

export const fabricVertex = /* glsl */ `
  uniform float uTime;
  uniform float uAmplitude;
  uniform vec2 uPointer;

  varying vec2 vUv;
  varying float vWave;

  void main() {
    vUv = uv;
    vec3 p = position;

    // Крупная волна плюс две сбивающие её гармоники, плюс мелкая рябь:
    // без последней полотно читается как мягкие пятна, а не как ткань.
    float wave =
        sin(p.x * 2.6 + uTime * 0.70) * 0.16
      + sin(p.y * 3.4 - uTime * 0.50) * 0.11
      + sin((p.x + p.y) * 2.1 + uTime * 0.35) * 0.09
      + sin((p.x - p.y) * 6.5 + uTime * 0.90) * 0.035;

    // Курсор тянет полотно к себе гауссовым пятном.
    float d = distance(p.xy, uPointer);
    float pull = exp(-d * d * 0.8) * 0.45;

    p.z += (wave + pull) * uAmplitude;
    vWave = p.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

export const fabricFragment = /* glsl */ `
  uniform vec3 uFg;
  uniform vec3 uBg;
  uniform sampler2D uTexture;
  uniform float uHasTexture;
  uniform vec2 uPrintScale;
  uniform float uTime;

  // Матричное проявление. Выключено по умолчанию: uFront = 1 и uGlow = 0
  // оставляют полотно героя ровно таким, каким оно было до появления
  // эффекта, — включает его только блок бренда.
  uniform float uFront;
  uniform float uGlow;
  uniform float uBand;
  uniform float uGlyph;
  uniform vec2 uDensity;

  varying vec2 vUv;
  varying float vWave;

  ${glyphChunk}

  void main() {
    vec2 mask = revealMask(vUv.y, uFront, uBand);

    // Выше фронта полотна ещё нет — сквозь него виден фоновый дождь.
    // При uFront = 1 это условие не срабатывает никогда.
    if (mask.x < 0.5) discard;

    // Свет считается от того, насколько складка поднята к зрителю.
    float shade = clamp(vWave * 1.9 + 0.5, 0.0, 1.0);
    // Полотно намеренно не доводится до полной яркости: поверх него лежит
    // крупный текст цветом --fg, и контраст должен остаться читаемым.
    vec3 base = mix(uBg, uFg, shade * shade * 0.42);

    // Знаки по полотну и вспышка на фронте — та же сетка, что в фоне и на
    // модели: чанк общий. Плотность разная по осям, потому что полотно 8x5:
    // со скаляром ячейки растягиваются и знаки сливаются в сплошной текст.
    vec2 grid = vec2(vUv.x, vUv.y - uTime * 0.09) * uDensity;
    float seed = hash21(floor(grid));
    float tick = floor(uTime * 2.5 + seed * 10.0);
    float glyph = glyphCell(fract(grid), seed + tick) * uGlyph;

    base = mix(base, uFg, clamp(glyph * 0.26 + mask.y * uGlow * 1.5, 0.0, 1.0));

    // Принт кладётся по центру полотна в своих пропорциях, а не растягивается
    // на всю плоскость, и за своими границами просто не рисуется.
    vec2 uv = (vUv - 0.5) / uPrintScale + 0.5;
    float inside =
        step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);

    vec4 tex = texture2D(uTexture, clamp(uv, 0.0, 1.0));
    vec3 printed = tex.rgb * (0.4 + shade * 0.75);

    gl_FragColor = vec4(mix(base, printed, uHasTexture * tex.a * inside), 1.0);
  }
`

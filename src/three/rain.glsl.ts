import { glyphChunk } from './glyph.glsl'

export const rainVertex = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const rainFragment = /* glsl */ `
  uniform vec3 uFg;
  uniform float uTime;
  uniform float uCols;
  uniform float uRows;
  uniform float uOpacity;

  varying vec2 vUv;

  ${glyphChunk}

  void main() {
    vec2 g = vec2(vUv.x * uCols, vUv.y * uRows);
    float col = floor(g.x);
    float row = floor(g.y);

    // У каждого столбца своя скорость и своя фаза — иначе дождь идёт строем
    // и сразу читается как заставка, а не как шум.
    float speed = 0.35 + hash21(vec2(col, 1.0)) * 0.95;
    float phase = hash21(vec2(col, 2.0)) * 100.0;
    float span = uRows + 10.0;
    float head = uRows + 5.0 - mod(uTime * speed * 6.0 + phase, span);

    // Хвост остаётся выше головы: столбец падает вниз и гаснет за собой.
    float behind = row - head;
    float trail = exp(-max(behind, 0.0) * 0.22) * step(0.0, behind);
    float headGlow = exp(-abs(behind) * 1.7);

    float seed = hash21(vec2(col, row));
    float tick = floor(uTime * 3.0 + seed * 10.0);
    float glyph = glyphCell(fract(g), seed + tick);

    // Края гасятся, чтобы дождь растворялся в секции, а не обрывался рамкой
    // по границе плоскости.
    float fade =
        smoothstep(0.0, 0.14, vUv.x) * smoothstep(1.0, 0.86, vUv.x)
      * smoothstep(0.0, 0.10, vUv.y) * smoothstep(1.0, 0.90, vUv.y);

    float ink = glyph * (trail * 0.5 + headGlow * 0.85);

    gl_FragColor = vec4(uFg, clamp(ink, 0.0, 1.0) * fade * uOpacity);
  }
`

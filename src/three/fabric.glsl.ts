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

  varying vec2 vUv;
  varying float vWave;

  void main() {
    // Свет считается от того, насколько складка поднята к зрителю.
    float shade = clamp(vWave * 1.9 + 0.5, 0.0, 1.0);
    // Полотно намеренно не доводится до полной яркости: поверх него лежит
    // крупный текст цветом --fg, и контраст должен остаться читаемым.
    vec3 base = mix(uBg, uFg, shade * shade * 0.42);

    vec4 tex = texture2D(uTexture, vUv);
    vec3 printed = tex.rgb * (0.4 + shade * 0.75);

    gl_FragColor = vec4(mix(base, printed, uHasTexture * tex.a), 1.0);
  }
`

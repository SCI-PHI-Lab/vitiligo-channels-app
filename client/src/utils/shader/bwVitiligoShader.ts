import { Skia } from '@shopify/react-native-skia';

// language=GLSL
const bwVitiligoShaderSource = `
uniform shader image;

uniform float redWeight;
uniform float yellowWeight;
uniform float greenWeight;
uniform float cyanWeight;
uniform float blueWeight;
uniform float magentaWeight;
uniform float lightnessRatio;

half4 main(float2 xy) {
  half4 color = image.eval(xy);

  float r0 = float(color.r);
  float g0 = float(color.g);
  float b0 = float(color.b);

  float gray = min(min(r0, g0), b0);

  float r = r0 - gray;
  float g = g0 - gray;
  float b = b0 - gray;

  float outValue = 0.0;

  if (r <= 0.0001) {
    float cyan = min(g, b);
    outValue =
      gray +
      cyan * cyanWeight +
      (g - cyan) * greenWeight +
      (b - cyan) * blueWeight;
  } else if (g <= 0.0001) {
    float magenta = min(r, b);
    outValue =
      gray +
      magenta * magentaWeight +
      (r - magenta) * redWeight +
      (b - magenta) * blueWeight;
  } else {
    float yellow = min(r, g);
    outValue =
      gray +
      yellow * yellowWeight +
      (r - yellow) * redWeight +
      (g - yellow) * greenWeight;
  }

  float lightness = dot(
    float3(r0, g0, b0),
    float3(0.2126, 0.7152, 0.0722)
  );

  outValue = mix(outValue, lightness, lightnessRatio);
  outValue = clamp(outValue, 0.0, 1.0);

  return half4(outValue, outValue, outValue, color.a);
}
`;

export const bwVitiligoShader = Skia.RuntimeEffect.Make(bwVitiligoShaderSource);

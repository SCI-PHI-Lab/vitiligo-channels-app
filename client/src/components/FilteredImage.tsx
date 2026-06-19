import { useMemo } from 'react';
import {
  Canvas,
  Fill,
  ImageShader,
  Shader,
  useImage,
} from '@shopify/react-native-skia';

import { vitiligoShader } from '~/utils/image/vitiligoShader';
import type { BWVitiligoFilterParams } from '~/utils/image/vitiligoFilterModel';

type Props = {
  imageUri: string;
  filter: BWVitiligoFilterParams;
  width: number;
  height: number;
};

export function FilteredImage({ imageUri, filter, width, height }: Props) {
  const image = useImage(imageUri);

  const uniforms = useMemo(
    () => ({
      redWeight: filter.weights.red / 100,
      yellowWeight: filter.weights.yellow / 100,
      greenWeight: filter.weights.green / 100,
      cyanWeight: filter.weights.cyan / 100,
      blueWeight: filter.weights.blue / 100,
      magentaWeight: filter.weights.magenta / 100,
      lightnessRatio: filter.lightnessRatio,
    }),
    [filter]
  );

  if (!vitiligoShader || !image) {
    return null;
  }

  return (
    <Canvas style={{ width, height }}>
      <Fill>
        <Shader source={vitiligoShader} uniforms={uniforms}>
          <ImageShader
            image={image}
            fit='contain'
            rect={{ x: 0, y: 0, width, height }}
          />
        </Shader>
      </Fill>
    </Canvas>
  );
}

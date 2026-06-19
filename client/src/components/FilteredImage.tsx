import { useMemo } from 'react';
import {
  Canvas,
  Fill,
  ImageShader,
  Shader,
  useImage,
} from '@shopify/react-native-skia';
import type { BWVitiligoFilterParams } from '~/utils/image/vitiligoFilterModel';
import { bwVitiligoShader } from '~/utils/shader/bwVitiligoShader';

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
      redWeight: filter.red / 100,
      yellowWeight: filter.yellow / 100,
      greenWeight: filter.green / 100,
      cyanWeight: filter.cyan / 100,
      blueWeight: filter.blue / 100,
      magentaWeight: filter.magenta / 100,
      lightnessRatio: filter.lightnessRatio,
    }),
    [filter]
  );

  if (!bwVitiligoShader || !image) {
    return null;
  }

  return (
    <Canvas style={{ width, height }}>
      <Fill>
        <Shader source={bwVitiligoShader} uniforms={uniforms}>
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

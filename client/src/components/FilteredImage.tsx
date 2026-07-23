import { useMemo } from 'react';
import {
  Canvas,
  Fill,
  ImageShader,
  Shader,
  useImage,
} from '@shopify/react-native-skia';
import type { BWVitiligoFilterParams } from '~/types/vitiligoFilterModel';
import { bwVitiligoShader } from '~/utils/shader/bwVitiligoShader';

type FilteredImageProps = {
  imageUri: string;
  filter: BWVitiligoFilterParams;
  width: number;
  height: number;
};

/** Renders a Skia Canvas image after applying the black-and-white vitiligo shader to it */
export function FilteredImage({
  imageUri,
  filter,
  width,
  height,
}: FilteredImageProps) {
  const image = useImage(imageUri);

  const uniforms: BWVitiligoFilterParams = useMemo(
    () => ({
      redWeight: filter.redWeight / 100,
      yellowWeight: filter.yellowWeight / 100,
      greenWeight: filter.greenWeight / 100,
      cyanWeight: filter.cyanWeight / 100,
      blueWeight: filter.blueWeight / 100,
      magentaWeight: filter.magentaWeight / 100,
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
            fit='cover'
            rect={{ x: 0, y: 0, width, height }}
          />
        </Shader>
      </Fill>
    </Canvas>
  );
}

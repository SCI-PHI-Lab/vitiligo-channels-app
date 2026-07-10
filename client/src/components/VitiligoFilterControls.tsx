import { Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import {
  BWVitiligoFilterParams,
  DEFAULT_BW_VITILIGO_FILTER,
} from '~/types/vitiligoFilterModel';
import { useEffect, useState } from 'react';

type VitiligoFilterControlsProps = {
  filterParams: BWVitiligoFilterParams;
  setFilterParams: (value: BWVitiligoFilterParams) => void;
};

export function VitiligoFilterControls({
  filterParams,
  setFilterParams,
}: VitiligoFilterControlsProps) {
  const [strength, setStrength] = useState(100);

  useEffect(() => {
    const multiplier = strength * 0.01;
    const baseline = DEFAULT_BW_VITILIGO_FILTER;

    setFilterParams({
      ...filterParams,
      redWeight: baseline.redWeight * multiplier,
      yellowWeight: baseline.yellowWeight * multiplier,
      greenWeight: baseline.greenWeight * multiplier,
      cyanWeight: baseline.cyanWeight * multiplier,
      blueWeight: baseline.blueWeight * multiplier,
      magentaWeight: baseline.magentaWeight * multiplier,
    });
  }, [strength]);

  return (
    <View style={{ gap: 16 }}>
      <Text>Strength: {strength}%</Text>
      <Slider
        minimumValue={-100}
        maximumValue={200}
        step={1}
        value={strength}
        onValueChange={nextValue => setStrength(nextValue)}
      />

      <View>
        <Text>
          Lightness Contribution:{' '}
          {Math.round(filterParams.lightnessRatio * 100)}%
        </Text>

        <Slider
          minimumValue={0}
          maximumValue={1}
          step={0.01}
          value={filterParams.lightnessRatio}
          onValueChange={nextValue => {
            setFilterParams({
              ...filterParams,
              lightnessRatio: nextValue,
            });
          }}
        />
      </View>
    </View>
  );
}

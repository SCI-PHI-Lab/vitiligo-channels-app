import { Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import type { BWVitiligoFilterParams } from '~/utils/image/vitiligoFilterModel';

type Props = {
  value: BWVitiligoFilterParams;
  onChange: (value: BWVitiligoFilterParams) => void;
};

const CHANNELS = [
  ['red', 'Red'],
  ['yellow', 'Yellow'],
  ['green', 'Green'],
  ['cyan', 'Cyan'],
  ['blue', 'Blue'],
  ['magenta', 'Magenta'],
] as const;

export function VitiligoFilterControls({ value, onChange }: Props) {
  return (
    <View style={{ gap: 16 }}>
      {CHANNELS.map(([key, label]) => (
        <View key={key}>
          <Text>
            {label}: {value[key]}
          </Text>

          <Slider
            minimumValue={-300}
            maximumValue={300}
            step={1}
            value={value[key]}
            onValueChange={nextValue => {
              onChange({
                ...value,
                [key]: nextValue,
              });
            }}
          />
        </View>
      ))}

      <View>
        <Text>
          Lightness Contribution: {Math.round(value.lightnessRatio * 100)}%
        </Text>

        <Slider
          minimumValue={0}
          maximumValue={1}
          step={0.01}
          value={value.lightnessRatio}
          onValueChange={nextValue => {
            onChange({
              ...value,
              lightnessRatio: nextValue,
            });
          }}
        />
      </View>
    </View>
  );
}

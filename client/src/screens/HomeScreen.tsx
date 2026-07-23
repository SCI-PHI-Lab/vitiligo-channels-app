import { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { RootStackParamList } from '~/screens/RootNavigator';
import { useImageStore } from '~/utils/image/imageStore';
import { launchImageLibraryAsync } from 'expo-image-picker';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const setInputImageUri = useImageStore(s => s.setInputImageUri);
  const [isPickingImage, setIsPickingImage] = useState(false);

  const pickImage = async () => {
    try {
      setIsPickingImage(true);

      const result = await launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
        allowsEditing: false,
        allowsMultipleSelection: false,
        exif: false,
      });

      if (result.canceled) {
        return;
      }

      const imageUri = result.assets[0]?.uri;

      if (!imageUri) {
        Alert.alert('No image selected', 'Please choose another image.');
        return;
      }

      setInputImageUri(imageUri);
      navigation.navigate('Edit', { imageUri });
    } catch (error) {
      Alert.alert(
        'Could not open image',
        error instanceof Error
          ? error.message
          : 'Something went wrong while opening your photo library.'
      );
    } finally {
      setIsPickingImage(false);
    }
  };

  const takePhoto = () => {
    navigation.navigate('Camera');
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      bounces={false}
    >
      <View style={styles.hero}>
        <Text style={styles.title}>
          Enhance contrast of depigmented lesions
        </Text>
        <Text style={styles.subtitle}>
          Upload an image or take a photo, then use our custom colour filtering
          algorithm to enhance lesion contrast in the editor
        </Text>
      </View>

      <View style={styles.previewCard}>
        <View style={styles.previewImagePlaceholder}>
          <Text style={styles.previewIcon}>◐</Text>
        </View>

        <View style={styles.previewTextContainer}>
          <Text style={styles.previewTitle}>Ready to start</Text>
          <Text style={styles.previewDescription}>
            Choose a clear, well-lit image for the best preview result.
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <ActionCard
          title='Upload image'
          description='Pick an image from your library'
          icon='↥'
          onPress={pickImage}
          disabled={isPickingImage}
          loading={isPickingImage}
          variant='primary'
        />

        <ActionCard
          title='Take photo'
          description='Use camera to capture a photo'
          icon='◎'
          onPress={takePhoto}
          disabled={isPickingImage}
        />
      </View>

      <View style={styles.footerCard}>
        <Text style={styles.footerTitle}>Tip</Text>
        <Text style={styles.footerText}>
          For best results, avoid harsh shadows and keep the affected area
          centered in the frame
        </Text>
      </View>
    </ScrollView>
  );
}

type ActionCardProps = {
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
};

function ActionCard({
  title,
  description,
  icon,
  onPress,
  disabled = false,
  loading = false,
  variant = 'secondary',
}: ActionCardProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.actionCard,
        isPrimary ? styles.primaryActionCard : styles.secondaryActionCard,
        pressed && !disabled ? styles.actionCardPressed : null,
        disabled ? styles.actionCardDisabled : null,
      ]}
    >
      <View
        style={[
          styles.actionIconContainer,
          isPrimary
            ? styles.primaryActionIconContainer
            : styles.secondaryActionIconContainer,
        ]}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text
            style={[
              styles.actionIcon,
              isPrimary ? styles.primaryActionIcon : styles.secondaryActionIcon,
            ]}
          >
            {icon}
          </Text>
        )}
      </View>

      <View style={styles.actionTextContainer}>
        <Text
          style={[
            styles.actionTitle,
            isPrimary ? styles.primaryActionTitle : null,
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.actionDescription,
            isPrimary ? styles.primaryActionDescription : null,
          ]}
        >
          {description}
        </Text>
      </View>

      <Text
        style={[
          styles.actionArrow,
          isPrimary ? styles.primaryActionArrow : null,
        ]}
      >
        →
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actionArrow: {
    color: '#4b5563',
    fontSize: 24,
    fontWeight: '700',
  },
  actionCard: {
    alignItems: 'center',
    borderRadius: 22,
    flexDirection: 'row',
    gap: 14,
    minHeight: 108,
    padding: 18,
  },
  actionCardDisabled: {
    opacity: 0.65,
  },
  actionCardPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  actionDescription: {
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 20,
  },
  actionIcon: {
    fontSize: 28,
    fontWeight: '700',
  },
  actionIconContainer: {
    alignItems: 'center',
    borderRadius: 18,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  actionTextContainer: {
    flex: 1,
    gap: 4,
  },
  actionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  actions: {
    gap: 14,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0f2fe',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#0369a1',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  content: {
    gap: 24,
    padding: 24,
    paddingBottom: 36,
  },
  footerCard: {
    backgroundColor: '#f8fafc',
    borderColor: '#e5e7eb',
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
    padding: 16,
  },
  footerText: {
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 20,
  },
  footerTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
  },
  hero: {
    gap: 14,
    paddingTop: 36,
  },
  previewCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 26,
    borderWidth: 1,
    gap: 18,
    padding: 18,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  previewDescription: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  previewIcon: {
    color: '#0f172a',
    fontSize: 64,
    fontWeight: '700',
  },
  previewImagePlaceholder: {
    alignItems: 'center',
    aspectRatio: 1.45,
    backgroundColor: '#eef2ff',
    borderRadius: 20,
    justifyContent: 'center',
  },
  previewTextContainer: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  previewTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  primaryActionArrow: {
    color: '#ffffff',
  },
  primaryActionCard: {
    backgroundColor: '#0f172a',
  },
  primaryActionDescription: {
    color: '#cbd5e1',
  },
  primaryActionIcon: {
    color: '#0f172a',
  },
  primaryActionIconContainer: {
    backgroundColor: '#ffffff',
  },
  primaryActionTitle: {
    color: '#ffffff',
  },
  screen: {
    backgroundColor: '#f3f4f6',
    flex: 1,
  },
  secondaryActionCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  secondaryActionIcon: {
    color: '#0f172a',
  },
  secondaryActionIconContainer: {
    backgroundColor: '#f1f5f9',
  },
  subtitle: {
    color: '#4b5563',
    fontSize: 17,
    lineHeight: 25,
  },
  title: {
    color: '#111827',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: 42,
  },
});

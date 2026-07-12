// A drop-in replacement for Pressable that gently scales down while
// pressed, using react-native-reanimated. The animation runs on the
// native UI thread, so it stays smooth even if JavaScript is busy.

import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
};

export default function PressableScale({ style, onPressIn, onPressOut, children, ...rest }: Props) {
  // A "shared value" is animation state that lives on the UI thread.
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));

  return (
    <AnimatedPressable
      {...rest}
      style={[style, animatedStyle]}
      onPressIn={(event) => {
        scale.set(withSpring(0.96, { damping: 18, stiffness: 300 }));
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.set(withSpring(1, { damping: 18, stiffness: 300 }));
        onPressOut?.(event);
      }}
    >
      {children}
    </AnimatedPressable>
  );
}

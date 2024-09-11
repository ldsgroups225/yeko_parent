import React from 'react';
import { FlatList, FlatListProps, RefreshControl } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

interface AnimatedFlatListProps<T> extends Omit<FlatListProps<T>, 'renderItem'> {
  renderItem: (info: { item: T; index: number }) => React.ReactElement;
  onRefresh?: () => void;
  refreshing?: boolean;
}

function AnimatedFlatList<T>({
  renderItem,
  onRefresh,
  refreshing = false,
  ...props
}: AnimatedFlatListProps<T>) {
  const animatedRenderItem = ({ item, index }: { item: T; index: number }) => (
    <Animated.View
      entering={FadeIn.delay(index * 50).springify()}
      exiting={FadeOut}
      layout={LinearTransition.springify()}
    >
      {renderItem({ item, index })}
    </Animated.View>
  );

  return (
    <FlatList
      {...props}
      renderItem={animatedRenderItem}
      refreshControl={
        onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined
      }
    />
  );
}

export default AnimatedFlatList;

import { useTheme } from '@hooks/index';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const LoadingScreen: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;

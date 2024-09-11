import CsText from '@components/CsText';
import { useThemedStyles } from '@hooks/index';
import * as React from 'react';
import { View } from 'react-native';
import { styles } from './style';
import { CsDividerProps } from './type';

export const CsDivider = ({ title }: CsDividerProps) => {
  const themedStyles = useThemedStyles<typeof styles>(styles);

  return (
    <View style={themedStyles.divider}>
      <View style={themedStyles.dividerLine} />
      {title && (
        <>
          <CsText variant="caption" style={themedStyles.dividerText}>
            OR
          </CsText>
          <View style={themedStyles.dividerLine} />
        </>
      )}
    </View>
  );
};

export default CsDivider;

import CsText from './CsText';
import { useThemedStyles } from '@/hooks';
import { spacing } from '@/styles';
import React from 'react';
import { StyleSheet } from 'react-native';

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  const themedStyles = useThemedStyles<typeof styles>(styles);

  return (
    <CsText variant="h2" style={themedStyles.sectionTitle}>
      {title}
    </CsText>
  );
};

const styles = () =>
  StyleSheet.create({
    sectionTitle: {
      marginTop: spacing.md,
      marginBottom: spacing.sm,
      paddingHorizontal: spacing.md,
    },
  });

export default SectionHeader;

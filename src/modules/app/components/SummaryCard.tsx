import CsCard from "@components/CsCard";
import CsText from "@components/CsText";
import { Ionicons } from "@expo/vector-icons";
import { useThemedStyles } from "@hooks/index";
import { spacing } from "@styles/spacing";
import React from "react";
import { StyleSheet, View } from "react-native";

interface SummaryItemProps {
  label: string;
  value: string | number;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}

interface NoteSummary {
  averageNote: number;
  bestSubject: string;
  worstSubject: string;
}

type SummaryCardProps = {
  items: SummaryItemProps[] | NoteSummary;
  primaryColor: string;
  successColor: string;
  warningColor: string;
};

const SummaryCard: React.FC<SummaryCardProps> = ({
  items,
  primaryColor,
  successColor,
  warningColor,
}) => {
  const themedStyles = useThemedStyles<typeof styles>(styles);

  const renderItems = () => {
    if (Array.isArray(items)) {
      return items.map((item, index) => <SummaryItem key={index} {...item} />);
    } else {
      return [
        <SummaryItem
          key="average"
          label="Moyenne Générale"
          value={items.averageNote}
          icon="school-outline"
          color={primaryColor}
        />,
        <SummaryItem
          key="best"
          label="Meilleure Matière"
          value={items.bestSubject}
          icon="trophy-outline"
          color={successColor}
        />,
        <SummaryItem
          key="worst"
          label="Matière à Améliorer"
          value={items.worstSubject}
          icon="trending-up-outline"
          color={warningColor}
        />,
      ];
    }
  };

  return (
    <CsCard style={themedStyles.summaryCard}>
      <View style={themedStyles.summaryRow}>{renderItems()}</View>
    </CsCard>
  );
};

const SummaryItem: React.FC<SummaryItemProps> = ({
  icon,
  value,
  label,
  color,
}) => {
  const themedStyles = useThemedStyles<typeof styles>(styles);
  return (
    <View style={themedStyles.summaryItem}>
      <Ionicons name={icon} size={24} color={color} />
      <CsText variant="h3" style={{ ...themedStyles.summaryValue, color }}>
        {value}
      </CsText>
      <CsText variant="caption" style={themedStyles.summaryLabel}>
        {label}
      </CsText>
    </View>
  );
};

const styles = () =>
  StyleSheet.create({
    summaryCard: {
      marginBottom: spacing.md,
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "flex-start",
    },
    summaryItem: {
      alignItems: "center",
      flex: 1,
    },
    summaryValue: {
      marginVertical: spacing.xs,
      textAlign: "center",
    },
    summaryLabel: {
      textAlign: "center",
    },
  });

export default SummaryCard;

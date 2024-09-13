import CsCard from "@components/CsCard";
import CsText from "@components/CsText";
import { Ionicons } from "@expo/vector-icons";
import { useThemedStyles } from "@hooks/index";
import { spacing } from "@src/styles";
import { ITheme } from "@styles/theme";
import React, { useState } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface Template {
  id: string;
  title: string;
  description: string;
  recipient: "teacher" | "admin";
}

interface NewConversationModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
  animatedValue: Animated.Value;
  modalTranslateY: Animated.AnimatedInterpolation<number>;
}

const templates: Template[] = [
  {
    id: "1",
    title: "Retards répétés",
    description: "Discuter des retards fréquents de votre enfant",
    recipient: "teacher",
  },
  {
    id: "2",
    title: "Performance scolaire",
    description: "S'enquérir des résultats scolaires de votre enfant",
    recipient: "teacher",
  },
  {
    id: "3",
    title: "Paiement de la scolarité",
    description: "Discuter des frais de scolarité ou des modalités de paiement",
    recipient: "admin",
  },
  {
    id: "4",
    title: "Demande de rendez-vous",
    description:
      "Solliciter une rencontre avec un enseignant ou l'administration",
    recipient: "admin",
  },
  {
    id: "5",
    title: "Problème de comportement",
    description: "Discuter d'un problème de comportement signalé",
    recipient: "teacher",
  },
  {
    id: "6",
    title: "Activités extrascolaires",
    description: "Se renseigner sur les activités extrascolaires disponibles",
    recipient: "admin",
  },
];

const NewConversationModal: React.FC<NewConversationModalProps> = ({
  visible,
  onClose,
  onSelectTemplate,
  animatedValue,
  modalTranslateY,
}) => {
  const themedStyles = useThemedStyles<typeof styles>(styles);
  const [selectedRecipient, setSelectedRecipient] = useState<
    "all" | "teacher" | "admin"
  >("all");

  const filteredTemplates = templates.filter(
    (template) =>
      selectedRecipient === "all" || template.recipient === selectedRecipient
  );

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="none"
    >
      <Animated.View
        style={[
          themedStyles.modalContainer,
          {
            opacity: animatedValue,
            transform: [{ translateY: modalTranslateY }],
          },
        ]}
      >
        <View style={themedStyles.modalContent}>
          <View style={themedStyles.modalHeader}>
            <CsText style={themedStyles.modalTitle}>Nouvelle discussion</CsText>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close"
                size={24}
                color={themedStyles.icon.color}
              />
            </TouchableOpacity>
          </View>
          <View style={themedStyles.filterContainer}>
            {(["all", "teacher", "admin"] as const).map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  themedStyles.filterButton,
                  selectedRecipient === filter &&
                    themedStyles.selectedFilterButton,
                ]}
                onPress={() => setSelectedRecipient(filter)}
              >
                <CsText
                  style={StyleSheet.flatten([
                    themedStyles.filterButtonText,
                    selectedRecipient === filter &&
                      themedStyles.selectedFilterButtonText,
                  ])}
                >
                  {filter === "all"
                    ? "Tous"
                    : filter === "teacher"
                    ? "Professeurs"
                    : "Administration"}
                </CsText>
              </TouchableOpacity>
            ))}
          </View>
          <ScrollView style={themedStyles.templateList}>
            {filteredTemplates.map((template) => (
              <TouchableOpacity
                key={template.id}
                onPress={() => onSelectTemplate(template)}
              >
                <CsCard style={themedStyles.templateCard}>
                  <CsText variant="h3" style={themedStyles.templateTitle}>
                    {template.title}
                  </CsText>
                  <CsText style={themedStyles.templateDescription}>
                    {template.description}
                  </CsText>
                  <CsText style={themedStyles.recipientText}>
                    {template.recipient === "teacher"
                      ? "Professeur"
                      : "Administration"}
                  </CsText>
                </CsCard>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = (theme: ITheme) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: spacing.md,
      maxHeight: "80%",
      flex: 1, // Add this line
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.md,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
    },
    filterContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: spacing.md,
    },
    filterButton: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    selectedFilterButton: {
      backgroundColor: theme.primary,
    },
    filterButtonText: {
      color: theme.primary,
    },
    selectedFilterButtonText: {
      color: theme.background,
    },
    templateList: {
      flex: 1,
    },
    templateCard: {
      marginBottom: spacing.sm,
      padding: spacing.sm,
    },
    templateTitle: {
      marginBottom: spacing.xs,
    },
    templateDescription: {
      color: theme.textLight,
      marginBottom: spacing.xs,
    },
    recipientText: {
      color: theme.primary,
      fontWeight: "bold",
    },
    icon: {
      color: theme.text,
    },
  });

export default NewConversationModal;

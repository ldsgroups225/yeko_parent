import React, { useEffect, useState } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { CsCard, CsText, LoadingSpinner } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { useThemedStyles } from "@/hooks";
import { ITheme, spacing } from "@/styles";

interface Template {
  id: number;
  title: string;
  description: string;
  recipient: "teacher" | "admin";
}

interface NewConversationModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template | "custom") => void;
  animatedValue: Animated.Value;
  modalTranslateY: Animated.AnimatedInterpolation<number>;
}

const NewConversationModal: React.FC<NewConversationModalProps> = ({
  visible,
  onClose,
  onSelectTemplate,
  animatedValue,
  modalTranslateY,
}) => {
  const themedStyles = useThemedStyles<typeof styles>(styles);
  const [selectedRecipient, setSelectedRecipient] = useState<"all" | "teacher" | "admin">("all");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_topics')
          .select('id, title, default_message')
          .eq('is_active', true)
          .order('created_at', { ascending: true });

        if (error) throw error;

        const mappedTemplates: Template[] = data.map(topic => ({
          id: topic.id,
          title: topic.title,
          description: topic.default_message,
          recipient: "teacher" // All predefined topics go to teachers
        }));

        setTemplates(mappedTemplates);
        setError("");
      } catch (err) {
        console.error("Failed to load chat topics:", err);
        setError("Failed to load discussion topics. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (visible) fetchTopics();
  }, [visible]);

  const filteredTemplates = [
    ...templates.filter(t => 
      selectedRecipient === "all" || t.recipient === selectedRecipient
    ),
    ...(selectedRecipient !== "teacher" ? [{
      id: -1,
      title: "Discussion personnalisée",
      description: "Démarrer une conversation libre avec l'administration",
      recipient: "admin"
    } satisfies Template] : [])
  ];

  const handleSelect = (template: Template | "custom") => {
    if (template === "custom") {
      onSelectTemplate({
        id: -1,
        title: "Discussion personnalisée",
        description: "",
        recipient: "admin"
      });
    } else {
      onSelectTemplate(template);
    }
  };

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
              <Ionicons name="close" size={24} color={themedStyles.icon.color} />
            </TouchableOpacity>
          </View>

          <View style={themedStyles.filterContainer}>
            {(["all", "teacher", "admin"] as const).map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  themedStyles.filterButton,
                  selectedRecipient === filter && themedStyles.selectedFilterButton,
                ]}
                onPress={() => setSelectedRecipient(filter)}
              >
                <CsText
                  style={StyleSheet.flatten([
                    themedStyles.filterButtonText,
                    selectedRecipient === filter && themedStyles.selectedFilterButtonText,
                  ])}
                >
                  {filter === "all" ? "Tous" : 
                   filter === "teacher" ? "Professeurs" : "Administration"}
                </CsText>
              </TouchableOpacity>
            ))}
          </View>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <View style={themedStyles.errorContainer}>
              <Ionicons name="warning" size={32} color={themedStyles.warning.color} />
              <CsText style={themedStyles.errorText}>{error}</CsText>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {filteredTemplates.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  onPress={() => 
                    template.id === -1 
                      ? handleSelect("custom") 
                      : handleSelect(template)
                  }
                >
                  <CsCard style={themedStyles.templateCard}>
                    <CsText variant="h3" style={themedStyles.templateTitle}>
                      {template.title}
                    </CsText>
                    <CsText style={themedStyles.templateDescription}>
                      {template.description}
                    </CsText>
                    <View style={themedStyles.footer}>
                      <CsText style={themedStyles.recipientText}>
                        {template.recipient === "teacher" 
                          ? "Professeur" 
                          : "Administration"}
                      </CsText>
                      {template.id === -1 && (
                        <CsText style={themedStyles.customBadge}>Personnalisé</CsText>
                      )}
                    </View>
                  </CsCard>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
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
      gap: spacing.xs,
    },
    filterButton: {
      flex: 1,
      paddingVertical: spacing.xs,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.primary,
      alignItems: "center",
    },
    selectedFilterButton: {
      backgroundColor: theme.primary,
    },
    filterButtonText: {
      color: theme.primary,
      fontSize: 14,
    },
    selectedFilterButtonText: {
      color: theme.background,
    },
    templateCard: {
      marginBottom: spacing.sm,
      padding: spacing.sm,
    },
    templateTitle: {
      marginBottom: spacing.xs,
      color: theme.primary,
    },
    templateDescription: {
      color: theme.textLight,
      marginBottom: spacing.xs,
      fontSize: 14,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    recipientText: {
      color: theme.textLight,
      fontSize: 12,
    },
    customBadge: {
      backgroundColor: theme.primaryLight,
      color: theme.primary,
      paddingHorizontal: spacing.xs,
      borderRadius: 4,
      fontSize: 12,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: spacing.xl,
      gap: spacing.md,
    },
    errorText: {
      color: theme.warning,
      textAlign: "center",
    },
    warning: {
      color: theme.warning,
    },
    icon: {
      color: theme.text,
    },
  });

export default NewConversationModal;

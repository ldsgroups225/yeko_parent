import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { supabase } from "@/lib/supabase";
import { CsCard, CsText, LoadingSpinner } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { useChat, useThemedStyles } from "@/hooks";
import { ITheme, spacing } from "@/styles";
import { useAppSelector } from "@/store";
import { useRouter } from "expo-router";

interface Template {
  id: number;
  title: string;
  description: string;
  recipient: "teacher" | "admin";
}

const NewConversationModal: React.FC = () => {
  const user = useAppSelector((s) => s?.AppReducer?.user);
  const selectedStudent = useAppSelector((s) => s?.AppReducer?.selectedStudent);
  const { createNewChat, loading: isSubmitting, error: submittionError } = useChat();
  const router = useRouter();
  const themedStyles = useThemedStyles<typeof styles>(styles);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<"all" | "teacher" | "admin">("all");

  const fetchTopics = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("chat_topics")
        .select("id, title, default_message")
        .eq("is_active", true)
        .order("created_at", { ascending: true });
      if (error) throw error;
      setTemplates(
        data.map((topic: any) => ({
          id: topic.id,
          title: topic.title,
          description: topic.default_message,
          recipient: "teacher",
        }))
      );
      setError("");
    } catch (err) {
      console.error("Failed to load chat topics:", err);
      setError("Failed to load discussion topics. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const translateY = useSharedValue(300);
  useEffect(() => {
    translateY.value = withTiming(0, { duration: 300 });
  }, []);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const filteredTemplates = useMemo(() => {
    const base = templates.filter(
      (t) => selectedRecipient === "all" || t.recipient === selectedRecipient
    );
    if (selectedRecipient !== "teacher") {
      base.push({
        id: -1,
        title: "Discussion personnalisée",
        description: "Démarrer une conversation libre avec l'administration",
        recipient: "admin",
      });
    }
    return base;
  }, [templates, selectedRecipient]);

  const handleSelectTemplate = async (template: Template | "custom") => {
    if (isSubmitting || !selectedStudent || !user) return;
    const baseData = {
      studentId: selectedStudent.id,
      parentId: user.id,
      schoolId: selectedStudent.school.id,
      classId: selectedStudent.class.id,
    };
    const chatData = template === "custom"
      ? { ...baseData, lastMessage: 'Problématique non structurée' }
      : { ...baseData, topicId: template.id, lastMessage: template.title };
    try {
      const newChat = await createNewChat(chatData);
      router.replace(`/(app)/(protected)/(details)/${newChat.id}`);
    } catch (e) {
      console.error("Chat creation failed:", e);
    }
  };

  return (
    <Animated.View style={[themedStyles.modalContainer, animatedStyle]}>
      <View style={themedStyles.modalContent}>
        <View style={themedStyles.modalHeader}>
          <CsText style={themedStyles.modalTitle}>Nouvelle discussion</CsText>
          <TouchableOpacity onPress={() => router.back()}>
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
              disabled={isSubmitting}
            >
              <CsText
                style={StyleSheet.flatten([
                  themedStyles.filterButtonText,
                  selectedRecipient === filter && themedStyles.selectedFilterButtonText,
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
        {loading ? (
          <View style={{ paddingVertical: spacing.md }}>
            <LoadingSpinner />
          </View>
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
                    ? handleSelectTemplate("custom")
                    : handleSelectTemplate(template)
                }
                disabled={isSubmitting}
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
                      {template.recipient === "teacher" ? "Professeur" : "Administration"}
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
        {submittionError && (
          <View style={themedStyles.errorContainer}>
            <Ionicons name="warning" size={32} color={themedStyles.warning.color} />
            <CsText style={themedStyles.errorText}>{submittionError}</CsText>
          </View>
        )}
      </View>
    </Animated.View>
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

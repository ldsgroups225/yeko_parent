import CsCard from "@components/CsCard";
import CsText from "@components/CsText";
import { Ionicons } from "@expo/vector-icons";
import { navigationRef } from "@helpers/router";
import { useThemedStyles } from "@hooks/index";
import useDataFetching from "@hooks/useDataFetching";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { shadows, spacing } from "@src/styles";
import { ITheme } from "@styles/theme";
import Routes from "@utils/Routes";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  AnimatedFlatList,
  LoadingScreen,
  SummaryCard,
} from "../components/index";
import { formatDate } from "../utils/index";
import NewConversationModal from "./NewConversationModal";

interface Conversation {
  id: string;
  topic: string;
  lastMessage: string;
  lastMessageDate: Date;
  unreadCount: number;
  participants: string[];
}

interface Template {
  id: string;
  title: string;
  description: string;
  recipient: "teacher" | "admin";
}

type RootStackParamList = {
  ConversationDetail: {
    templateId: string;
    templateTitle: string;
    recipient: "teacher" | "admin";
  };
};

type DiscussionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ConversationDetail"
>;

const DiscussionScreen: React.FC = () => {
  const navigation = useNavigation<DiscussionScreenNavigationProp>();
  const themedStyles = useThemedStyles<typeof styles>(styles);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isNewConversationModalVisible, setNewConversationModalVisible] =
    useState(false);

  const modalAnimatedValue = useRef(new Animated.Value(0)).current;
  const modalBackgroundOpacity = modalAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });
  const modalTranslateY = modalAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const fetchConversations = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockData: Conversation[] = [
      {
        id: "1",
        topic: "Retards répétés",
        lastMessage:
          "Nous devons discuter des retards fréquents de votre enfant.",
        lastMessageDate: new Date(2024, 3, 15),
        unreadCount: 2,
        participants: ["M. Kouassi (Professeur principal)"],
      },
      {
        id: "2",
        topic: "Paiement de la scolarité",
        lastMessage: "Rappel : le prochain versement est dû le 30 avril.",
        lastMessageDate: new Date(2024, 3, 20),
        unreadCount: 0,
        participants: ["Mme Bamba (Administration)"],
      },
      {
        id: "3",
        topic: "Problème de comportement",
        lastMessage:
          "Votre enfant a été impliqué dans un incident aujourd'hui.",
        lastMessageDate: new Date(2024, 3, 22),
        unreadCount: 1,
        participants: ["M. Kone (Surveillant général)"],
      },
    ];

    return mockData;
  }, []);

  const {
    data: conversations,
    loading,
    refreshing,
    fetchData: refetchData,
  } = useDataFetching(fetchConversations, []);

  const summary = useMemo(() => {
    if (!conversations) return { totalConversations: 0, unreadMessages: 0 };
    return {
      totalConversations: conversations.length,
      unreadMessages: conversations.reduce(
        (sum, conv) => sum + conv.unreadCount,
        0
      ),
    };
  }, [conversations]);

  const summaryItems = [
    {
      label: "Conversations",
      value: summary.totalConversations,
      icon: "chatbubbles-outline" as const,
      color: themedStyles.primary.color,
    },
    {
      label: "Messages non lus",
      value: summary.unreadMessages,
      icon: "mail-unread-outline" as const,
      color: themedStyles.warning.color,
    },
  ];

  const renderHeader = () => (
    <View style={themedStyles.header}>
      <CsText style={themedStyles.headerTitle}>Discussions</CsText>
      <View style={themedStyles.filterContainer}>
        {["all", "unread", "teacher", "admin"].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              themedStyles.filterButton,
              selectedFilter === filter && themedStyles.selectedFilterButton,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <CsText
              style={StyleSheet.flatten([
                themedStyles.filterButtonText,
                selectedFilter === filter &&
                  themedStyles.selectedFilterButtonText,
              ])}
            >
              {filter === "all"
                ? "Tous"
                : filter === "unread"
                ? "Non lus"
                : filter === "teacher"
                ? "Professeurs"
                : "Administration"}
            </CsText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderConversationItem = useCallback(
    ({ item }: { item: Conversation }) => (
      <ConversationItem conversation={item} />
    ),
    []
  );

  const handleNewConversation = () => {
    setNewConversationModalVisible(true);
    Animated.spring(modalAnimatedValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  };

  const handleCloseModal = () => {
    Animated.timing(modalAnimatedValue, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setNewConversationModalVisible(false);
    });
  };

  const handleSelectTemplate = (template: Template) => {
    handleCloseModal();
    navigationRef.navigate(Routes.ConversationDetail, {
      templateId: template.id,
      templateTitle: template.title,
      recipient: template.recipient,
    });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={themedStyles.container}>
      {renderHeader()}
      <AnimatedFlatList
        style={themedStyles.conversationList}
        data={conversations}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <SummaryCard
            items={summaryItems}
            primaryColor={themedStyles.primary.color}
            successColor={themedStyles.success.color}
            warningColor={themedStyles.warning.color}
          />
        }
        onRefresh={refetchData}
        refreshing={refreshing}
      />
      <TouchableOpacity
        style={themedStyles.newConversationButton}
        onPress={handleNewConversation}
      >
        <Ionicons name="add" size={24} color={themedStyles.buttonText.color} />
        <CsText style={themedStyles.buttonText}>Nouvelle discussion</CsText>
      </TouchableOpacity>
      {isNewConversationModalVisible && (
        <>
          <Animated.View
            style={[
              themedStyles.modalBackground,
              { opacity: modalBackgroundOpacity },
            ]}
          />
          <NewConversationModal
            visible={isNewConversationModalVisible}
            onClose={handleCloseModal}
            onSelectTemplate={handleSelectTemplate}
            animatedValue={modalAnimatedValue}
            modalTranslateY={modalTranslateY}
          />
        </>
      )}
    </View>
  );
};

const ConversationItem: React.FC<{ conversation: Conversation }> = React.memo(
  ({ conversation }) => {
    const themedStyles = useThemedStyles<typeof styles>(styles);
    const opacity = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, []);

    const animatedStyle = {
      opacity,
      transform: [
        {
          translateY: opacity.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          }),
        },
      ],
    };

    return (
      <Animated.View style={[themedStyles.conversationItem, animatedStyle]}>
        <CsCard style={themedStyles.conversationCard}>
          <View style={themedStyles.conversationHeader}>
            <CsText variant="h3" style={themedStyles.conversationTopic}>
              {conversation.topic}
            </CsText>
            {conversation.unreadCount > 0 && (
              <View style={themedStyles.unreadBadge}>
                <CsText style={themedStyles.unreadBadgeText}>
                  {conversation.unreadCount}
                </CsText>
              </View>
            )}
          </View>
          <CsText
            variant="body"
            numberOfLines={2}
            style={themedStyles.lastMessage}
          >
            {conversation.lastMessage}
          </CsText>
          <View style={themedStyles.conversationFooter}>
            <CsText variant="caption" style={themedStyles.participantText}>
              {conversation.participants[0]}
            </CsText>
            <CsText variant="caption" style={themedStyles.dateText}>
              {formatDate(conversation.lastMessageDate, "d MMM yyyy")}
            </CsText>
          </View>
        </CsCard>
      </Animated.View>
    );
  }
);

const styles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.primary,
      padding: spacing.md,
      paddingTop: spacing.xl,
    },
    headerTitle: {
      color: theme.background,
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: spacing.sm,
    },
    filterContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: theme.card,
      borderRadius: 8,
      padding: spacing.xs,
    },
    filterButton: {
      alignItems: "center",
      padding: spacing.xs,
    },
    selectedFilterButton: {
      backgroundColor: theme.primary,
      borderRadius: 8,
    },
    filterButtonText: {
      color: theme.text,
      fontSize: 12,
    },
    selectedFilterButtonText: {
      color: theme.background,
    },
    conversationList: {
      flex: 1,
      padding: spacing.md,
    },
    conversationItem: {
      marginBottom: spacing.md,
    },
    conversationCard: {
      padding: spacing.md,
      ...shadows.small,
    },
    conversationHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.xs,
    },
    conversationTopic: {
      flex: 1,
    },
    unreadBadge: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    unreadBadgeText: {
      color: theme.background,
      fontSize: 12,
      fontWeight: "bold",
    },
    lastMessage: {
      color: theme.textLight,
      marginBottom: spacing.xs,
    },
    conversationFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    participantText: {
      color: theme.textLight,
    },
    dateText: {
      color: theme.textLight,
    },
    newConversationButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
      padding: spacing.sm,
      borderRadius: 8,
      margin: spacing.md,
    },
    buttonText: {
      color: theme.background,
      marginLeft: spacing.xs,
      fontWeight: "bold",
    },
    modalBackground: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "black",
    },
    primary: {
      color: theme.primary,
    },
    success: { color: "#4CAF50" },
    warning: { color: "#FFA500" },
  });

export default DiscussionScreen;

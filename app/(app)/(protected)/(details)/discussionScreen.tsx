import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

// Components
import { CsCard, CsText, LoadingScreen, SummaryCard } from "@/components";
import { Ionicons } from "@expo/vector-icons";

// Hooks
import { useChat, useThemedStyles } from "@/hooks";
import useDataFetching from "@/hooks/useDataFetching";

// Navigation
import { useRouter } from "expo-router";
import { Conversation } from "@/services";
import { formatDate } from "@/utils";
import { useAppSelector } from "@/store";
import { supabase } from "@/lib/supabase";
import { ITheme, shadows, spacing } from "@/styles";

const DiscussionScreen: React.FC = () => {
  const user = useAppSelector((s) => s?.AppReducer?.user);

  // Hooks and Navigation
  const router = useRouter();
  const { getConversations } = useChat();
  const themedStyles = useThemedStyles<typeof styles>(styles);

  // States
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Data Fetching
  const fetchConversations = useCallback(async () => await getConversations(user!.id), []);

  const {
    data: conversations,
    loading,
    refreshing,
    fetchData: refetchData,
  } = useDataFetching(fetchConversations, []);

  useEffect(() => {
    const channel = supabase
      .channel('chats')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chats',
        filter: `parent_id=eq.${user?.id}`
      }, () => {
        // refetchData();

        setTimeout(() => {
          refetchData();
        }
        , 700);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user?.id]);

  // Computed Data
  const summary = useMemo(() => {
    if (!conversations) return { totalConversations: 0, unreadMessages: 0 };
    return {
      totalConversations: conversations.length,
      unreadMessages: conversations.reduce(
        (sum, converse) => sum + converse.unreadCount,
        0
      ),
    };
  }, [conversations?.length]);

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

  // Navigation handler
  const handleConversationPress = (chatId: string) => {
    router.push(`/(app)/(protected)/(details)/${chatId}`);
  }

  // Render Methods
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

  const handleNewConversation = () => {
    router.push(`/(app)/(protected)/(details)/newConversationModal`)
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={themedStyles.container}>
      {renderHeader()}
      <FlatList
        style={themedStyles.conversationList}
        data={conversations}
        renderItem={({ item }) => (
          <ConversationItem
            conversation={item}
            onPress={() => handleConversationPress(item.id)}
          />
        )}
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
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity
        style={themedStyles.newConversationButton}
        onPress={handleNewConversation}
      >
        <Ionicons name="add" size={24} color={themedStyles.buttonText.color} />
        <CsText style={themedStyles.buttonText}>Nouvelle discussion</CsText>
      </TouchableOpacity>
    </View>
  );
};

const ConversationItem: React.FC<{ conversation: Conversation; onPress: () => void }> = ({
  conversation,
  onPress,
}) => {
  const themedStyles = useThemedStyles<typeof styles>(styles);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
      <CsCard style={themedStyles.conversationCard} onPress={onPress}>
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
};

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
      marginTop: spacing.md,
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

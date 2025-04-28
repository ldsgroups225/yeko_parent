// app/(app)/(protected)/(details)/[chatId].tsx

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Components
import { Ionicons } from "@expo/vector-icons";
import { CsText, CsCard } from "@/components";

// Hooks
import { useChat, useThemedStyles } from "@/hooks";

// Types and Styles
import { type ITheme, shadows, spacing  } from "@/styles";
import { chat as chatService } from "@/services";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { useAppSelector } from "@/store";
import { showToast } from "@/helpers/toast/showToast";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase/types";

// Message Interface
interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: Date;
}

const ConversationDetailScreen: React.FC = () => {
  // Hooks and Navigation
  const router = useRouter();
  const themedStyles = useThemedStyles<typeof styles>(styles);

  const user = useAppSelector((s) => s?.AppReducer?.user);
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { getMessages, createMessage } = useChat();

  // States
  const [messages, setMessages] = useState<Message[]>([]);
  const [chat, setChat] = useState<{ messageCount: number; title: string, status: 'active' | 'ended' | 'archived' } | null>(null);
  const [inputText, setInputText] = useState("");

  // Refs
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Effects
  useEffect(() => {
    if (user === null) return;

    const loadMessages = async () => {
      try {
        const result = await getMessages({ userId: user!.id, chatId });

        setChat({ messageCount: result.messageCount, title: result.title, status: result.status });
        setMessages(result.messages);
      } catch (error) {
        showToast((error as Error).message);
      }
    };

    loadMessages();
  }, [chatId]);

  useEffect(() => {
    // Scroll to end and fade in new message when messages array updates
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [messages, fadeAnim]);

  // Callbacks
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    try {
      // Check message limit
      if (chat!.messageCount >= 10) {
        alert('Vous avez atteint le nombre maximum de messages par chat. (10 max)');
        return;
      }
      await createMessage({
        chatId,
        senderId: user!.id,
        content: inputText.trim()
      });

      setInputText('');
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'user',
          text: inputText.trim(),
          timestamp: new Date()
        },
      ])
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Add real-time listener
  useEffect(() => {
    if (!user || !chatId) {
      console.warn("User or Chat ID not available for subscription.");
      return;
    }

    const channel = supabase
      .channel(`messages_for_chat_${chatId}`)
      .on<Database['public']['Tables']['messages']['Row']>(
        'postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`
      }, (payload) => {
        const rawNewMessage = payload.new;
        
        if (rawNewMessage.sender_id !== user.id) {
          // Map the raw data to the local Message interface
          const formattedMessage: Message = {
            id: rawNewMessage.id,
            text: rawNewMessage.content,
            sender: 'other',
            // Convert created_at string to Date, handle potential null
            timestamp: rawNewMessage.created_at ? new Date(rawNewMessage.created_at) : new Date()
          };
          // Use functional update to avoid stale state issues
          setMessages(prevMessages => [...prevMessages, formattedMessage]);
        }
      })
      .subscribe((status, err) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
           console.error(`Subscription error for chat ${chatId}:`, status, err);
        }
     });

    // Cleanup function
    return () => {
      supabase.removeChannel(channel).catch(err => console.error("Error removing channel:", err));
    };
  }, [chatId, supabase, user?.id]);

  // Effect to mark messages as read when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const markRead = async () => {
        if (user && chatId && isActive) {
          try {
            await chatService.markMessagesAsRead(chatId, user.id);
            // Optionally: Trigger a refetch on DiscussionScreen if needed,
            // though ideally the count calculation handles this.
          } catch (err) {
            console.error("Failed to mark messages as read:", err);
          }
        }
      };

      // Mark as read shortly after focusing to allow messages to potentially load
      const timeoutId = setTimeout(markRead, 500); // Delay slightly

      return () => {
        isActive = false;
        clearTimeout(timeoutId);
      };
    }, [chatId, user?.id])
  );

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isLastMessage = index === messages.length - 1;
    const timestampString = item.timestamp instanceof Date && !isNaN(item.timestamp.getTime())
      ? item.timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : '...';

    return (
      <Animated.View
        style={[
          themedStyles.messageContainer,
          item.sender === "user"
            ? themedStyles.userMessage
            : themedStyles.otherMessage,
          isLastMessage && { opacity: fadeAnim },
        ]}
      >
        <CsCard style={themedStyles.messageCard}>
          <CsText style={themedStyles.messageText}>{item.text}</CsText>
          <CsText style={themedStyles.timestamp}>
            {timestampString}
          </CsText>
        </CsCard>
      </Animated.View>
    );
  };

  // Main Render
  return (
    <KeyboardAvoidingView
      style={themedStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={themedStyles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={themedStyles.headerText.color}
          />
        </TouchableOpacity>
        <CsText style={themedStyles.headerText}>
          {10 - (chat?.messageCount ?? 0)}
          {' '}
          messages restants
        </CsText>
        <CsText style={themedStyles.recipientText}>
          {/* {cha === "teacher" ? "Professeur" : "Administration"} */}
        </CsText>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        ListFooterComponent={() => {
          if (chat?.status === 'ended') {
            return (
              <CsCard style={themedStyles.endedChat}>
                <CsText>
                  Vous avez atteint le nombre maximum de messages par chat. (10 max)
                </CsText>
              </CsCard>
            );
          } else {
            return null;
          }
        }}
        keyExtractor={(item) => item.id}
        contentContainerStyle={themedStyles.messageList}
        showsVerticalScrollIndicator={false}
      />
      <View style={themedStyles.inputContainer}>
        <TextInput
          style={themedStyles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Tapez votre message..."
          placeholderTextColor={themedStyles.inputPlaceholder.color}
          readOnly={chat?.status !== 'active'}
        />
        <TouchableOpacity onPress={sendMessage} disabled={chat?.status !== 'active'} style={themedStyles.sendButton}>
          <Ionicons
            name="send"
            size={24}
            color={themedStyles.sendButtonText.color}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// Styles
const styles = (theme: ITheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: spacing.md,
      paddingTop: spacing.xl,
      backgroundColor: theme.primary,
      ...shadows.medium,
    },
    headerText: {
      fontSize: 16,
      fontWeight: "semibold",
      color: theme.background,
      flex: 1,
      textAlign: "right",
    },
    recipientText: {
      fontSize: 14,
      color: theme.background,
    },
    messageList: {
      paddingHorizontal: spacing.sm,
      paddingBottom: spacing.md,
    },
    messageContainer: {
      maxWidth: "80%",
      marginVertical: spacing.xs,
    },
    userMessage: {
      alignSelf: "flex-end",
    },
    otherMessage: {
      alignSelf: "flex-start",
    },
    messageCard: {
      padding: spacing.sm,
      borderRadius: 12,
    },
    messageText: {
      fontSize: 16,
    },
    timestamp: {
      fontSize: 12,
      color: theme.textLight,
      alignSelf: "flex-end",
      marginTop: spacing.xs,
    },
    inputContainer: {
      flexDirection: "row",
      padding: spacing.sm,
      backgroundColor: theme.card,
      ...shadows.small,
    },
    input: {
      flex: 1,
      backgroundColor: theme.background,
      borderRadius: 20,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginRight: spacing.sm,
      color: theme.text,
    },
    inputPlaceholder: {
      color: theme.textLight,
    },
    sendButton: {
      backgroundColor: theme.primary,
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    sendButtonText: {
      color: theme.background,
    },
    endedChat: {
      backgroundColor: theme.warning,
      marginVertical: spacing.sm,
    },
  });

export default ConversationDetailScreen;

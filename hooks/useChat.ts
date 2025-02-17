import { chat, Chat, ChatTopic, Conversation, Message } from "@/services/chatService";
import { useState } from "react";

interface UseChatReturn {
  getChatTopics: () => Promise<ChatTopic[]>;
  createNewChat: ({
    studentId,
    parentId,
    schoolId,
    classId,
    topicId,
  }: {
    studentId: string;
    parentId: string;
    schoolId: string;
    classId: string;
    topicId?: number;
  }) => Promise<Chat>;
  getConversations: (userId: string) => Promise<Conversation[]>
  getMessages: ({
    userId,
    chatId,
  }: {
    userId: string;
    chatId: string;
  }) => Promise<Message>
  createMessage: ({senderId, chatId, content}: {senderId: string, chatId: string, content: string}) => Promise<void>
  loading: boolean;
  error: string | null;
}

export const useChat = (): UseChatReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getChatTopics = async (): Promise<ChatTopic[]> => {
    setLoading(true);
    setError(null);
    try {
      return await chat.getChatTopics();
    } catch (err) {
      setError("Failed to get chat topics.");
      console.error("[E_GET_CHAT_TOPICS]:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = async ({
    studentId,
    parentId,
    schoolId,
    classId,
    topicId
  }: {
    studentId: string;
    parentId: string;
    schoolId: string;
    classId: string;
    topicId?: number;
  }): Promise<Chat> => {
    setLoading(true);
    setError(null);
    try {
      return await chat.createNewChat({
        studentId,
        parentId,
        schoolId,
        classId,
        topicId
      });
    } catch (err) {
      setError("Failed to create chat.");
      console.error("[E_CREATE_CHAT]:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getConversations = async (userId: string): Promise<Conversation[]> => {
    setLoading(true);
    setError(null);
    try {
      return await chat.getConversations(userId);
    } catch (err) {
      setError("Failed to get conversations.");
      console.error("[E_GET_CONVERSATIONS]:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getMessages = async ({
    userId,
    chatId,
  }: {
    userId: string;
    chatId: string;
  }): Promise<Message> => {
    setLoading(true);
    setError(null);
    try {
      return await chat.getMessages({ userId, chatId });
    } catch (err) {
      setError("Failed to get messages.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createMessage = async ({senderId, chatId, content}: {senderId: string, chatId: string, content: string}) => {
    setLoading(true);
    setError(null);
    try {
      await chat.createMessage({senderId, chatId, content});
    } catch (err) {
      setError("Failed to create message.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getChatTopics,
    createNewChat,
    getConversations,
    getMessages,
    createMessage,
    loading,
    error,
  };
};

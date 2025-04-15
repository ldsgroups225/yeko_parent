import { supabase } from "@/lib/supabase";
import { formatFullName } from "@/utils/formatting";

// types/chat.ts
export interface ChatTopic {
  id: number;
  topicKey: string;
  defaultMessage: string;
  isActive: boolean;
}

export interface Chat {
  id: string;
  studentId: string;
  parentId: string;
  teacherId: string;
  classId: string;
  schoolId: string;
  topicId?: number;
  status: 'active' | 'ended' | 'archived';
  messageCount: number;
  initiatedBy: string;
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  title: string;
  messageCount: number;
  status: 'active' | 'ended' | 'archived';
  messages: {
    id: string,
    text: string,
    sender: "user" | "other",
    timestamp: Date
  }[];
}

export interface Conversation {
  id: string;
  topic: string;
  lastMessage: string;
  lastMessageDate: Date;
  unreadCount: number;
  participants: string[];
}

export interface ChatWithDetails extends Chat {
  studentName: string;
  teacherName: string;
  topic?: string;
  lastMessage?: string;
  lastMessageDate?: Date;
  unreadCount: number;
}

export const chat = {
  async getStudentMaiTeacher(studentId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
      .rpc('get_student_main_teacher', {
        student_uuid: studentId
      })
      .single();

      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      return null;
    }
  },
  
  async getChatTopics(): Promise<ChatTopic[]> {
    try {
      const { data, error } = await supabase
      .from('chat_topics')
      .select('*')
      .eq('is_active', true);
  
      if (error) throw new Error(error.message);

      return data.map((topic) => ({
        id: topic.id,
        topicKey: topic.topic_key,
        defaultMessage: topic.default_message,
        isActive: topic.is_active ?? false
      } satisfies ChatTopic))
    } catch (error) {
      console.error("Error getting chat topics:", error);
      throw error;
    }
  },

  async createNewChat({
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
    }): Promise<Chat> {
    try {
      const teacherId = await this.getStudentMaiTeacher(studentId);
      if (!teacherId) throw new Error("Votre enfant ne semble pas avoir de professeur principal");

      const { data, error } = await supabase
      .from('chats')
      .insert({
        student_id: studentId,
        parent_id: parentId,
        topic_id: topicId,
        initiated_by: parentId,
        class_id: classId,
        school_id: schoolId,
        teacher_id: teacherId,
      })
      .select()
      .single();

      if (error) throw error;

      if (topicId) {
        const { data: topicData } = await supabase
          .from('chat_topics')
          .select('default_message')
          .eq('id', topicId)
          .single();
  
        if (topicData) {
          await supabase.from('messages').insert([{
            chat_id: data.id,
            sender_id: data.teacher_id,
            content: topicData.default_message,
            is_system_message: true
          }]);
        }
      }
  
      return {
        id: data.id,
        studentId: data.student_id,
        parentId: data.parent_id,
        teacherId: data.teacher_id,
        classId: data.class_id,
        schoolId: data.school_id,
        topicId: data.topic_id!,
        status: data.status as Chat['status'],
        messageCount: data.message_count ?? 0,
        initiatedBy: data.initiated_by!,
        createdAt: new Date(data.created_at!),
        updatedAt: new Date(data.updated_at!),
        endedAt: data.ended_at ? new Date(data.ended_at!) : undefined,
      } satisfies Chat
    } catch (error) {
      throw error;
    }
  },

  async getConversations(userId: string): Promise<Conversation[]> {
    try {
      type UserInfo = { first_name: string | null; last_name: string | null; };
      type ChatTopicInfo = { title: string | null; default_message: string | null; };
      type ChatData = {
        id: string;
        chat_topics: ChatTopicInfo | null;
        teacher: UserInfo | null;
        parent: UserInfo | null; 
        created_at: string;
      };
      type MessageData = {
        chat_id: string;
        content: string;
        created_at: string | null;
        read_by: string[] | null;
      };
      type Conversation = {
        id: string;
        topic: string;
        lastMessage: string;
        lastMessageDate: Date;
        unreadCount: number;
        participants: string[];
      };


      const { data, error } = await supabase
        .from('chats')
        .select(`
          id,
          chat_topics(title, default_message),
          teacher: users!chats_teacher_id_fkey(first_name, last_name),
          parent: users!chats_parent_id_fkey(first_name, last_name),
          created_at
        `)
        .eq('parent_id', userId)
        .neq('status', 'archived')
        .order('created_at', { ascending: false })
        .returns<ChatData[]>();

      if (error) {
        console.error("Error fetching chats:", error);
        throw error;
      };

      if (!data) {
        console.warn("No chat data returned.");
        return [];
      }

      // Fetch last message for each conversation
      const chatIDs = data.map(c => c.id);

      let messages: { chat_id: string; content: string, date: Date, isRead: boolean }[] = []

      // Helper function assumed to be defined elsewhere
      const formatFullName = (firstName: string | null, lastName: string | null): string => {
        return `${firstName || ''} ${lastName || ''}`.trim() || 'Unknown User';
      };


      for (let i = 0; i < chatIDs.length; i++) {
        const chatId = chatIDs[i];
        const { data: msgData, error: msgError } = await supabase
          .from('messages')
          .select('chat_id, content, created_at, read_by')
          .eq('chat_id', chatId)
          .order('created_at', { ascending: false })
          .limit(1)
          .returns<MessageData[]>();

        if (msgError) {
            console.error(`Error fetching message for chat ${chatId}:`, msgError);
            continue;
        };

        // Check if msgData is null, empty, or the first message lacks created_at
        if (!msgData || msgData.length === 0 || !msgData[0].created_at) {
            continue;
        }

        const lastMessage = msgData[0];
        messages.push({
          chat_id: chatId,
          content: lastMessage.content ?? '',
          isRead: !!lastMessage.read_by?.length,
          date: new Date(lastMessage.created_at!),
        });
      }


      // Use reduce to filter chats that have messages and map them to the Conversation format
      const chatsWithMessages = data.reduce((acc: Conversation[], chat) => {
        const message = messages.find(m => m.chat_id === chat.id);

        if (message) {
          const teacherName = chat.teacher ? formatFullName(chat.teacher.first_name, chat.teacher.last_name) : 'Unknown Teacher';
          const parentName = chat.parent ? formatFullName(chat.parent.first_name, chat.parent.last_name) : 'Unknown Parent';

          const conversation: Conversation = {
            id: chat.id,
            topic: chat.chat_topics?.title ?? 'Question divers',
            lastMessage: message.content,
            lastMessageDate: message.date,
            unreadCount: message.isRead ? 0 : 1,
            participants: [teacherName, parentName],
          };
          acc.push(conversation);
        }
        return acc;
      }, [] as Conversation[]);

      return chatsWithMessages;

    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in getConversations:", error.message, error.stack);
      } else {
        console.error("An unexpected error occurred in getConversations:", error);
      }
      return [];
    }
  },

  async getMessages({userId, chatId}: {userId: string, chatId: string}): Promise<Message> {
    try {
      const chatQuery = supabase
        .from('chats')
        .select('chat_topics(title), message_count, status')
        .eq('id', chatId)
        .eq('initiated_by', userId)
        .neq('status', 'archived')
        .single();
      
      const messageQuery = supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      const [
        {data: chatData, error: chatError}, 
        {data: messages, error: messagesError},
      ] = await Promise.all([chatQuery, messageQuery]);

      if (chatError) throw chatError;
      if (messagesError) throw messagesError;

      return {
        title: chatData?.chat_topics?.title ?? 'Untitled',
        messageCount: chatData?.message_count ?? 0,
        status: (chatData?.status) as Message['status'],
        messages: messages?.map(msg => ({
          id: msg.id,
          text: msg.content,
          sender: msg.sender_id === userId ? 'user' : 'other',
          timestamp: new Date(msg.created_at!)
        }))
      }
    } catch (error) {
      throw error;
    }
  },

  async createMessage({senderId, chatId, content}: {senderId: string, chatId: string, content: string}): Promise<void> {
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          chat_id: chatId,
          sender_id: senderId,
          content: content.trim(),
        }]);
      
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }
};

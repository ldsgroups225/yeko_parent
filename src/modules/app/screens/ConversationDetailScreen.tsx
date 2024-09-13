import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Animated
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles } from '@hooks/index';
import { ITheme } from '@styles/theme';
import { spacing, shadows } from '@src/styles';
import CsText from '@components/CsText';
import CsCard from '@components/CsCard';

type RootStackParamList = {
    ConversationDetail: { templateId: string; templateTitle: string; recipient: 'teacher' | 'admin' };
};

type ConversationDetailRouteProp = RouteProp<RootStackParamList, 'ConversationDetail'>;

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'other';
    timestamp: Date;
}

const ConversationDetailScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<ConversationDetailRouteProp>();
    const { templateId, templateTitle, recipient } = route.params;
    const themedStyles = useThemedStyles<typeof styles>(styles);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Simulate loading initial messages
        const initialMessages: Message[] = [
            {
                id: '1',
                text: `Bonjour, je voudrais discuter de ${templateTitle.toLowerCase()}.`,
                sender: 'user',
                timestamp: new Date(Date.now() - 60000),
            },
            {
                id: '2',
                text: `Bien sûr, je suis là pour vous aider concernant ${templateTitle.toLowerCase()}. Que puis-je faire pour vous ?`,
                sender: 'other',
                timestamp: new Date(),
            },
        ];
        setMessages(initialMessages);
    }, [templateTitle]);

    const sendMessage = () => {
        if (inputText.trim() === '') return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputText.trim(),
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prevMessages => [...prevMessages, newMessage]);
        setInputText('');

        // Simulate receiving a response
        setTimeout(() => {
            const responseMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Merci pour votre message. Je vais l'examiner et vous répondre dans les plus brefs délais.",
                sender: 'other',
                timestamp: new Date(),
            };
            setMessages(prevMessages => [...prevMessages, responseMessage]);
        }, 1000);
    };

    useEffect(() => {
        if (messages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: true });
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    }, [messages, fadeAnim]);

    const renderMessage = ({ item, index }: { item: Message; index: number }) => {
        const isLastMessage = index === messages.length - 1;
        return (
            <Animated.View style={[
                themedStyles.messageContainer,
                item.sender === 'user' ? themedStyles.userMessage : themedStyles.otherMessage,
                isLastMessage && { opacity: fadeAnim },
            ]}>
                <CsCard style={themedStyles.messageCard}>
                    <CsText style={themedStyles.messageText}>{item.text}</CsText>
                    <CsText style={themedStyles.timestamp}>
                        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </CsText>
                </CsCard>
            </Animated.View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={themedStyles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
            <View style={themedStyles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={themedStyles.headerText.color} />
                </TouchableOpacity>
                <CsText style={themedStyles.headerText}>{templateTitle}</CsText>
                <CsText style={themedStyles.recipientText}>
                    {recipient === 'teacher' ? 'Professeur' : 'Administration'}
                </CsText>
            </View>
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={themedStyles.messageList}
            />
            <View style={themedStyles.inputContainer}>
                <TextInput
                    style={themedStyles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Tapez votre message..."
                    placeholderTextColor={themedStyles.inputPlaceholder.color}
                />
                <TouchableOpacity onPress={sendMessage} style={themedStyles.sendButton}>
                    <Ionicons name="send" size={24} color={themedStyles.sendButtonText.color} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = (theme: ITheme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.md,
        backgroundColor: theme.primary,
        ...shadows.medium,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.background,
        flex: 1,
        textAlign: 'center',
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
        maxWidth: '80%',
        marginVertical: spacing.xs,
    },
    userMessage: {
        alignSelf: 'flex-end',
    },
    otherMessage: {
        alignSelf: 'flex-start',
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
        alignSelf: 'flex-end',
        marginTop: spacing.xs,
    },
    inputContainer: {
        flexDirection: 'row',
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: theme.background,
    },
});

export default ConversationDetailScreen;
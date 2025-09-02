import React, { useState, useEffect } from "react";
import ConversationList from "./conversation-list";
import ChatWindow from "./chat-window";
import {
  useCreateMessageMutation,
  useSessionListQuery,
  useGetMessagesBySessionQuery, // Add this import for loading messages
} from "@/features/chat/chatApiSlice";
import { useParams } from "react-router";

const PAGE_SIZE = 10;

const ConversationPage = () => {
  const { tenant_id } = useParams();
  const [page, setPage] = useState(1);
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const activeConversation = conversations.find((c) => c.id === activeId);

  // Fetch sessions
  const { data } = useSessionListQuery(
    { tenant_id, page, page_size: PAGE_SIZE },
    {
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: false,
    }
  );

  // Fetch messages for active session
  const { data: messagesData } = useGetMessagesBySessionQuery(
    activeConversation?.session_id,
    {
      skip: !activeConversation?.session_id,
      refetchOnMountOrArgChange: true,
    }
  );

  const [createMessage, { isLoading }] = useCreateMessageMutation();

  // Transform API sessions -> conversations
  useEffect(() => {
    if (data?.data) {
      const mapped = data.data.map((session) => ({
        id: session.session_id,
        name: session.session_summary || "New Conversation",
        messages: [], // Will be loaded separately
        session_id: session.session_id,
        createdAt: session.created_at,
        updatedAt: session.updated_at,
        lastMessage: session.session_summary || "Start a conversation...",
      }));
      setConversations(mapped);
      
      // Set first conversation as active if none selected
      if (!activeId && mapped.length > 0) {
        setActiveId(mapped[0].id);
      }
    }
  }, [data, activeId]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (messagesData?.data && activeConversation) {
      const transformedMessages = messagesData.data.map((msg, index) => [
        {
          id: `${msg.message_id}-user`,
          type: "outgoing",
          text: msg.user_query,
          timestamp: msg.created_at,
        },
        {
          id: `${msg.message_id}-bot`,
          type: "incoming",
          text: msg.response,
          timestamp: msg.created_at,
          products: msg.products || [],
        }
      ]).flat();

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversation.id
            ? { ...conv, messages: transformedMessages }
            : conv
        )
      );
    }
  }, [messagesData, activeConversation?.id]);

  const handleSendMessage = async (conversationId, payload, sessionId) => {
    try {
      // Add optimistic update for user message
      const optimisticUserMessage = {
        id: `temp-user-${Date.now()}`,
        type: "outgoing",
        text: payload.user_query,
        timestamp: new Date().toISOString(),
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? { ...conv, messages: [...conv.messages, optimisticUserMessage] }
            : conv
        )
      );

      const response = await createMessage({
        payload,
        session_id: sessionId,
      }).unwrap();

      const incomingMessage = {
        id: `${response.data.message_id}-bot`,
        type: "incoming",
        text: response.data.response,
        timestamp: response.data.created_at,
        products: response.data?.products || [],
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [
                  ...conv.messages.filter(m => m.id !== optimisticUserMessage.id),
                  {
                    ...optimisticUserMessage,
                    id: `${response.data.message_id}-user`,
                  },
                  incomingMessage
                ],
                session_id: conv.session_id || response.data.session_id,
                lastMessage: response.data.response,
                updatedAt: new Date().toISOString(),
              }
            : conv
        )
      );

      return response;
    } catch (err) {
      console.error("Error sending message:", err);
      
      // Remove optimistic message and add error
      const errorMessage = {
        id: `error-${Date.now()}`,
        type: "error",
        text: "Failed to send message. Please try again.",
        timestamp: new Date().toISOString(),
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? { 
                ...conv, 
                messages: [
                  ...conv.messages.filter(m => !m.id.startsWith('temp-user-')),
                  errorMessage
                ]
              }
            : conv
        )
      );
      throw err;
    }
  };

  const handleCreateConversation = (text) => {
    const newConv = {
      id: `temp-${Date.now()}`, // Temporary ID until we get session_id
      name: generateConversationName(text),
      messages: [],
      session_id: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessage: "",
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newConv.id);

    if (text.trim()) {
      const payload = { user_query: text, tenant_id };
      handleSendMessage(newConv.id, payload, null).then((response) => {
        // Update with real session_id
        if (response?.data?.session_id) {
          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === newConv.id
                ? { 
                    ...conv, 
                    id: response.data.session_id,
                    session_id: response.data.session_id 
                  }
                : conv
            )
          );
          setActiveId(response.data.session_id);
        }
      });
    }

    return newConv;
  };

  const generateConversationName = (text) => {
    const words = text.trim().split(" ").slice(0, 4);
    return words.length > 0
      ? words.join(" ") + (text.split(" ").length > 4 ? "..." : "")
      : "New Conversation";
  };

  const handleNewConversation = () => {
    const newConv = {
      id: `temp-${Date.now()}`,
      name: "New Conversation",
      messages: [],
      session_id: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessage: "",
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newConv.id);
  };

  const handleSelectConversation = (id) => {
    setActiveId(id);
    // Messages will be loaded automatically via the useGetMessagesBySessionQuery hook
  };

  return (
    <div className="h-[76vh]">
      <div className="flex gap-6 h-full">
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          onSelect={handleSelectConversation}
        />
        <div className="flex-1 h-full">
          <ChatWindow
            conversation={activeConversation}
            onSendMessage={handleSendMessage}
            onCreateConversation={handleCreateConversation}
            handleNewConversation={handleNewConversation}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
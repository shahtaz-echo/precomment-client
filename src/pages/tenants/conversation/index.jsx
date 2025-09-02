import React, { useState } from "react";
import ConversationList from "./conversation-list";
import ChatWindow from "./chat-window";
import { useCreateMessageMutation } from "@/features/chat/chatApiSlice";
import { useParams } from "react-router";

const ConversationPage = () => {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const activeConversation = conversations.find((c) => c.id === activeId);
  const { tenant_id } = useParams();

  const [createMessage, { isLoading }] = useCreateMessageMutation();
  // Mock the mutation hook

  // Send a message
  const handleSendMessage = async (conversationId, payload, sessionId) => {
    try {
      const response = await createMessage({
        payload,
        session_id: sessionId,
      }).unwrap();

      const outgoingMessage = {
        id: Date.now(),
        type: "outgoing",
        text: payload.user_query,
        timestamp: new Date().toISOString(),
      };

      const incomingMessage = {
        id: Date.now() + 1,
        type: "incoming",
        text: response.data.response,
        timestamp: response.data.created_at,
        products: response.data?.products || [],
      };

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: [...conv.messages, outgoingMessage, incomingMessage],
              session_id: conv.session_id || response.data.session_id,
              lastMessage: response.data.response,
              updatedAt: new Date().toISOString(),
            };
          }
          return conv;
        })
      );

      return response;
    } catch (err) {
      console.error("Error sending message:", err);

      // Add error message to conversation
      const errorMessage = {
        id: Date.now(),
        type: "error",
        text: "Failed to send message. Please try again.",
        timestamp: new Date().toISOString(),
      };

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: [...conv.messages, errorMessage],
            };
          }
          return conv;
        })
      );
    }
  };

  // Create new conversation
  const handleCreateConversation = (text) => {
    const newConv = {
      id: Date.now(),
      name: generateConversationName(text),
      messages: [],
      session_id: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessage: "",
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newConv.id);

    // Send the initial message
    if (text.trim()) {
      const payload = { user_query: text, tenant_id };
      handleSendMessage(newConv.id, payload, null);
    }

    return newConv;
  };

  // Generate conversation name from first message
  const generateConversationName = (text) => {
    const words = text.trim().split(" ").slice(0, 4);
    return words.length > 0
      ? words.join(" ") + (text.split(" ").length > 4 ? "..." : "")
      : "New Conversation";
  };

  // Start new conversation
  const handleNewConversation = () => {
    const newConv = {
      id: Date.now(),
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

  return (
    <div className="h-[76vh]">
      <div className="flex gap-6 h-full">
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          onSelect={setActiveId}
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

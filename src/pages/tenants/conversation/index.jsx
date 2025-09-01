import React, { useState } from "react";
import ConversationList from "./conversation-list";
import ChatWindow from "./chat-window";

// Main Page
const ConversationPage = () => {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: "Alice",
      messages: [
        { type: "incoming", text: "Hey there!" },
        { type: "outgoing", text: "Hi Alice, how are you?" },
      ],
    },
    {
      id: 2,
      name: "Bob",
      messages: [
        { type: "incoming", text: "Yo, want to catch up later?" },
        { type: "outgoing", text: "Sure, what time?" },
      ],
    },
  ]);

  const [activeId, setActiveId] = useState(null);

  const activeConversation = conversations.find((c) => c.id === activeId);

  return (
    <div>
      <h2 className="text-2xl font-bold">Conversation</h2>
      <div className="flex mt-6">
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          onSelect={setActiveId}
        />
        <ChatWindow conversation={activeConversation} />
      </div>
    </div>
  );
};

export default ConversationPage;

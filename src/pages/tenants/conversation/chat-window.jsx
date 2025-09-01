import { useCreateMessageMutation } from "@/features/chat/chatApiSlice";
import { Bot, Plane, Send } from "lucide-react";
import React, { useState } from "react";

const ChatWindow = ({ conversation, onCreateConversation, onSendMessage }) => {
  if (!conversation) {
    // New conversation mode
    return (
      <div className="flex-1 h-[70vh] flex flex-col">
        <div className="flex-1 center flex-col gap-4 text-gray-500">
          <Bot size={36} strokeWidth={1} />
          Start a new conversation
        </div>
        <MessageInput
          onSend={(text) => {
            if (text.trim()) {
              // create a new conversation and send first message
              const newConv = onCreateConversation(text);
              onSendMessage(newConv.id, text);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 h-[70vh] flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {conversation.messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
      </div>
      <MessageInput
        onSend={(text) => {
          if (text.trim()) {
            onSendMessage(conversation.id, text);
          }
        }}
      />
    </div>
  );
};

export default ChatWindow;

// message bubble
const Message = ({ message }) => {
  const isOutgoing = message.type === "outgoing";
  return (
    <div className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-xs ${
          isOutgoing ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
};

// input box
const MessageInput = ({ onSend }) => {
  const [value, setValue] = useState("");

  const [createMessage, { isLoading }] = useCreateMessageMutation();

  const handleSend = () => {
    if (!value.trim()) return;
    createMessage({ text: value });
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="py-4 border-t border-gray-300 flex">
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 border rounded-lg px-3 py-2 focus:outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        onClick={handleSend}
        className="ml-2 flx gap-2 bg-black text-white px-4 py-2 rounded-lg"
      >
        <Send size={14} />
        Send
      </button>
    </div>
  );
};

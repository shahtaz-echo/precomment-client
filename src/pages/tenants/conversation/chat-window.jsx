import { Button } from "@/components/ui/button";
import { imgMinified } from "@/lib/minified";
import { Bot, MessageCircle, Plus, Send } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";

const ChatWindow = ({
  conversation,
  onSendMessage,
  onCreateConversation,
  handleNewConversation,
  isLoading,
}) => {
  const [sessionId, setSessionId] = useState(conversation?.session_id || null);
  const messagesEndRef = useRef(null);

  const { tenant_id } = useParams();
  
  useEffect(() => {
    setSessionId(conversation?.session_id || null);
  }, [conversation]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  const handleSendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    if (!conversation) {
      // Create new conversation with the message
      await onCreateConversation(text);
    } else {
      // Send message to existing conversation
      const payload = { user_query: text, tenant_id };
      try {
        const response = await onSendMessage(conversation.id, payload, sessionId);

        // Update session ID if we got a new one
        if (response?.data?.session_id && !sessionId) {
          setSessionId(response.data.session_id);
        }
      } catch (error) {
        // Error handling is done in the parent component
        console.error('Failed to send message:', error);
      }
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-500">
          <Bot size={48} strokeWidth={1} className="text-gray-400" />
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Welcome to Chat
            </h3>
            <p>Start a new conversation by typing a message below</p>
          </div>
        </div>
        <MessageInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-xl border border-gray-200 flex h-full flex-col">
      {/* Chat Header - Fixed the typo here */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{conversation.name}</h3>
          {sessionId && (
            <p className="text-sm text-gray-500">Session: {sessionId.slice(0, 8)}...</p>
          )}
        </div>

        <Button onClick={handleNewConversation} variant="outline" size="sm">
          <Plus size={14} className="mr-1" />
          New Chat
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle size={32} className="mb-2" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          conversation.messages.map((msg, index) => (
            <Message key={msg.id || index} message={msg} />
          ))
        )}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatWindow;

// Message bubble component
const Message = ({ message }) => {
  const isOutgoing = message.type === "outgoing";
  const isError = message.type === "error";

  return (
    <div className={`flex ${isOutgoing ? "justify-end" : "justify-start"} mb-4`}>
      <div className="flex items-start gap-3 max-w-[80%]">
        {!isOutgoing && !isError && (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <Bot size={16} className="text-gray-600" />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div
            className={`px-4 py-2 rounded-lg ${
              isOutgoing
                ? "bg-blue-600 text-white ml-auto"
                : isError
                ? "bg-red-100 text-red-800 border border-red-200"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
            {message.timestamp && (
              <span className={`text-xs mt-1 block ${
                isOutgoing ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>

          {/* Render products if any */}
          {message.products?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {message.products.map((product) => (
                <a
                  key={product.product_id}
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border rounded-lg hover:shadow-md transition-all duration-200 bg-white hover:border-blue-200"
                >
                  <img
                    src={imgMinified(product.image_url)}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-sm text-gray-900 truncate">
                      {product.name}
                    </span>
                    <span className="text-xs text-gray-500 truncate">
                      {product.category}
                    </span>
                    {product.price && (
                      <span className="text-xs font-medium text-green-600 mt-1">
                        {product.price}
                      </span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Typing indicator
const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="flex items-start gap-3 max-w-[80%]">
      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
        <Bot size={16} className="text-gray-600" />
      </div>
      <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  </div>
);

// Input box component
const MessageInput = ({ onSend, isLoading }) => {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  const handleSend = () => {
    if (!value.trim() || isLoading) return;
    onSend(value);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    // Focus input when not loading
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50">
      <div className="flex gap-3">
        <input
          ref={inputRef}
          type="text"
          placeholder={isLoading ? "Sending..." : "Type a message..."}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          className="px-4 py-2"
          size="default"
        >
          <Send size={16} className="mr-1" />
          Send
        </Button>
      </div>
    </div>
  );
};
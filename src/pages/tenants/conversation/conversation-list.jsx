import { MessageCircle } from "lucide-react";
import React from "react";

const ConversationList = ({ conversations, onSelect, activeId }) => {
  return (
    <div className="w-80 bg-white rounded-xl border border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">Recent Conversations</h3>
      </div>

      <div className="flex-1 h-full overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 ? (
          <div className="p-4 center flex-col h-full text-gray-500">
            <MessageCircle size={24} className="mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No conversations yet</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              active={conv.id === activeId}
              onClick={() => onSelect(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;

const ConversationItem = ({ conversation, onClick, active }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-3 rounded-lg transition-colors ${
        active
          ? "bg-blue-50 border border-blue-200 text-blue-700"
          : "hover:bg-gray-50 text-gray-700"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-medium text-sm truncate">{conversation.name}</h4>
        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
          {formatTime(conversation.updatedAt)}
        </span>
      </div>

      <p className="text-xs text-gray-500 truncate">
        {conversation.lastMessage || "Start a conversation..."}
      </p>

      {conversation.messages.length > 0 && (
        <div className="flex items-center gap-1 mt-2">
          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
          <span className="text-xs text-gray-400">
            {conversation.messages.length} message
            {conversation.messages.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
};

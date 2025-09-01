import React from "react";

const ConversationList = ({ conversations, onSelect, activeId }) => {
  return (
    <div className="max-w-[320px] w-full h-[70vh] space-y-2 overflow-y-auto">
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.id}
          conversation={conv}
          active={conv.id === activeId}
          onClick={() => onSelect(conv.id)}
        />
      ))}
    </div>
  );
};

export default ConversationList;

const ConversationItem = ({ conversation, onClick, active }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer p-4 rounded-xl ${
      active
        ? "bg-blue-100 font-medium text-blue-600"
        : "hover:bg-gray-100 bg-gray-50"
    }`}
  >
    <h3>{conversation.name}</h3>
    <p>Something Message</p>
  </div>
);

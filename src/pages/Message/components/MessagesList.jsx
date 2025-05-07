import React from 'react';

export const MessagesList = ({ messages, isTyping, parseMarkdown }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {messages.map(msg => (
        <MessageItem 
          key={msg.id} 
          message={msg} 
          parseMarkdown={parseMarkdown}
        />
      ))}
      
      {/* Typing indicator */}
      {isTyping && <TypingIndicator />}
    </div>
  );
};

const MessageItem = ({ message, parseMarkdown }) => {
  const { text, sent, time } = message;
  
  return (
    <div className={`flex ${sent ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs md:max-w-md ${sent ? 'bg-greenlove text-white' : 'bg-white'} rounded-2xl px-4 py-2 shadow`}>
        {parseMarkdown && !sent ? (
          <div 
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(text) }}
          />
        ) : (
          <p className="text-sm">{text}</p>
        )}
        <span className={`text-xs ${sent ? 'text-green-100' : 'text-gray-400'} block text-right mt-1`}>
          {time}
        </span>
      </div>
    </div>
  );
};

const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-white rounded-2xl px-4 py-3 shadow">
        <div className="flex space-x-1">
          <div className="typing-dot w-2 h-2 bg-greenlove rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="typing-dot w-2 h-2 bg-greenlove rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
          <div className="typing-dot w-2 h-2 bg-greenlove rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
        </div>
      </div>
    </div>
  );
};
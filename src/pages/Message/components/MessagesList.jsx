export const MessagesList = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {messages.map(msg => (
        <MessageItem key={msg.id} message={msg} />
      ))}
    </div>
  );
};

const MessageItem = ({ message }) => {
  const { text, sent, time } = message;
  
  return (
    <div className={`flex ${sent ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs md:max-w-md ${sent ? 'bg-greenlove text-white' : 'bg-white'} rounded-2xl px-4 py-2 shadow`}>
        <p className="text-sm">{text}</p>
        <span className={`text-xs ${sent ? 'text-green-100' : 'text-gray-400'} block text-right mt-1`}>
          {time}
        </span>
      </div>
    </div>
  );
};
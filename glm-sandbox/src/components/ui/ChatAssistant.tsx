import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { config } from '@/config/env';

export const ChatAssistant = () => {
  const { isChatOpen, setChatOpen, chatHistory, addChatMessage } = useAppStore();
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: inputMessage,
      timestamp: new Date(),
    };

    addChatMessage(userMessage);
    setInputMessage('');

    try {
      // Call the actual API
      const response = await fetch(config.api.chatUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          history: chatHistory,
          context: {
            currentMode: 'truth', // You'd get this from store
            distribution: 'normal', // You'd get this from store
            linkFunction: 'identity', // You'd get this from store
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: data.reply,
        timestamp: new Date(),
      };
      addChatMessage(aiMessage);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date(),
      };
      addChatMessage(errorMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isChatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg transition-colors duration-200 z-50"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Panel */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">GLM Assistant</h3>
            <button
              onClick={() => setChatOpen(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatHistory.length === 0 ? (
              <div className="text-center text-gray-500 text-sm">
                <p>Ask me anything about GLMs!</p>
                <p className="mt-2">Try: "What is a logit link function?"</p>
              </div>
            ) : (
              chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      message.role === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about GLMs..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSendMessage}
                className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-lg transition-colors duration-200"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

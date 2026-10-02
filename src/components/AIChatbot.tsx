import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  ShoppingBag, 
  Compass, 
  Minimize2, 
  Maximize2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { AIMessage, Product } from '../types';
import { aiApi } from '../services/api';
import { useCart } from '../context/CartContext';

interface AIChatbotProps {
  onOpenOutfitBuilder?: () => void;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ onOpenOutfitBuilder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome_1',
      sender: 'ai',
      text: "👋 Hi there! I'm **Flair AI**, your personal fashion & styling assistant. What look or vibe are you searching for today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickReplies: [
        'I need a party dress under ₹2000',
        'Suggest casual outfits for college',
        'White sneakers under ₹4500',
        'Suggest a complete outfit'
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputMessage).trim();
    if (!messageText || loading) return;

    // Check if user clicked outfit builder trigger
    if (messageText.toLowerCase().includes('outfit') && onOpenOutfitBuilder && messageText.includes('build')) {
      onOpenOutfitBuilder();
    }

    const userMsg: AIMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const data = await aiApi.chat(messageText);
      const aiMsg: AIMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: data.text,
        recommendedProducts: data.recommendedProducts,
        quickReplies: data.quickReplies,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: AIMessage = {
        id: `ai_err_${Date.now()}`,
        sender: 'ai',
        text: "I'm experiencing a small connection delay, but here are some trending picks curated for you!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl shadow-purple-600/50 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20"
          aria-label="Open Flair AI Fashion Stylist"
        >
          <div className="relative">
            <Bot className="w-6 h-6 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1.5 -right-1.5 animate-spin" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold leading-tight flex items-center gap-1">
              Ask Flair AI <span className="bg-white/20 text-[9px] px-1.5 py-0.5 rounded-full uppercase">Stylist</span>
            </p>
            <p className="text-[10px] text-purple-200">Find outfits & recommendations</p>
          </div>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className={`fixed z-50 transition-all duration-300 ${
          isMinimized 
            ? 'bottom-6 right-6 w-72 h-14' 
            : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh]'
        }`}>
          <div className="w-full h-full glass bg-[#121224]/95 border border-purple-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-purple-950 via-[#1A1A2E] to-purple-950 px-4 py-3 border-b border-purple-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    Flair AI Fashion Assistant
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                  </h3>
                  <p className="text-[10px] text-purple-300">Intelligent Style & Budget Advisor</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {onOpenOutfitBuilder && !isMinimized && (
                  <button
                    onClick={onOpenOutfitBuilder}
                    className="p-1.5 text-purple-300 hover:text-white hover:bg-purple-500/20 rounded-lg text-[10px] flex items-center gap-1 border border-purple-500/20 mr-1"
                    title="Open Outfit Recommender"
                  >
                    <Compass className="w-3 h-3 text-pink-400" />
                    <span>Outfit</span>
                  </button>
                )}
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
                  title={isMinimized ? 'Expand' : 'Minimize'}
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 text-xs leading-relaxed shadow-md ${
                          msg.sender === 'user' ? 'chat-bubble-user text-white' : 'chat-bubble-ai text-slate-200'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>

                      {/* Product recommendation cards within chat */}
                      {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                        <div className="w-full mt-3 grid grid-cols-2 gap-2">
                          {msg.recommendedProducts.map((prod) => (
                            <div
                              key={prod.id}
                              className="bg-[#1A1A2E] border border-purple-500/20 rounded-xl overflow-hidden p-2 flex flex-col justify-between"
                            >
                              <Link 
                                to={`/product/${prod.id}`}
                                onClick={() => setIsOpen(false)}
                                className="block aspect-square overflow-hidden rounded-lg bg-slate-900 mb-1.5"
                              >
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                                />
                              </Link>
                              <div>
                                <p className="text-[10px] text-purple-300 font-bold uppercase">{prod.brand}</p>
                                <Link 
                                  to={`/product/${prod.id}`}
                                  onClick={() => setIsOpen(false)}
                                  className="text-[11px] font-semibold text-white line-clamp-1 hover:text-purple-300"
                                >
                                  {prod.name}
                                </Link>
                                <div className="flex items-baseline justify-between mt-1">
                                  <span className="text-xs font-bold text-emerald-400">
                                    ₹{prod.price.toLocaleString('en-IN')}
                                  </span>
                                  <span className="text-[9px] text-slate-400">{prod.source}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => addToCart(prod, 1)}
                                className="mt-2 w-full py-1 bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors"
                              >
                                <ShoppingBag className="w-3 h-3" /> Add
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Quick chips under AI messages */}
                      {msg.quickReplies && msg.quickReplies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {msg.quickReplies.map((chip, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(chip)}
                              className="text-[10px] bg-purple-950/60 hover:bg-purple-800/80 text-purple-200 border border-purple-500/30 px-2.5 py-1 rounded-full transition-all text-left"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      )}

                      <span className="text-[9px] text-slate-500 mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  ))}

                  {/* Typing animation */}
                  {loading && (
                    <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-[#1A1A2E] border border-purple-500/20 w-24">
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="p-3 bg-[#0F0F1A] border-t border-purple-500/20 flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="Ask e.g. 'Party dress under ₹2000'..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-1 bg-[#1A1A2E] text-xs text-white placeholder-slate-500 px-3.5 py-2.5 rounded-full border border-purple-500/30 focus:border-purple-500 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || loading}
                    className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white flex items-center justify-center hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all shadow-md flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
};

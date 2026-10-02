import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Sparkles, 
  Send, 
  ShoppingBag, 
  Compass, 
  Zap, 
  HelpCircle,
  TrendingUp,
  RefreshCw,
  Tag
} from 'lucide-react';
import { AIMessage, Product } from '../types';
import { aiApi } from '../services/api';
import { useCart } from '../context/CartContext';

interface AIAssistantPageProps {
  onOpenOutfitBuilder: () => void;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ onOpenOutfitBuilder }) => {
  const { addToCart } = useCart();
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'init_1',
      sender: 'ai',
      text: "👋 Welcome to the **Flair AI Fashion Studio**! Tell me what you're dressing for, your budget (e.g. *under ₹2500*), preferred colors, or ask me to recommend a complete look.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickReplies: [
        'Party dress under ₹2000',
        'Casual college outfits',
        'Nike sneakers under ₹5000',
        'Formal office shirts for men',
        'Suggest complete evening look'
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    if (text.toLowerCase().includes('complete look') || text.toLowerCase().includes('build outfit')) {
      onOpenOutfitBuilder();
    }

    const userMsg: AIMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const data = await aiApi.chat(text);
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
        text: "Here are some of our finest trending pieces matching your style vibe!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-500/15">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-purple-600/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              Flair AI Fashion Studio <Sparkles className="w-4 h-4 text-pink-400" />
            </h1>
            <p className="text-xs text-purple-300">Natural language styling advisor & product finder</p>
          </div>
        </div>

        <button
          onClick={onOpenOutfitBuilder}
          className="btn-primary text-xs py-2.5 px-4 shadow-lg shadow-purple-600/30"
        >
          <Compass className="w-4 h-4" />
          <span>Launch 4-Piece Outfit Builder</span>
        </button>
      </div>

      {/* Main Chat Studio Window */}
      <div className="glass bg-[#121224]/90 border border-purple-500/25 rounded-3xl h-[650px] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-start gap-2.5 max-w-[85%]">
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed shadow-lg ${
                    msg.sender === 'user'
                      ? 'chat-bubble-user text-white'
                      : 'chat-bubble-ai text-slate-100 bg-[#1A1A2E]'
                  }`}
                >
                  <p className="whitespace-pre-line text-sm">{msg.text}</p>
                </div>
              </div>

              {/* Recommended Product Cards within Chat */}
              {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                <div className="w-full mt-4 pl-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {msg.recommendedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-[#1A1A2E] border border-purple-500/20 rounded-2xl overflow-hidden p-3 flex flex-col justify-between"
                    >
                      <div>
                        <Link 
                          to={`/product/${prod.id}`}
                          className="block aspect-[3/4] overflow-hidden rounded-xl bg-slate-900 mb-2"
                        >
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </Link>
                        <span className="text-[9px] uppercase tracking-wider text-purple-300 font-bold block">
                          {prod.brand}
                        </span>
                        <Link 
                          to={`/product/${prod.id}`}
                          className="text-xs font-bold text-white hover:text-purple-300 line-clamp-1"
                        >
                          {prod.name}
                        </Link>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-sm font-bold text-emerald-400">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-400">Via {prod.source}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(prod, 1)}
                        className="mt-3 w-full py-1.5 bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Reply Chips */}
              {msg.quickReplies && msg.quickReplies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pl-10">
                  {msg.quickReplies.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(chip)}
                      className="text-xs bg-purple-950/60 hover:bg-purple-800 text-purple-200 border border-purple-500/30 px-3 py-1.5 rounded-full transition-all"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              <span className="text-[10px] text-slate-500 mt-1 pl-10">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 p-4 rounded-2xl bg-[#1A1A2E] border border-purple-500/20 w-36 ml-10">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="text-xs text-purple-300 ml-1">Thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 bg-[#0F0F1A] border-t border-purple-500/20 flex items-center gap-3"
        >
          <input
            type="text"
            placeholder="Type anything e.g. 'I need casual sneakers under 4000' or 'Suggest college outfit'..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 bg-[#1A1A2E] text-xs sm:text-sm text-white placeholder-slate-400 px-4 py-3 rounded-2xl border border-purple-500/30 focus:border-purple-500 outline-none"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="btn-primary text-xs sm:text-sm px-5 py-3 font-bold shadow-lg shadow-purple-600/30"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </form>

      </div>

    </div>
  );
};

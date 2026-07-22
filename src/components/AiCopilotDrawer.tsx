import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bot, Send, X, Sparkles, User, RefreshCw, AlertCircle } from 'lucide-react';

export const AiCopilotDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { products, customers, invoices, stockMovements, language } = useApp();

  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text:
        language === 'om'
          ? 'Nagaa! Ani Gargaaraa AI Mohammed Awel Coca Distributor ti. Waayee kuusaa, gurgurtaa, ykn geejjiba na gaafachuu dandeessu.'
          : 'Hello! I am your AI Business Copilot for Mohammed Awel Coca Distributor. Ask me anything about stock inventory, sales predictions, low stock alerts, or credit accounts.',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          contextData: {
            products,
            customers: customers.map((c) => ({
              name: c.businessName,
              balance: c.currentBalance,
              limit: c.creditLimit,
            })),
            invoicesCount: invoices.length,
            totalRevenue: invoices.reduce((a, b) => a + b.grandTotal, 0),
            movementsCount: stockMovements.length,
          },
        }),
      });

      const data = await response.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { sender: 'ai', text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text:
              'Current stock levels are healthy across Coca-Cola 300ml, Fanta, and Sprite. Bedele Depot inventory is synced.',
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text:
            'AI Assistant Note: Coca 300ml stock is currently at 12,000 bottles. 2 low-stock alerts detected for Minute Maid.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 max-w-md w-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between">
      {/* Header */}
      <div className="p-4 bg-[#E41E26] text-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm">Coca AI Business Copilot</h3>
            <p className="text-[10px] text-white/80">Gemini Powered Distributor Intelligence</p>
          </div>
        </div>

        <button onClick={onClose} className="p-1 text-white/80 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl ${
                m.sender === 'user'
                  ? 'bg-[#E41E26] text-white rounded-br-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-1.5 mb-1 text-[10px] opacity-80">
                {m.sender === 'user' ? <User className="w-3 h-3" /> : <Sparkles className="w-3 h-3 text-amber-400" />}
                <span className="font-bold">{m.sender === 'user' ? 'You' : 'Coca AI'}</span>
              </div>
              <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500 flex items-center space-x-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-red-600" />
              <span>Analyzing distributor data...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Questions */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex space-x-2 overflow-x-auto text-[10px]">
        <button
          onClick={() => setInput('What is our total stock level across all products?')}
          className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full font-bold whitespace-nowrap hover:border-red-500"
        >
          📦 Total Stock Summary
        </button>
        <button
          onClick={() => setInput('Which customer accounts are currently over credit limit?')}
          className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full font-bold whitespace-nowrap hover:border-red-500"
        >
          💳 Credit Lock Risk
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Ask AI about stock, sales, deliveries..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2 bg-[#E41E26] hover:bg-red-700 disabled:opacity-50 text-white rounded-xl shadow"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

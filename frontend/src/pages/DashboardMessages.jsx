import React, { useEffect, useState, useRef } from 'react';
import API from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Send, Image as ImageIcon, CheckCheck, HelpCircle, User } from 'lucide-react';

const DashboardMessages = () => {
  const { user } = useAuth();
  
  const [conversations, setConversations] = useState([]);
  const [activeContact, setActiveContact] = useState(null); // Contact user object
  const [messages, setMessages] = useState([]);
  
  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  // Poll conversations every 10 seconds
  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  // Poll messages thread for active conversation every 5 seconds
  useEffect(() => {
    if (!activeContact) return;
    fetchMessages();
    markMessagesAsRead();

    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [activeContact]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await API.get('/messages/conversations');
      setConversations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async () => {
    if (!activeContact) return;
    try {
      const res = await API.get(`/messages/thread/${activeContact._id}`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const markMessagesAsRead = async () => {
    if (!activeContact) return;
    try {
      await API.put(`/messages/read/${activeContact._id}`);
      // Refresh local unread count
      setConversations(prev =>
        prev.map(c => c.contact._id === activeContact._id ? { ...c, unreadCount: 0 } : c)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectContact = (contact) => {
    setActiveContact(contact);
    setMessages([]);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputText.trim() === '' && !attachedFile) return;

    setSending(true);
    const formData = new FormData();
    formData.append('recipientId', activeContact._id);
    if (inputText) formData.append('text', inputText);
    if (attachedFile) formData.append('image', attachedFile);

    try {
      const res = await API.post('/messages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessages((prev) => [...prev, res.data.message]);
      setInputText('');
      setAttachedFile(null);
      setFilePreview('');
      
      // Update conversations sidebar last message
      fetchConversations();
    } catch (err) {
      console.error(err);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 overflow-hidden shadow-sm h-[75vh] flex">
      
      {/* 1. LEFT PANEL: Conversations list */}
      <div className="w-1/3 border-r border-slate-200 dark:border-white/5 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-white/5 text-left">
          <h2 className="font-display text-base font-bold text-slate-800 dark:text-white">Inbox Messages</h2>
          <p className="text-[10px] text-slate-400">Direct chats with clients and collectors</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {conversations.length === 0 ? (
            <p className="text-xs text-slate-400 py-12 text-center">No active chats found.</p>
          ) : (
            conversations.map((conv) => {
              const isSelected = activeContact && activeContact._id === conv.contact._id;
              return (
                <div
                  key={conv.contact._id}
                  onClick={() => handleSelectContact(conv.contact)}
                  className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left ${
                    isSelected ? 'bg-brand-500/5' : ''
                  }`}
                >
                  <img
                    src={conv.contact.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                    alt="Contact Avatar"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="font-display text-xs font-bold text-slate-800 dark:text-white truncate">
                        {conv.contact.fullName}
                      </h4>
                      {conv.unreadCount > 0 && (
                        <span className="rounded-full bg-brand-500 text-[8px] font-bold text-white px-2 py-0.5">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 truncate">
                      {conv.lastMessage?.text || 'Sent an image attachment'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. RIGHT PANEL: Chat details */}
      <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900/10">
        {activeContact ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 flex items-center gap-3 text-left">
              <img
                src={activeContact.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                alt="Active Avatar"
                className="h-9 w-9 rounded-full object-cover"
              />
              <div>
                <h3 className="font-display text-xs font-bold text-slate-800 dark:text-white">
                  {activeContact.fullName}
                </h3>
                <p className="text-[9px] text-slate-400">@{activeContact.username}</p>
              </div>
            </div>

            {/* Message bubble log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                const isOwnMsg = msg.sender?._id === user._id || msg.sender === user._id;
                return (
                  <div
                    key={msg._id}
                    className={`flex ${isOwnMsg ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-xs text-left ${
                        isOwnMsg
                          ? 'bg-brand-500 text-white rounded-br-none'
                          : 'bg-white border border-slate-200 text-slate-800 dark:bg-slate-800 dark:border-white/5 dark:text-slate-100 rounded-bl-none'
                      }`}
                    >
                      {msg.text && <p className="leading-relaxed">{msg.text}</p>}
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="Attachment"
                          className="mt-2 rounded-lg max-h-40 object-cover border border-black/10"
                        />
                      )}
                      <div className="mt-1 flex items-center justify-end gap-1 text-[8px] text-slate-400 select-none">
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isOwnMsg && <CheckCheck className={`h-3 w-3 ${msg.isRead ? 'text-blue-300' : 'text-slate-300'}`} />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 space-y-2">
              
              {/* Attachment Preview */}
              {filePreview && (
                <div className="relative inline-block h-12 w-12 rounded-lg overflow-hidden border border-slate-200">
                  <img src={filePreview} alt="Preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setAttachedFile(null);
                      setFilePreview('');
                    }}
                    className="absolute right-0.5 top-0.5 rounded-full bg-red-500 p-0.5 text-white"
                  >
                    x
                  </button>
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="file"
                  id="chat-attach"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="chat-attach"
                  className="rounded-xl border border-slate-200 p-2.5 hover:bg-slate-50 cursor-pointer dark:border-white/10 dark:hover:bg-slate-800 text-slate-400"
                >
                  <ImageIcon className="h-4.5 w-4.5" />
                </label>

                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-transparent px-4 py-2.5 text-xs outline-none focus:border-brand-500 dark:border-white/10 dark:text-slate-100"
                />

                <button
                  type="submit"
                  disabled={sending || (inputText.trim() === '' && !attachedFile)}
                  className="rounded-xl bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 disabled:opacity-50 transition-colors"
                >
                  <Send className="h-4.5 w-4.5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
            <MessageSquare className="h-8 w-8 text-slate-300" />
            <p className="text-xs">Select a conversation from the sidebar thread to start messaging.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardMessages;

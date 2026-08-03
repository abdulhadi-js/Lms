"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Search, MoreVertical, Circle, User, Users, Plus, X } from 'lucide-react';
import { chatApi, coursesApi, usersApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { io, Socket } from 'socket.io-client';

export default function TeacherChat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeContact, setActiveContact] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [availableContacts, setAvailableContacts] = useState<any[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [contactSearch, setContactSearch] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();

    const token = typeof window !== 'undefined' ? localStorage.getItem('lms_access_token') : null;
    const socketUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace('/api/v1', '');
    
    const newSocket = io(`${socketUrl}/chat`, {
      auth: { token: `Bearer ${token}` },
      transports: ['websocket'],
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    
    const handleNewMessage = (msg: any) => {
      setMessages(prev => {
        if (activeContact) {
          const activePartnerId = activeContact.courseId ? undefined : (activeContact.senderId === user?.id ? activeContact.receiverId : activeContact.senderId);
          if (
            (msg.courseId && msg.courseId === activeContact.courseId) ||
            (!msg.courseId && (msg.senderId === activePartnerId || msg.receiverId === activePartnerId))
          ) {
            if (prev.some(m => m.id === msg.id)) return prev;
            return [...prev, msg];
          }
        }
        return prev;
      });
      
      loadConversations();
    };

    socket.on('new_message', handleNewMessage);
    
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, activeContact, user?.id]);

  useEffect(() => {
    if (activeContact) {
      loadMessages(activeContact);
    }
  }, [activeContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadConversations() {
    try {
      const data = await chatApi.getConversations();
      // data is an array of the latest messages
      setConversations(data);
      if (data.length > 0 && !activeContact) {
        setActiveContact(data[0]);
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages(contact: any) {
    try {
      const partnerId = contact.courseId ? undefined : (contact.senderId === user?.id ? contact.receiverId : contact.senderId);
      const data = await chatApi.getMessages({ 
        courseId: contact.courseId, 
        partnerId: partnerId 
      });
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact) return;

    try {
      const partnerId = activeContact.courseId ? undefined : (activeContact.senderId === user?.id ? activeContact.receiverId : activeContact.senderId);
      
      if (socket && socket.connected) {
        socket.emit('send_message', {
          courseId: activeContact.courseId,
          receiverId: partnerId,
          body: newMessage.trim()
        }, (sentMsg: any) => {
          setNewMessage('');
        });
      } else {
        const sentMsg = await chatApi.sendMessage({
          courseId: activeContact.courseId,
          receiverId: partnerId,
          body: newMessage.trim()
        });
        
        // Optimistically append the new message
        setMessages([...messages, { ...sentMsg, sender: user }]);
        setNewMessage('');
        
        // Reload conversations to update the latest message in sidebar
        loadConversations();
      }
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const loadAvailableContacts = async () => {
    setLoadingContacts(true);
    setShowNewChatModal(true);
    setContactSearch('');
    try {
      const [coursesData, usersData] = await Promise.all([
        coursesApi.list(),
        usersApi.list()
      ]);

      const contacts: any[] = [];

      // Add courses as group chats
      coursesData.forEach((c: any) => {
        contacts.push({
          isGroup: true,
          id: c.id,
          name: c.title,
          subtext: 'Group Chat',
          data: c
        });
      });

      // Add all users (admins, instructors, students) except the current user
      usersData.forEach((u: any) => {
        if (u.id !== user?.id) {
          contacts.push({
            isGroup: false,
            id: u.id,
            name: `${u.firstName} ${u.lastName}`,
            subtext: u.role,
            data: u
          });
        }
      });

      setAvailableContacts(contacts);
    } catch (err) {
      console.error("Failed to load contacts", err);
    } finally {
      setLoadingContacts(false);
    }
  };

  const startNewChat = (contact: any) => {
    setShowNewChatModal(false);
    
    // Check if conversation already exists in sidebar
    const existing = conversations.find(c => {
      if (contact.isGroup) return c.courseId === contact.id;
      const partnerId = c.senderId === user?.id ? c.receiverId : c.senderId;
      return partnerId === contact.id;
    });

    if (existing) {
      setActiveContact(existing);
      return;
    }

    // Otherwise create a dummy active contact
    if (contact.isGroup) {
      setActiveContact({
        id: `new_group_${contact.id}`,
        courseId: contact.id,
        course: contact.data,
        body: 'Start a new conversation...'
      });
    } else {
      setActiveContact({
        id: `new_dm_${contact.id}`,
        senderId: user?.id,
        receiverId: contact.id,
        receiver: contact.data,
        body: 'Start a new conversation...'
      });
    }
    setMessages([]);
  };

  const getContactName = (contact: any) => {
    if (contact.courseId) return contact.course?.title || 'Course Group';
    const partner = contact.senderId === user?.id ? contact.receiver : contact.sender;
    return partner ? `${partner.firstName} ${partner.lastName}` : 'Unknown User';
  };

  const filteredConversations = conversations.filter(c => 
    getContactName(c).toLowerCase().includes(search.toLowerCase())
  );

  const filteredNewContacts = availableContacts.filter(c => 
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) || 
    c.subtext.toLowerCase().includes(contactSearch.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-[1280px] mx-auto h-[calc(100vh-80px)] flex flex-col relative">
      <div className="mb-6 shrink-0 flex justify-between items-end">
        <div>
          <h1 className="text-[28px] font-bold text-[#132a13]">Messages</h1>
          <p className="text-[#5f5f5f]">Communicate with your students and colleagues.</p>
        </div>
      </div>

      <div className="flex-1 bg-surface rounded-[12px] border border-[#c6c6c6] overflow-hidden flex min-h-0 relative" style={{ boxShadow: '0 4px 12px rgba(19, 42, 19, 0.08)' }}>
        
        {/* Sidebar Contacts list */}
        <div className="w-full md:w-1/3 border-r border-[#c6c6c6] flex flex-col bg-[#fefef9]">
          <div className="p-4 border-b border-[#c6c6c6]">
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Search messages..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-[#c6c6c6] rounded-lg bg-surface text-[#444444] placeholder-[#a4a4a4] focus:outline-none focus:border-[#31572c] text-sm"
                />
                <Search className="w-4 h-4 text-[#a4a4a4] absolute left-3 top-2.5" />
              </div>
              <button 
                onClick={loadAvailableContacts}
                className="w-9 h-9 flex items-center justify-center bg-[#31572c] text-white rounded-lg hover:opacity-90 shrink-0 shadow-sm"
                title="New Chat"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-[#818181]">Loading...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-[#818181]">
                <p className="mb-4">No conversations yet.</p>
                <button onClick={loadAvailableContacts} className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors">Start a Chat</button>
              </div>
            ) : (
              filteredConversations.map(contact => {
                const isActive = activeContact?.id === contact.id;
                const name = getContactName(contact);
                
                return (
                <div 
                  key={contact.id} 
                  onClick={() => setActiveContact(contact)}
                  className={`p-4 border-b border-[#e4e4e4] cursor-pointer hover:bg-[#eff3e7] transition-colors flex justify-between items-center ${isActive ? 'bg-[#fcfdf1] border-l-4 border-l-[#31572c]' : 'border-l-4 border-l-transparent'}`}
                >
                  <div className="overflow-hidden flex-1 pr-2">
                    <h3 className={`text-[15px] font-bold truncate text-[#132a13]`}>{name}</h3>
                    <p className="text-sm text-[#5f5f5f] truncate mt-1">{contact.body}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs text-[#818181]">
                      {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'New'}
                    </span>
                    {contact.isRead === false && contact.receiverId === user?.id && <Circle className="w-3 h-3 fill-[#90a955] text-[#90a955]" />}
                  </div>
                </div>
              )})
            )}
          </div>
        </div>

        {/* Chat Area */}
        {activeContact ? (
          <div className="hidden md:flex flex-col w-2/3 bg-[#fefef9]">
            <div className="p-4 border-b border-[#c6c6c6] bg-surface flex justify-between items-center shadow-sm z-10">
              <h2 className="text-lg font-bold text-[#132a13]">{getContactName(activeContact)}</h2>
              <button className="text-[#5f5f5f] hover:text-[#31572c] transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-surface-container-lowest">
              {messages.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-body-secondary text-sm">
                   <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
                     <Send className="w-5 h-5 ml-1" />
                   </div>
                   <p>Send a message to start the conversation.</p>
                 </div>
              ) : (
                messages.map(msg => {
                  const isMe = msg.senderId === user?.id;
                  return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-end gap-2 max-w-[75%]">
                      {!isMe && (
                        <div className="w-8 h-8 rounded-full bg-[#e4e4e4] shrink-0 mb-1 flex items-center justify-center text-[#5f5f5f]">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                      <div 
                        className={`p-3 rounded-2xl ${isMe ? 'bg-[#31572c] text-white rounded-br-none' : 'bg-surface border border-[#c6c6c6] text-[#323232] rounded-bl-none shadow-sm'}`}
                      >
                        {!isMe && msg.courseId && msg.sender && (
                          <p className="text-xs font-bold text-[#4f772d] mb-1">{msg.sender.firstName} {msg.sender.lastName}</p>
                        )}
                        <p className="text-[15px] whitespace-pre-wrap">{msg.body}</p>
                      </div>
                    </div>
                    <span className="text-xs text-[#818181] mt-1 mx-10">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </span>
                  </div>
                );
              })
            )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-[#c6c6c6] bg-surface">
              <div className="flex items-center gap-2">
                <button type="button" className="p-2 text-[#5f5f5f] hover:bg-[#f4f4f4] rounded-full transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 bg-[#f4f4f4] border border-[#c6c6c6] rounded-full px-4 py-2 text-[#444444] placeholder-[#a4a4a4] focus:outline-none focus:border-[#31572c] focus:ring-1 focus:ring-[#31572c]"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2 bg-[#31572c] text-white rounded-full hover:opacity-90 transition-opacity disabled:opacity-50" 
                  style={{ background: 'linear-gradient(180deg, #3a6633 0%, #31572c 100%)' }}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="hidden md:flex flex-col w-2/3 items-center justify-center bg-[#fefef9] text-[#818181]">
            <Circle className="w-16 h-16 mb-4 text-[#e4e4e4]" />
            <p>Select a conversation to start messaging</p>
          </div>
        )}

        {/* New Chat Modal Overlap */}
        {showNewChatModal && (
          <div className="absolute inset-0 bg-surface z-50 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="p-4 border-b border-[#c6c6c6] flex justify-between items-center bg-[#fefef9]">
              <h2 className="text-lg font-bold text-[#132a13]">New Conversation</h2>
              <button onClick={() => setShowNewChatModal(false)} className="p-2 hover:bg-[#e4e4e4] rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 border-b border-[#e4e4e4] bg-surface">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search for a name or role..." 
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#c6c6c6] rounded-lg bg-[#f4f4f4] text-[#444444] placeholder-[#a4a4a4] focus:outline-none focus:border-[#31572c]"
                />
                <Search className="w-5 h-5 text-[#a4a4a4] absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-surface-container-lowest">
              {loadingContacts ? (
                <div className="text-center text-[#818181] mt-10">Loading your directory...</div>
              ) : filteredNewContacts.length === 0 ? (
                <div className="text-center text-[#818181] mt-10">No matches found for "{contactSearch}".</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredNewContacts.map((contact: any) => (
                    <button 
                      key={contact.id}
                      onClick={() => startNewChat(contact)}
                      className="flex items-center gap-4 p-4 border border-[#e4e4e4] rounded-xl hover:bg-[#eff3e7] hover:border-[#31572c] transition-all text-left bg-surface brand-shadow"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        {contact.isGroup ? <Users className="w-5 h-5" /> : <User className="w-5 h-5" />}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-[#132a13] truncate">{contact.name}</h4>
                        <p className="text-xs text-[#5f5f5f] mt-0.5 capitalize">{contact.subtext.toLowerCase()}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

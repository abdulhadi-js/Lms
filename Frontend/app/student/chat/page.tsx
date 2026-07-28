"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Search, MoreVertical, Circle } from 'lucide-react';
import { chatApi, authApi, AuthUser, coursesApi } from '@/lib/api';
import { io, Socket } from 'socket.io-client';

interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
}

interface CourseInfo {
  id: string;
  title: string;
  code: string;
  teacher?: UserInfo;
}

interface Message {
  id: string;
  body: string;
  createdAt: string;
  isRead: boolean;
  senderId: string;
  receiverId?: string;
  courseId?: string;
  sender: UserInfo;
  receiver?: UserInfo;
  course?: CourseInfo;
}

// Representing a conversation item in the sidebar
interface Contact {
  id: string; // Unique key for the contact list
  name: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  partnerId?: string;
  courseId?: string;
}

export default function StudentChat() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInitialData();
    
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
    
    const handleNewMessage = (msg: Message) => {
      setMessages(prev => {
        if (activeContact) {
          if (
            (msg.courseId && msg.courseId === activeContact.courseId) ||
            (!msg.courseId && (msg.senderId === activeContact.partnerId || msg.receiverId === activeContact.partnerId))
          ) {
            if (prev.some(m => m.id === msg.id)) return prev;
            return [...prev, msg];
          }
        }
        return prev;
      });
      
      setContacts(prev => prev.map(c => {
        const isMatch = (msg.courseId && msg.courseId === c.courseId) || 
                        (!msg.courseId && (msg.senderId === c.partnerId || msg.receiverId === c.partnerId));
        if (isMatch) {
          return {
            ...c,
            lastMessage: msg.body,
            time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unread: c.id !== activeContact?.id
          };
        }
        return c;
      }));
    };

    socket.on('new_message', handleNewMessage);
    
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, activeContact]);

  useEffect(() => {
    if (activeContact) {
      fetchMessages(activeContact);
    }
  }, [activeContact]);

  useEffect(() => {
    // Scroll to bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchInitialData = async () => {
    try {
      setLoadingContacts(true);
      const user = await authApi.me();
      setCurrentUser(user);

      // Fetch active conversations
      const convos: Message[] = await chatApi.getConversations();
      
      // Fetch courses to allow starting new group chats or messaging teachers
      const courses: CourseInfo[] = await coursesApi.list();
      
      const contactsList: Contact[] = [];
      const addedKeys = new Set<string>();

      // First map existing conversations
      convos.forEach(msg => {
        let name = 'Unknown';
        let partnerId = undefined;
        let courseId = undefined;
        let key = '';

        if (msg.courseId && msg.course) {
          name = `${msg.course.code} - ${msg.course.title} (Group)`;
          courseId = msg.courseId;
          key = `course_${courseId}`;
        } else {
          const partner = msg.senderId === user.id ? msg.receiver : msg.sender;
          if (partner) {
            name = `${partner.firstName} ${partner.lastName}`;
            partnerId = partner.id;
            key = `user_${partnerId}`;
          }
        }

        if (key && !addedKeys.has(key)) {
          addedKeys.add(key);
          contactsList.push({
            id: key,
            name,
            lastMessage: msg.body,
            time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unread: msg.receiverId === user.id && !msg.isRead,
            partnerId,
            courseId
          });
        }
      });

      // Then add courses that don't have conversations yet
      courses.forEach(course => {
        const groupKey = `course_${course.id}`;
        if (!addedKeys.has(groupKey)) {
          addedKeys.add(groupKey);
          contactsList.push({
            id: groupKey,
            name: `${course.code} - ${course.title} (Group)`,
            lastMessage: 'Start a new group conversation...',
            time: '',
            unread: false,
            courseId: course.id
          });
        }
        
        // Add teacher direct message if they have a teacher and no convo exists yet
        if (course.teacher) {
          const teacherKey = `user_${course.teacher.id}`;
          if (!addedKeys.has(teacherKey)) {
            addedKeys.add(teacherKey);
            contactsList.push({
              id: teacherKey,
              name: `Dr. ${course.teacher.firstName} ${course.teacher.lastName} (${course.code})`,
              lastMessage: 'Send a direct message...',
              time: '',
              unread: false,
              partnerId: course.teacher.id
            });
          }
        }
      });

      setContacts(contactsList);
      if (contactsList.length > 0 && !activeContact) {
        setActiveContact(contactsList[0]);
      }
    } catch (error) {
      console.error("Failed to load contacts", error);
    } finally {
      setLoadingContacts(false);
    }
  };

  const fetchMessages = async (contact: Contact) => {
    try {
      setLoadingMessages(true);
      const msgs = await chatApi.getMessages({ 
        partnerId: contact.partnerId, 
        courseId: contact.courseId 
      });
      setMessages(msgs);
    } catch (error) {
      console.error("Failed to load messages", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeContact || sending) return;

    try {
      setSending(true);
      if (socket && socket.connected) {
        socket.emit('send_message', {
          receiverId: activeContact.partnerId,
          courseId: activeContact.courseId,
          body: messageInput.trim()
        }, (newMsg: Message) => {
          setMessageInput('');
        });
      } else {
        const newMsg = await chatApi.sendMessage({
          receiverId: activeContact.partnerId,
          courseId: activeContact.courseId,
          body: messageInput.trim()
        });
        
        setMessages(prev => [...prev, newMsg]);
        setMessageInput('');
        
        // Update last message in contact list
        setContacts(prev => prev.map(c => 
          c.id === activeContact.id 
            ? { ...c, lastMessage: newMsg.body, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } 
            : c
        ));
      }
    } catch (error) {
      console.error("Failed to send message", error);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[1280px] mx-auto h-[calc(100vh-80px)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-[#132a13]">Messages</h1>
        <p className="text-[#5f5f5f]">Communicate with your teachers and peers.</p>
      </div>

      <div className="flex-1 bg-white rounded-[12px] border border-[#c6c6c6] overflow-hidden flex" style={{ boxShadow: '0 4px 12px rgba(19, 42, 19, 0.08)' }}>
        
        {/* Sidebar Contacts list */}
        <div className="w-full md:w-1/3 border-r border-[#c6c6c6] flex flex-col bg-[#fefef9]">
          <div className="p-4 border-b border-[#c6c6c6]">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full pl-10 pr-4 py-2 border border-[#c6c6c6] rounded-lg bg-white text-[#444444] placeholder-[#a4a4a4] focus:outline-none focus:border-[#31572c]"
              />
              <Search className="w-5 h-5 text-[#a4a4a4] absolute left-3 top-2.5" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loadingContacts ? (
              <div className="p-8 flex justify-center"><span className="material-symbols-outlined animate-spin text-primary">progress_activity</span></div>
            ) : contacts.length > 0 ? (
              contacts.map(contact => (
                <div 
                  key={contact.id} 
                  onClick={() => setActiveContact(contact)}
                  className={`p-4 border-b border-[#e4e4e4] cursor-pointer hover:bg-[#eff3e7] transition-colors flex justify-between items-center ${activeContact?.id === contact.id ? 'bg-[#fcfdf1] border-l-4 border-l-[#31572c]' : 'border-l-4 border-l-transparent'}`}
                >
                  <div className="overflow-hidden">
                    <h3 className={`text-[15px] font-bold truncate ${contact.unread ? 'text-[#132a13]' : 'text-[#444444]'}`}>{contact.name}</h3>
                    <p className="text-sm text-[#5f5f5f] truncate mt-1">{contact.lastMessage}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-2 shrink-0">
                    <span className="text-xs text-[#818181]">{contact.time}</span>
                    {contact.unread && <Circle className="w-3 h-3 fill-[#90a955] text-[#90a955]" />}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-body-secondary italic">No contacts or courses available.</div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-col w-2/3 bg-[#fefef9]">
          {activeContact ? (
            <>
              <div className="p-4 border-b border-[#c6c6c6] bg-white flex justify-between items-center">
                <h2 className="text-lg font-bold text-[#132a13]">{activeContact.name}</h2>
                <button className="text-[#5f5f5f] hover:text-[#31572c] transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
                {loadingMessages ? (
                  <div className="flex-1 flex justify-center items-center"><span className="material-symbols-outlined animate-spin text-primary">progress_activity</span></div>
                ) : messages.length > 0 ? (
                  messages.map(msg => {
                    const isMe = currentUser?.id === msg.senderId;
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-end gap-2 max-w-[75%]">
                          {!isMe && (
                            <div className="w-8 h-8 rounded-full bg-primary-fixed-dim text-evergreen flex items-center justify-center font-bold text-xs shrink-0 mb-1">
                              {msg.sender?.firstName?.[0]}
                            </div>
                          )}
                          <div 
                            className={`p-3 rounded-2xl ${isMe ? 'bg-[#31572c] text-white rounded-br-none' : 'bg-[#e4e4e4] text-[#323232] rounded-bl-none'}`}
                          >
                            {!isMe && activeContact.courseId && (
                              <div className="text-xs font-bold text-[#31572c] mb-1">{msg.sender?.firstName} {msg.sender?.lastName}</div>
                            )}
                            <p className="text-[15px] whitespace-pre-wrap">{msg.body}</p>
                          </div>
                        </div>
                        <span className="text-xs text-[#818181] mt-1 mx-10">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex-1 flex justify-center items-center text-body-secondary italic">
                    No messages yet. Send a message to start the conversation!
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-[#c6c6c6] bg-white">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <button type="button" className="p-2 text-[#5f5f5f] hover:bg-[#f4f4f4] rounded-full transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input 
                    type="text" 
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..." 
                    disabled={sending}
                    className="flex-1 bg-[#f4f4f4] border border-[#c6c6c6] rounded-full px-4 py-2 text-[#444444] placeholder-[#a4a4a4] focus:outline-none focus:border-[#31572c] focus:ring-1 focus:ring-[#31572c] disabled:opacity-70"
                  />
                  <button 
                    type="submit"
                    disabled={!messageInput.trim() || sending}
                    className="p-2 bg-[#31572c] text-white rounded-full hover:opacity-90 transition-opacity disabled:opacity-50" 
                    style={{ background: 'linear-gradient(180deg, #3a6633 0%, #31572c 100%)' }}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-body-secondary">
              <span className="material-symbols-outlined text-6xl mb-4 text-outline/30">forum</span>
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

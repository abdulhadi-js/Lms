"use client";

import React, { useState } from 'react';
import { Send, Paperclip, Search, MoreVertical, Circle } from 'lucide-react';

const mockContacts = [
  { id: 1, name: 'Dr. Turing (CS101)', lastMessage: 'Please review chapter 4 before...', time: '10:30 AM', unread: true },
  { id: 2, name: 'Prof. Drucker (MGT201)', lastMessage: 'Your essay grade has been posted.', time: 'Yesterday', unread: false },
  { id: 3, name: 'Alice Smith (Classmate)', lastMessage: 'Did you get the notes from Monday?', time: 'Tuesday', unread: false },
  { id: 4, name: 'IT Helpdesk', lastMessage: 'Your password reset is complete.', time: 'Oct 12', unread: false },
];

const mockMessages = [
  { id: 1, sender: 'Dr. Turing (CS101)', text: 'Hello class, just a reminder that Assignment 2 is due this Friday.', time: '09:00 AM', isMe: false },
  { id: 2, sender: 'Me', text: 'Thank you Dr. Turing. Are we allowed to use external libraries?', time: '09:15 AM', isMe: true },
  { id: 3, sender: 'Dr. Turing (CS101)', text: 'Yes, but please cite them in your README file.', time: '10:30 AM', isMe: false },
];

export default function StudentChat() {
  const [activeContact, setActiveContact] = useState(mockContacts[0]);

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
            {mockContacts.map(contact => (
              <div 
                key={contact.id} 
                onClick={() => setActiveContact(contact)}
                className={`p-4 border-b border-[#e4e4e4] cursor-pointer hover:bg-[#eff3e7] transition-colors flex justify-between items-center ${activeContact.id === contact.id ? 'bg-[#fcfdf1] border-l-4 border-l-[#31572c]' : 'border-l-4 border-l-transparent'}`}
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
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-col w-2/3 bg-[#fefef9]">
          <div className="p-4 border-b border-[#c6c6c6] bg-white flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#132a13]">{activeContact.name}</h2>
            <button className="text-[#5f5f5f] hover:text-[#31572c] transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {mockMessages.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-end gap-2 max-w-[75%]">
                  {!msg.isMe && (
                    <div className="w-8 h-8 rounded-full bg-[#c6c6c6] shrink-0 mb-1"></div>
                  )}
                  <div 
                    className={`p-3 rounded-2xl ${msg.isMe ? 'bg-[#31572c] text-white rounded-br-none' : 'bg-[#e4e4e4] text-[#323232] rounded-bl-none'}`}
                  >
                    <p className="text-[15px]">{msg.text}</p>
                  </div>
                </div>
                <span className="text-xs text-[#818181] mt-1 mx-10">{msg.time}</span>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-[#c6c6c6] bg-white">
            <div className="flex items-center gap-2">
              <button className="p-2 text-[#5f5f5f] hover:bg-[#f4f4f4] rounded-full transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="flex-1 bg-[#f4f4f4] border border-[#c6c6c6] rounded-full px-4 py-2 text-[#444444] placeholder-[#a4a4a4] focus:outline-none focus:border-[#31572c] focus:ring-1 focus:ring-[#31572c]"
              />
              <button 
                className="p-2 bg-[#31572c] text-white rounded-full hover:opacity-90 transition-opacity" 
                style={{ background: 'linear-gradient(180deg, #3a6633 0%, #31572c 100%)' }}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

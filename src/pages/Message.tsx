
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, Search, Send, User, Plus,
  Check, Clock, ArrowRight, X 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Mock messages
const mockContacts = [
  { id: '1', name: 'John Smith', role: 'Teacher', avatar: 'https://i.pravatar.cc/150?u=1', status: 'online', unread: 2 },
  { id: '2', name: 'Sarah Johnson', role: 'Parent', avatar: 'https://i.pravatar.cc/150?u=2', status: 'offline', unread: 0 },
  { id: '3', name: 'Michael Brown', role: 'Student', avatar: 'https://i.pravatar.cc/150?u=3', status: 'online', unread: 0 },
  { id: '4', name: 'Emily Wilson', role: 'Teacher', avatar: 'https://i.pravatar.cc/150?u=4', status: 'online', unread: 1 },
  { id: '5', name: 'David Lee', role: 'Parent', avatar: 'https://i.pravatar.cc/150?u=5', status: 'offline', unread: 0 },
];

const mockMessages = [
  { id: '1', senderId: '1', receiverId: 'current', content: 'Hello there! How are you doing today?', timestamp: '2023-05-15T10:30:00', read: true },
  { id: '2', senderId: 'current', receiverId: '1', content: 'Hi John! I\'m doing great, thanks for asking. How about you?', timestamp: '2023-05-15T10:32:00', read: true },
  { id: '3', senderId: '1', receiverId: 'current', content: 'I\'m good too! Just wanted to check in about the upcoming parent-teacher meeting next week.', timestamp: '2023-05-15T10:35:00', read: true },
  { id: '4', senderId: 'current', receiverId: '1', content: 'Yes, I have it on my calendar. Is there anything specific you\'d like to discuss?', timestamp: '2023-05-15T10:38:00', read: true },
  { id: '5', senderId: '1', receiverId: 'current', content: 'I\'d like to discuss the recent test results and the plan for the upcoming semester.', timestamp: '2023-05-15T10:40:00', read: false },
  { id: '6', senderId: '1', receiverId: 'current', content: 'Also, could you bring any completed assignments that we might review together?', timestamp: '2023-05-15T10:41:00', read: false },
];

const Message = () => {
  const [contacts, setContacts] = useState(mockContacts);
  const [messages, setMessages] = useState(mockMessages);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<typeof mockContacts[0] | null>(null);
  const [messageText, setMessageText] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [showComposeModal, setShowComposeModal] = useState(false);
  
  // Filter contacts by search term and selected tab
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        contact.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = selectedTab === 'all' || contact.role.toLowerCase() === selectedTab.toLowerCase();
    return matchesSearch && matchesTab;
  });
  
  // Get messages for the selected contact
  const contactMessages = selectedContact 
    ? messages.filter(msg => 
        (msg.senderId === selectedContact.id && msg.receiverId === 'current') || 
        (msg.senderId === 'current' && msg.receiverId === selectedContact.id)
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];
  
  const handleSendMessage = () => {
    if (!selectedContact || !messageText.trim()) return;
    
    const newMessage = {
      id: (messages.length + 1).toString(),
      senderId: 'current',
      receiverId: selectedContact.id,
      content: messageText.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setMessages([...messages, newMessage]);
    setMessageText('');
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Button onClick={() => setShowComposeModal(true)}>
          <Plus size={16} className="mr-2" /> New Message
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
              <CardDescription>Your recent message conversations.</CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-4">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="teacher">Teachers</TabsTrigger>
                  <TabsTrigger value="student">Students</TabsTrigger>
                  <TabsTrigger value="parent">Parents</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <div 
                      key={contact.id} 
                      className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                        selectedContact?.id === contact.id ? 'bg-primary/10' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={contact.avatar} alt={contact.name} />
                          <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`}></span>
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-sm">{contact.name}</p>
                          {contact.unread > 0 && (
                            <Badge className="h-5 w-5 flex items-center justify-center rounded-full p-0">
                              {contact.unread}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{contact.role}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-gray-500">
                    No contacts found matching your criteria.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-[70vh] flex flex-col">
            <CardHeader className="border-b">
              {selectedContact ? (
                <div className="flex items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                    <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <CardTitle className="text-base">{selectedContact.name}</CardTitle>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span className={`w-2 h-2 rounded-full mr-1.5 ${
                        selectedContact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></span>
                      {selectedContact.status === 'online' ? 'Online' : 'Offline'}
                    </div>
                  </div>
                </div>
              ) : (
                <CardTitle>Select a conversation</CardTitle>
              )}
            </CardHeader>
            {selectedContact ? (
              <>
                <CardContent className="flex-1 overflow-y-auto p-4">
                  {contactMessages.length > 0 ? (
                    <div className="space-y-4">
                      {contactMessages.map((msg) => {
                        const isCurrentUser = msg.senderId === 'current';
                        return (
                          <div 
                            key={msg.id} 
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[80%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                              {!isCurrentUser && (
                                <Avatar className="h-8 w-8 mb-1">
                                  <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                                  <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                              )}
                              <div 
                                className={`p-3 rounded-lg ${
                                  isCurrentUser 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'bg-muted'
                                }`}
                              >
                                <p className="text-sm">{msg.content}</p>
                              </div>
                              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                {formatTime(msg.timestamp)}
                                {isCurrentUser && (
                                  msg.read 
                                    ? <Check size={12} className="ml-1 text-blue-500" /> 
                                    : <Clock size={12} className="ml-1" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                      <MessageSquare size={48} className="mb-4 opacity-20" />
                      <p>No messages yet. Send a message to start the conversation.</p>
                    </div>
                  )}
                </CardContent>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="flex-1"
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                      <Send size={16} />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
                <MessageSquare size={64} className="mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-2">Your Messages</h3>
                <p className="mb-4">Select a conversation from the list to start chatting.</p>
                <Button onClick={() => setShowComposeModal(true)}>
                  <Plus size={16} className="mr-2" /> Start New Conversation
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {showComposeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>New Message</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowComposeModal(false)}>
                  <X size={18} />
                </Button>
              </div>
              <CardDescription>Create a new message to send to contacts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="recipient" className="block text-sm font-medium mb-1">To</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      id="recipient"
                      placeholder="Search for contacts..."
                      className="pl-9"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="messageContent" className="block text-sm font-medium mb-1">Message</label>
                  <Textarea
                    id="messageContent"
                    placeholder="Type your message here..."
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </CardContent>
            <div className="p-4 border-t flex justify-end">
              <Button variant="outline" className="mr-2" onClick={() => setShowComposeModal(false)}>
                Cancel
              </Button>
              <Button>
                <Send size={16} className="mr-2" /> Send Message
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Message;

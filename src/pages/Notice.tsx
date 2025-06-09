
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BellRing, Eye, FilePlus, Plus, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

// Mock notices
const mockNotices = [
  {
    id: '1',
    title: 'School Annual Day Celebration',
    content: 'The Annual Day celebration will be held on December 20th. All students and parents are invited to attend.',
    date: '2023-12-01',
    author: 'Principal',
    targetGroups: ['all'],
  },
  {
    id: '2',
    title: 'Mid-Term Examination Schedule',
    content: 'The Mid-Term examinations will commence from October 15th. Please check the detailed schedule on the notice board.',
    date: '2023-10-01',
    author: 'Academic Coordinator',
    targetGroups: ['students', 'teachers'],
  },
  {
    id: '3',
    title: 'Parent-Teacher Meeting',
    content: 'A Parent-Teacher meeting is scheduled for October 10th from 10:00 AM to 2:00 PM. All parents are requested to attend.',
    date: '2023-09-25',
    author: 'Class Teacher',
    targetGroups: ['parents'],
  },
  {
    id: '4',
    title: 'Sports Day Announcement',
    content: 'The annual Sports Day will be held on November 15th. Students interested in participating should register with their Physical Education teacher.',
    date: '2023-10-20',
    author: 'Sports Coordinator',
    targetGroups: ['students'],
  },
  {
    id: '5',
    title: 'Faculty Meeting',
    content: 'An important faculty meeting will be held on October 5th at 3:30 PM in the conference room. All teaching staff are required to attend.',
    date: '2023-09-28',
    author: 'Vice Principal',
    targetGroups: ['teachers'],
  },
];

const Notice = () => {
  const [notices, setNotices] = useState(mockNotices);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedNotice, setSelectedNotice] = useState<typeof mockNotices[0] | null>(null);
  
  // New notice form state
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeTargetGroups, setNewNoticeTargetGroups] = useState<string[]>(['all']);
  
  const { toast } = useToast();

  // Filter notices by search term and selected tab
  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = selectedTab === 'all' || notice.targetGroups.includes(selectedTab);
    return matchesSearch && matchesTab;
  });

  const handleTargetGroupToggle = (group: string) => {
    if (group === 'all') {
      setNewNoticeTargetGroups(['all']);
    } else {
      // If 'all' is already selected, remove it
      const updatedGroups = newNoticeTargetGroups.filter(g => g !== 'all');
      
      // Toggle the selected group
      if (updatedGroups.includes(group)) {
        setNewNoticeTargetGroups(updatedGroups.filter(g => g !== group));
      } else {
        setNewNoticeTargetGroups([...updatedGroups, group]);
      }
    }
  };

  const handleAddNotice = () => {
    if (!newNoticeTitle.trim() || !newNoticeContent.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    const newNotice = {
      id: (notices.length + 1).toString(),
      title: newNoticeTitle,
      content: newNoticeContent,
      date: new Date().toISOString().split('T')[0],
      author: 'Current User',
      targetGroups: newNoticeTargetGroups,
    };

    setNotices([newNotice, ...notices]);
    setNewNoticeTitle('');
    setNewNoticeContent('');
    setNewNoticeTargetGroups(['all']);
    setShowAddForm(false);
    
    toast({
      title: 'Success',
      description: 'Notice has been published successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notice Board</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} className="mr-2" /> Add New Notice
        </Button>
      </div>
      
      {showAddForm && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Create New Notice</CardTitle>
            <CardDescription>Fill in the details below to publish a new notice.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="noticeTitle" className="block text-sm font-medium mb-1">Notice Title*</label>
                <Input
                  id="noticeTitle"
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  placeholder="Enter notice title"
                />
              </div>
              <div>
                <label htmlFor="noticeContent" className="block text-sm font-medium mb-1">Notice Content*</label>
                <Textarea
                  id="noticeContent"
                  value={newNoticeContent}
                  onChange={(e) => setNewNoticeContent(e.target.value)}
                  placeholder="Enter notice content"
                  className="min-h-[120px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Target Audience*</label>
                <div className="flex flex-wrap gap-2">
                  {['all', 'students', 'teachers', 'parents'].map((group) => (
                    <Badge
                      key={group}
                      variant={newNoticeTargetGroups.includes(group) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleTargetGroupToggle(group)}
                    >
                      {group.charAt(0).toUpperCase() + group.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            <Button onClick={handleAddNotice}>
              <FilePlus size={16} className="mr-2" /> Publish Notice
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Notices</CardTitle>
              <CardDescription>View all published notices and announcements.</CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search notices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-4">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="students">Students</TabsTrigger>
                  <TabsTrigger value="teachers">Teachers</TabsTrigger>
                  <TabsTrigger value="parents">Parents</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="space-y-4">
                {filteredNotices.length > 0 ? (
                  filteredNotices.map((notice) => (
                    <Card 
                      key={notice.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedNotice(notice)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{notice.title}</CardTitle>
                          <div className="text-sm text-muted-foreground">
                            {notice.date}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {notice.targetGroups.map((group) => (
                            <Badge key={group} variant="outline" className="text-xs">
                              {group === 'all' ? 'Everyone' : group.charAt(0).toUpperCase() + group.slice(1)}
                            </Badge>
                          ))}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="line-clamp-2 text-sm">{notice.content}</p>
                      </CardContent>
                      <CardFooter className="pt-0 flex justify-between text-sm text-muted-foreground">
                        <div>By: {notice.author}</div>
                        <Button variant="ghost" size="sm" className="text-blue-500">
                          <Eye size={16} className="mr-1" /> View
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No notices found. Add a new notice to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BellRing size={20} className="text-primary" />
                <CardTitle>Notice Details</CardTitle>
              </div>
              <CardDescription>
                {selectedNotice ? 'View the complete notice details.' : 'Select a notice to view details.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedNotice ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedNotice.title}</h3>
                    <div className="flex gap-1 mt-1">
                      {selectedNotice.targetGroups.map((group) => (
                        <Badge key={group} variant="outline" className="text-xs">
                          {group === 'all' ? 'Everyone' : group.charAt(0).toUpperCase() + group.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="py-2 border-y">
                    <p className="whitespace-pre-line">{selectedNotice.content}</p>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div>Posted by: {selectedNotice.author}</div>
                    <div>Date: {selectedNotice.date}</div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <BellRing size={48} className="mb-4 opacity-20" />
                  <p>Select a notice from the list to view its details here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notice;

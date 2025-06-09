
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Check, CheckCircle, ChevronDown, ChevronUp, Copy, Heart, Share, ThumbsUp, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '@/components/ui/use-toast';

const UIElements = () => {
  const { themeColor, setThemeColor } = useTheme();
  const { toast } = useToast();
  const [progress, setProgress] = useState(45);
  
  const colors = [
    { id: 'blue', name: 'Ocean Blue', value: '#0EA5E9', background: 'bg-blue-500', foreground: 'text-white' },
    { id: 'purple', name: 'Royal Purple', value: '#9b87f5', background: 'bg-purple-500', foreground: 'text-white' },
    { id: 'green', name: 'Emerald Green', value: '#10B981', background: 'bg-green-500', foreground: 'text-white' },
    { id: 'orange', name: 'Vibrant Orange', value: '#F97316', background: 'bg-orange-500', foreground: 'text-white' },
    { id: 'pink', name: 'Rose Pink', value: '#EC4899', background: 'bg-pink-500', foreground: 'text-white' }
  ];

  const handleColorChange = (color: string) => {
    setThemeColor(color);
    toast({
      title: 'Theme Updated',
      description: 'The system theme color has been changed successfully.',
    });
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">UI Elements</h1>
      
      <Tabs defaultValue="colors">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Theme</CardTitle>
                <CardDescription>Change the primary color theme for the entire system.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4">
                  {colors.map((color) => (
                    <div key={color.id} className="flex flex-col items-center">
                      <button
                        className={`h-12 w-12 rounded-full flex items-center justify-center ${color.background} 
                          ${themeColor === color.value ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                        onClick={() => handleColorChange(color.value)}
                      >
                        {themeColor === color.value && (
                          <Check className="text-white" />
                        )}
                      </button>
                      <span className="text-xs mt-2">{color.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Color Palette</CardTitle>
                <CardDescription>Primary color shades in the current theme.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-8 rounded-md bg-primary"></div>
                  <div className="grid grid-cols-5 gap-2">
                    <div className="h-8 rounded-md bg-primary/90"></div>
                    <div className="h-8 rounded-md bg-primary/70"></div>
                    <div className="h-8 rounded-md bg-primary/50"></div>
                    <div className="h-8 rounded-md bg-primary/30"></div>
                    <div className="h-8 rounded-md bg-primary/10"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="components" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>Various button styles and variants.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon"><Heart size={16} /></Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button><CheckCircle className="mr-2 h-4 w-4" /> With Icon</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Badges</CardTitle>
                <CardDescription>Status indicators and labels.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge><CheckCircle className="mr-1 h-3 w-3" /> With Icon</Badge>
                  <Badge variant="outline" className="border-green-500 text-green-500">Success</Badge>
                  <Badge variant="outline" className="border-yellow-500 text-yellow-500">Warning</Badge>
                  <Badge variant="outline" className="border-red-500 text-red-500">Error</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Avatars</CardTitle>
                <CardDescription>User profile images and placeholders.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="https://i.pravatar.cc/150?u=1" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="https://i.pravatar.cc/150?u=2" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="https://i.pravatar.cc/150?u=3" />
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://i.pravatar.cc/150?u=4" />
                    <AvatarFallback>MK</AvatarFallback>
                  </Avatar>
                  <div className="flex -space-x-2">
                    <Avatar className="h-8 w-8 border-2 border-white">
                      <AvatarImage src="https://i.pravatar.cc/150?u=5" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 border-2 border-white">
                      <AvatarImage src="https://i.pravatar.cc/150?u=6" />
                      <AvatarFallback>ST</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 border-2 border-white">
                      <AvatarFallback>+3</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
                <CardDescription>Progress indicators and loading states.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}><ChevronDown size={14} /></Button>
                  <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}><ChevronUp size={14} /></Button>
                  <Button size="sm" onClick={() => setProgress(0)}>Reset</Button>
                  <Button size="sm" onClick={() => setProgress(100)}>Complete</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="forms" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Form Elements</CardTitle>
              <CardDescription>Input fields and form controls.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="input-example">Text Input</Label>
                    <Input id="input-example" placeholder="Enter your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="textarea-example">Textarea</Label>
                    <Textarea id="textarea-example" placeholder="Enter your message" />
                  </div>
                  <div className="space-y-2">
                    <Label>Switch</Label>
                    <div className="flex items-center space-x-2">
                      <Switch id="switch-example" />
                      <Label htmlFor="switch-example">Email notifications</Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Checkboxes</Label>
                    <div className="space-y-2">
                      {['Terms and conditions', 'Privacy policy', 'Marketing emails'].map((item) => (
                        <div key={item} className="flex items-center space-x-2">
                          <Checkbox id={`check-${item}`} />
                          <Label htmlFor={`check-${item}`}>{item}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Radio Buttons</Label>
                    <RadioGroup defaultValue="option-1">
                      {['Email', 'Phone', 'SMS'].map((item, i) => (
                        <div key={item} className="flex items-center space-x-2">
                          <RadioGroupItem value={`option-${i+1}`} id={`option-${i+1}`} />
                          <Label htmlFor={`option-${i+1}`}>{item}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Submit</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="layout" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Card Component</CardTitle>
                <CardDescription>Styled card with header, content, and footer.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Cards are used to group related content and actions. They can contain headers, footers, and various content types.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" size="sm">Cancel</Button>
                <Button size="sm">Save</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Separator</CardTitle>
                <CardDescription>Visual dividers between content.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Horizontal separator:</p>
                    <div className="py-2">
                      <Separator className="my-2" />
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Vertical separator:</p>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div>
                      <p className="text-sm text-muted-foreground">Between content</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Interactive Example</CardTitle>
                <CardDescription>See how components work together.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="https://i.pravatar.cc/150?u=john" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">John Doe</p>
                          <p className="text-xs text-muted-foreground">Posted 2 hours ago</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon"><X size={16} /></Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p>This is an example of how multiple components can work together to create a complete UI element.</p>
                    <div className="mt-4 aspect-video bg-muted rounded-md flex items-center justify-center">
                      [Image Content]
                    </div>
                  </div>
                  <div className="bg-muted p-4 flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm"><ThumbsUp size={16} className="mr-1" /> Like</Button>
                      <Button variant="ghost" size="sm"><Share size={16} className="mr-1" /> Share</Button>
                      <Button variant="ghost" size="sm"><Copy size={16} className="mr-1" /> Copy</Button>
                    </div>
                    <Badge>New</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UIElements;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

interface SchoolSetupModalProps {
  open: boolean;
  onClose: () => void;
}

interface SchoolColor {
  id: string;
  name: string;
  value: string;
  background: string;
  foreground: string;
}

export const SchoolSetupModal: React.FC<SchoolSetupModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { addSchool } = useData();
  const { toast } = useToast();

  const [schoolName, setSchoolName] = useState('');
  const [schoolAddress, setSchoolAddress] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  // Define school color options
  const schoolColors: SchoolColor[] = [
    { id: 'blue', name: 'Ocean Blue', value: '#0EA5E9', background: 'bg-blue-500', foreground: 'text-white' },
    { id: 'purple', name: 'Royal Purple', value: '#9b87f5', background: 'bg-purple-500', foreground: 'text-white' },
    { id: 'green', name: 'Emerald Green', value: '#10B981', background: 'bg-green-500', foreground: 'text-white' },
    { id: 'orange', name: 'Vibrant Orange', value: '#F97316', background: 'bg-orange-500', foreground: 'text-white' },
    { id: 'pink', name: 'Rose Pink', value: '#EC4899', background: 'bg-pink-500', foreground: 'text-white' }
  ];
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = () => {
    // Basic validation
    if (!schoolName.trim()) {
      toast({ title: 'Error', description: 'School name is required', variant: 'destructive' });
      return;
    }
    
    if (!schoolAddress.trim()) {
      toast({ title: 'Error', description: 'School address is required', variant: 'destructive' });
      return;
    }
    
    if (!selectedColor) {
      toast({ title: 'Error', description: 'Please select a school color', variant: 'destructive' });
      return;
    }
    
    // Add school to context
    const newSchool = {
      name: schoolName,
      location: schoolAddress,
      logo: logoPreview,
      themeColor: selectedColor
    };
    
    addSchool(newSchool);
    
    // Apply the selected theme color
    const colorObj = schoolColors.find(color => color.id === selectedColor);
    if (colorObj) {
      document.documentElement.style.setProperty('--primary', colorObj.value);
      localStorage.setItem('schoolThemeColor', colorObj.value);
    }
    
    toast({ title: 'Success', description: `School "${schoolName}" has been created.` });
    
    // Close modal and navigate to dashboard
    onClose();
    navigate('/');
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New School</DialogTitle>
          <DialogDescription>
            Enter your school details to set up your management system.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="schoolName">School Name</Label>
            <Input
              id="schoolName"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Enter school name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="schoolAddress">School Address</Label>
            <Textarea
              id="schoolAddress"
              value={schoolAddress}
              onChange={(e) => setSchoolAddress(e.target.value)}
              placeholder="Enter school address"
              className="min-h-[80px]"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="logo">School Logo</Label>
            <div className="flex items-center gap-4">
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="flex-1"
              />
              {logoPreview && (
                <div className="h-12 w-12 rounded-md overflow-hidden border">
                  <img
                    src={logoPreview}
                    alt="School Logo Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label>Select School Color</Label>
            <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="grid grid-cols-5 gap-2">
              {schoolColors.map((color) => (
                <div key={color.id} className="flex items-center">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={color.id} id={color.id} className="sr-only" />
                    <Label
                      htmlFor={color.id}
                      className={`h-8 w-8 rounded-full cursor-pointer flex items-center justify-center border-2 ${
                        selectedColor === color.id ? 'border-black' : 'border-transparent'
                      }`}
                    >
                      <div className={`h-6 w-6 rounded-full ${color.background}`} />
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>
            {selectedColor && (
              <p className="text-sm text-muted-foreground mt-1">
                Selected: {schoolColors.find(c => c.id === selectedColor)?.name}
              </p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Add School
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

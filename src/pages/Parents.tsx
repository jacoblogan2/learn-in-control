
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, Search, Plus } from 'lucide-react';
import { AdminDataService } from '@/services/adminDataService';
import { useToast } from '@/hooks/use-toast';

const Parents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMobile, setSearchMobile] = useState('');
  const [parents, setParents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch parents from database
  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    setLoading(true);
    try {
      const { data, error } = await AdminDataService.getParents();
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive"
        });
      } else {
        setParents(data || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load parents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this parent?')) {
      const { error } = await AdminDataService.deleteParent(id);
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Parent deleted successfully"
        });
        fetchParents(); // Refresh the list
      }
    }
  };

  // Filter parents based on search criteria
  const filteredParents = parents.filter(parent => {
    const nameMatch = parent.name.toLowerCase().includes(searchTerm.toLowerCase());
    const mobileMatch = searchMobile ? parent.phone.includes(searchMobile) : true;
    
    return nameMatch && mobileMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">All Parents List</h1>
        
        <div className="flex flex-col md:flex-row gap-3">
          <Input 
            type="text" 
            placeholder="ID/Type here..." 
            className="w-full md:w-48"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)} 
          />
          
          <Input 
            type="text" 
            placeholder="Type Mobile Number..." 
            className="w-full md:w-48"
            value={searchMobile}
            onChange={e => setSearchMobile(e.target.value)}
          />
          
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            <Search size={16} />
            SEARCH
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-md shadow-sm">
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="font-semibold">All Parents</h2>
          
          <div className="flex items-center space-x-2">
            <Link to="/add-parent">
              <Button variant="default" className="bg-yellow-500 hover:bg-yellow-600 flex items-center gap-2">
                <Plus size={16} />
                Add Parent
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table className="akkhor-table">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="w-12">
                  <input type="checkbox" className="h-4 w-4" />
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Occupation</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Mobile No</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    Loading parents...
                  </TableCell>
                </TableRow>
              ) : filteredParents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    No parents found
                  </TableCell>
                </TableRow>
              ) : (
                filteredParents.map((parent) => (
                  <TableRow key={parent.id}>
                    <TableCell>
                      <input type="checkbox" className="h-4 w-4" />
                    </TableCell>
                    <TableCell>#{parent.id.slice(-8)}</TableCell>
                    <TableCell>
                      <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden">
                        <img 
                          src={`https://i.pravatar.cc/150?u=${parent.id}`} 
                          alt={parent.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>{parent.name}</TableCell>
                    <TableCell>{parent.gender || 'N/A'}</TableCell>
                    <TableCell>{parent.occupation || 'N/A'}</TableCell>
                    <TableCell>{parent.address || 'N/A'}</TableCell>
                    <TableCell>{parent.phone}</TableCell>
                    <TableCell>{parent.email}</TableCell>
                    <TableCell>
                      <div className="flex justify-end items-center space-x-2">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600">
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-600">
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-red-600"
                          onClick={() => handleDelete(parent.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Parents;

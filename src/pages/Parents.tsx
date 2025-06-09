
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, Search } from 'lucide-react';

const Parents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMobile, setSearchMobile] = useState('');

  // Generate mock data for parents
  const mockParents = Array(20).fill(null).map((_, index) => {
    const id = (2901 + index).toString();
    const names = [
      'Richi Rozario', 'Kazi Fahim', 'Maccullum', 'Jack Sparrow',
      'Lisa Alam', 'Bushed Kabirun', 'Kantaz Appoy'
    ];
    const name = names[index % names.length];
    const gender = index % 3 === 0 ? 'Male' : 'Female';
    const occupations = [
      'House Wife', 'Businessman', 'Banker', 'Account',
      'Architecture', 'Engineer', 'Programmer', 'Software'
    ];
    const occupation = occupations[index % occupations.length];
    const addresses = [
      'TA-110, North Sydney', '59 street, North Sydney',
      '110 street, third island', '58 street, mecshew Sydney',
      '10 street, hibird island', '123 street, mecshew Sydney'
    ];
    const address = addresses[index % addresses.length];
    const phone = '+ 8812 00 5098';
    const email = `${name.toLowerCase().replace(/\s/g, '')}@gmail.com`;

    return {
      id,
      name,
      gender,
      occupation,
      address,
      phone,
      email,
      photoUrl: `https://i.pravatar.cc/150?u=parent${index}`
    };
  });

  // Filter parents based on search criteria
  const filteredParents = mockParents.filter(parent => {
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
            <Button variant="outline" size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </Button>
            <Button variant="outline" size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </Button>
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
              {filteredParents.map((parent) => (
                <TableRow key={parent.id}>
                  <TableCell>
                    <input type="checkbox" className="h-4 w-4" />
                  </TableCell>
                  <TableCell>#{parent.id}</TableCell>
                  <TableCell>
                    <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden">
                      <img 
                        src={parent.photoUrl} 
                        alt={parent.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{parent.name}</TableCell>
                  <TableCell>{parent.gender}</TableCell>
                  <TableCell>{parent.occupation}</TableCell>
                  <TableCell>{parent.address}</TableCell>
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
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Parents;

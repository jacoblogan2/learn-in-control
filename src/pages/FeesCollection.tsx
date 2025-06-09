
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, Search } from 'lucide-react';

const FeesCollection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPhone, setSearchPhone] = useState('');

  // Generate mock data for fees
  const mockFees = Array(20).fill(null).map((_, index) => {
    const id = (2901 + index).toString();
    const names = [
      'Richi Rozario', 'Kazi Fahim', 'Nichi Rozario', 'Michi Rozario',
      'Dichi Rozario', 'Richi Geo', 'Kazi Fahim'
    ];
    const name = names[index % names.length];
    const gender = index % 3 === 0 ? 'Male' : 'Female';
    const parentsNames = [
      'Nathan Smith', 'Mike Hussy', 'David Smith', 'Tavid Smith',
      'Basid Smith', 'Tavid Smith'
    ];
    const parentsName = parentsNames[index % parentsNames.length];
    const classNum = (index % 5) + 1;
    const sections = ['A', 'B', 'C', 'D', 'E'];
    const section = sections[index % sections.length];
    
    const fees = [1200, 1500, 3000, 500, 2500, 1800, 5700, 5000, 6500];
    const fee = fees[index % fees.length];
    const status = index % 2 === 0 ? 'Paid' : 'Due';
    const phone = '+ 8812 00 5098';
    const email = `${name.toLowerCase().replace(/\s/g, '')}@gmail.com`;
    const date = '10/03/2017';

    return {
      id,
      name,
      gender,
      parentsName,
      class: classNum,
      section,
      fees: fee,
      status,
      phone,
      email,
      date,
      photoUrl: `https://i.pravatar.cc/150?u=student${index}`
    };
  });

  // Filter fees based on search criteria
  const filteredFees = mockFees.filter(fee => {
    const nameMatch = fee.name.toLowerCase().includes(searchTerm.toLowerCase());
    const phoneMatch = searchPhone ? fee.phone.includes(searchPhone) : true;
    
    return nameMatch && phoneMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Students Collection Fees Table</h1>
        
        <div className="flex flex-col md:flex-row gap-3">
          <Input 
            type="text" 
            placeholder="ID Search here..." 
            className="w-full md:w-48"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)} 
          />
          
          <Input 
            type="text" 
            placeholder="Phone Number..." 
            className="w-full md:w-48"
            value={searchPhone}
            onChange={e => setSearchPhone(e.target.value)}
          />
          
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            <Search size={16} />
            SEARCH
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-md shadow-sm">
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="font-semibold">All Fees Collection</h2>
          
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
                <TableHead>Parents Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell>
                    <input type="checkbox" className="h-4 w-4" />
                  </TableCell>
                  <TableCell>#{fee.id}</TableCell>
                  <TableCell>
                    <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden">
                      <img 
                        src={fee.photoUrl} 
                        alt={fee.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{fee.name}</TableCell>
                  <TableCell>{fee.gender}</TableCell>
                  <TableCell>{fee.parentsName}</TableCell>
                  <TableCell>{fee.class}</TableCell>
                  <TableCell>{fee.section}</TableCell>
                  <TableCell>${fee.fees}</TableCell>
                  <TableCell>
                    <span className={`status-badge ${fee.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} px-2 py-1 rounded-full text-xs`}>
                      {fee.status}
                    </span>
                  </TableCell>
                  <TableCell>{fee.phone}</TableCell>
                  <TableCell>{fee.email}</TableCell>
                  <TableCell>{fee.date}</TableCell>
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

export default FeesCollection;

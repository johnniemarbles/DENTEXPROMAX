
import React, { useState } from 'react';
import { LucideSearch, LucideMapPin } from 'lucide-react';
import { Button } from './Button';

interface SearchBarProps {
  onSearch: (location: string, keyword: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(location, keyword);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-white p-2 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
       <div className="flex-1 flex items-center px-4 h-12 w-full border-b md:border-b-0 md:border-r border-slate-100">
          <LucideSearch className="text-slate-400 mr-3" size={20} />
          <input 
            type="text"
            placeholder="Doctor, procedure, or clinic..."
            className="w-full h-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
       </div>
       <div className="flex-1 flex items-center px-4 h-12 w-full">
          <LucideMapPin className="text-slate-400 mr-3" size={20} />
          <input 
            type="text"
            placeholder="City, Zip, or 'Current Location'"
            className="w-full h-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
       </div>
       <Button 
          type="submit" 
          size="lg" 
          className="w-full md:w-auto px-8 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30"
       >
          Search
       </Button>
    </form>
  );
};

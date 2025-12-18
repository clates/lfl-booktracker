import { OpenLibraryDoc, getBookCover } from '@/lib/openLibrary';
import { X } from 'lucide-react';
import React from 'react';

type AutoCompleteResultsProps = {
  results: OpenLibraryDoc[];
  onSelect: (book: OpenLibraryDoc) => void;
};

const rowHeight = 50;

const AutoCompleteResults: React.FC<AutoCompleteResultsProps> = ({ results, onSelect }) => {
  return (
    <div className="relative flex flex-col gap-[1px] overflow-scroll transition-opacity duration-300 ease-in-out transform -translate-y-[10px] max-h-[225px]">
      {results.map((book, index) => (
        <div
          onClick={() => onSelect(book)}
          key={book.isbn ? book.isbn[0] : index}
          className={`group cursor-pointer hover:bg-gradient-to-r from-slate-100 to-transparent relative overflow-hidden shadow-md bg-white min-h-[50px] w-[600px]`}
        >
          <div
            className="absolute inset-0 bg-[length:300px] bg-no-repeat bg-right blur-xs group-hover:blur-none"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(0,0,0,0) 50%), url(${getBookCover(
                book
              )})`,
            }}
          ></div>
          <div className="absolute inset-0 flex flex-col justify-around items-start p-4">
            <h3 className="text-[#222] text-[16px] text-left whitespace-nowrap">{book.title}</h3>
            <p style={{ fontSize: '14px', margin: '0', color: '#555' }}>
              {book.author_name?.join(', ')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AutoCompleteResults;

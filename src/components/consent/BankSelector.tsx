import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

// List of 20 major banks in India
const INDIAN_BANKS = [
  'State Bank of India (SBI)',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Punjab National Bank (PNB)',
  'Bank of Baroda',
  'Canara Bank',
  'Union Bank of India',
  'Indian Bank',
  'Central Bank of India',
  'Bank of India',
  'IDBI Bank',
  'Federal Bank',
  'South Indian Bank',
  'RBL Bank',
  'Bandhan Bank',
  'IDFC First Bank',
  'Yes Bank',
  'IndusInd Bank'
];

interface BankSelectorProps {
  value: string;
  onChange: (bank: string) => void;
  placeholder?: string;
  className?: string;
}

const BankSelector: React.FC<BankSelectorProps> = ({
  value,
  onChange,
  placeholder = "Search and select a bank...",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter banks based on search term
  const filteredBanks = INDIAN_BANKS.filter(bank =>
    bank.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Keep search term when closing to maintain display
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (bank: string) => {
    onChange(bank);
    setSearchTerm(bank); // Set search term to selected bank
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue); // Update parent value immediately
    if (!isOpen && newValue.length > 0) setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Input field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="w-full bg-gray-900/70 border border-gray-800 rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
          readOnly={!isOpen}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          {value && !isOpen && (
            <Check className="w-4 h-4 text-green-400" />
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-gray-900/95 backdrop-blur-sm border border-gray-800 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {/* Bank list */}
          <div className="py-1">
            {filteredBanks.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-400 text-center">
                No banks found
              </div>
            ) : (
              filteredBanks.map((bank) => (
                <button
                  key={bank}
                  onClick={() => handleSelect(bank)}
                  className="w-full px-4 py-3 text-left text-white hover:bg-gray-800/70 transition-colors flex items-center justify-between group"
                >
                  <span className="text-sm">{bank}</span>
                  {value === bank && (
                    <Check className="w-4 h-4 text-green-400" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BankSelector;

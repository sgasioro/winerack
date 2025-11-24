import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (term: string, selectedRatings: string[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const ratingOptions = [
    'Hold',
    'Not yet at peak',
    'At peak',
    'May be past peak',
    'In decline',
    'May be undrinkable'
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term, selectedRatings);
  };

  const handleRatingChange = (rating: string) => {
    const newSelectedRatings = selectedRatings.includes(rating)
      ? selectedRatings.filter(r => r !== rating)
      : [...selectedRatings, rating];
    
    setSelectedRatings(newSelectedRatings);
    onSearch(searchTerm, newSelectedRatings);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedRatings([]);
    onSearch('', []);
  };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search wines..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button 
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters {selectedRatings.length > 0 && `(${selectedRatings.length})`}
        </button>
        {(searchTerm || selectedRatings.length > 0) && (
          <button className="clear-filters" onClick={clearAllFilters}>
            Clear All
          </button>
        )}
      </div>
      
      {showFilters && (
        <div className="rating-filters">
          <h4>Filter by Rating:</h4>
          <div className="rating-checkboxes">
            {ratingOptions.map(rating => (
              <label key={rating} className="rating-checkbox">
                <input
                  type="checkbox"
                  checked={selectedRatings.includes(rating)}
                  onChange={() => handleRatingChange(rating)}
                />
                <span>{rating}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
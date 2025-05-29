import React, { useState, useRef, useEffect } from 'react';

function SearchableSelect({ 
  options, 
  onSelect, 
  placeholder, 
  initialSelectedId = null,
  displayFormat = item => item.label
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const dropdownRef = useRef(null);

  // Başlangıçta seçili ID varsa, onu ayarla
  useEffect(() => {
    if (initialSelectedId !== null) {
      const item = options.find(option => option.id === parseInt(initialSelectedId));
      if (item) {
        setSelectedItem(item);
        setSearchTerm(displayFormat(item));
      }
    }
  }, [initialSelectedId, options, displayFormat]);

  // Dışarıya tıklandığında dropdown'ı kapat
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        // Eğer bir şey seçilmişse, arama kutusunu o değere ayarla
        if (selectedItem) {
          setSearchTerm(displayFormat(selectedItem));
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedItem, displayFormat]);

  // Arama terimi değiştiğinde filtreleme yap
  useEffect(() => {
    const filtered = options.filter(option => 
      displayFormat(option).toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options, displayFormat]);

  // Arama kutusuna odaklanıldığında
  const handleFocus = () => {
    setIsOpen(true);
    if (selectedItem) {
      // Arama kutusunu temizleyelim ki kullanıcı yeni arama yapabilsin
      setSearchTerm('');
    }
  };

  // Arama terimi değiştiğinde
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  // Bir seçenek seçildiğinde
  const handleSelect = (option) => {
    setSelectedItem(option);
    setSearchTerm(displayFormat(option));
    setIsOpen(false);
    if (onSelect) {
      onSelect(option.id.toString()); // ID'yi string olarak gönderiyoruz
    }
  };

  // Arama kutusunu temizle
  const handleClear = () => {
    setSearchTerm('');
    setSelectedItem(null);
    if (onSelect) {
      onSelect('');
    }
  };

  return (
    <div className="searchable-select position-relative" ref={dropdownRef}>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleFocus}
        />
        {searchTerm && (
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={handleClear}
          >
            <i className="bi bi-x"></i>
          </button>
        )}
      </div>
      
      {isOpen && (
        <div className="position-absolute w-100 mt-1 bg-white border rounded shadow-sm z-index-dropdown">
          {filteredOptions.length === 0 ? (
            <div className="p-2 text-muted">Sonuç bulunamadı</div>
          ) : (
            <ul className="list-group list-group-flush" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {filteredOptions.map(option => (
                <li
                  key={option.id}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleSelect(option)}
                >
                  {displayFormat(option)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchableSelect;
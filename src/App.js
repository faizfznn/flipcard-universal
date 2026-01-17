import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx'; 
import './App.css'; 


function App() {
  const [masterList, setMasterList] = useState([]);
  const [drawnCards, setDrawnCards] = useState([]);
  const [newCard, setNewCard] = useState(''); 
  const [currentCard, setCurrentCard] = useState(null); 
  const [isShuffling, setIsShuffling] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  const [sheetUrl, setSheetUrl] = useState('');

  const availableCards = useMemo(() => {
    return masterList.filter(card => !drawnCards.includes(card));
  }, [masterList, drawnCards]);

  const handleFetchCards = () => {
    if (!sheetUrl.trim()) {
      alert('Silakan masukkan URL Google Sheet Web App Anda.');
      return;
    }

    setIsLoading(true);
    fetch(sheetUrl)
      .then(res => res.json())
      .then(data => {
        if (data.status === "success" && data.cards) {
          // Ini adalah Hard Reset
          setDrawnCards([]); 
          alert(`Berhasil memuat ${data.cards.length} kartu dari GSheet.`);
        } else {
          alert('Gagal mengambil data. Pastikan URL Web App benar.');
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        alert('Terjadi error. Pastikan URL benar, V8 aktif, dan izin CORS "Anyone" telah diatur di Google Apps Script.');
        setIsLoading(false);
      });
  }; 

  const handleAddCard = (e) => {
    e.preventDefault(); 
    if (newCard.trim() !== '') {
      setMasterList(prevMaster => [...prevMaster, newCard]);
      setNewCard(''); 
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      if (data.length === 0) { 
        alert("File Excel kosong atau formatnya salah!");
        return; 
      }
      
      const headerKey = Object.keys(data[0])[0];
      const importedCards = data.map(row => row[headerKey]);
      
      setMasterList(importedCards); 
      setDrawnCards([]); 
      
      alert(`Berhasil mengimpor ${importedCards.length} kartu!`);
    };
    reader.readAsBinaryString(file);
  };

  const handleDrawCard = () => {
    if (availableCards.length === 0) {
      alert('Kartu sudah habis! Silakan muat dek baru.');
      return;
    }
    setIsShuffling(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      const selectedCard = availableCards[randomIndex];
      
      setCurrentCard(selectedCard); 
      setDrawnCards(prevDrawn => [...prevDrawn, selectedCard]);
      
      setIsShuffling(false);
      setShowPopup(true);
    }, 2000); 
  };

  const closePopup = () => {
    setShowPopup(false);
    setTimeout(() => setCurrentCard(null), 300);
  };

  return (
    <div className="App">
      <div className="container">
        
        <h1>Web Kartu Acak</h1>

        {isLoading ? (
          <p className="loading-text">Memuat kartu...</p>
        ) : (
          <p className="card-count">Tersisa {availableCards.length} kartu di dek.</p>
        )}
        
        <div className="import-section gsheet">
          <label htmlFor="gsheet-url">Muat dek dari Google Sheet:</label>
          <div className="input-form">
            <input
              id="gsheet-url"
              type="text"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              placeholder="Tempel URL Web App GSheet..."
            />
            <button onClick={handleFetchCards}>
              Muat
            </button>
          </div>
        </div>

        <div className="gsheet-warning">
          <h3>Peringatan Penting (Google Sheet)</h3>
          <p>Agar fitur "Muat dari GSheet" berfungsi untuk publik (orang lain), mereka wajib:</p>
          <ol>
            <li>Data GSheet harus ada di <strong>Kolom A</strong>.</li>
            <li>Membuat <strong>Apps Script</strong> di Google Sheet mereka.</li>
            <li>Pastikan runtime <strong>V8</strong> aktif di Apps Script.</li>
            <li>Salin kode <code>doGet</code> & <code>doOptions</code> (termasuk <code>.setHeader()</code> untuk CORS) ke script mereka.</li>
            <li><strong>Deploy</strong> sebagai Web App.</li>
            <li>Atur izin "Who has access" ke <strong>"Anyone"</strong>.</li>
            <li>URL Web App hasil deploy adalah yang ditempelkan di atas.</li>
          </ol>
        </div>


        <div className="import-section">
          <label htmlFor="file-upload">Ganti dek dengan Excel (.xlsx):</label>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
          />
        </div>

        <p className='atau'>atau tambahkan satu per satu ke dek:</p>
        
        <form onSubmit={handleAddCard} className="input-form">
          <input
            type="text"
            value={newCard}
            onChange={(e) => setNewCard(e.target.value)}
            placeholder="Masukkan keterangan kartu..."
          />
          <button type="submit">Tambah Kartu</button>
        </form>

        <div className="deck-container">
          <div className={`deck ${isShuffling ? 'shuffling' : ''} ${availableCards.length === 0 ? 'empty' : ''}`}>
            <div className="card-placeholder"></div>
            <div className="card-placeholder"></div>
            <div className="card-placeholder"></div>
          </div>
          
          <button 
            onClick={handleDrawCard} 
            disabled={isShuffling || availableCards.length === 0 || isLoading}
            className="draw-button"
          >
            {isShuffling ? 'Mengocok...' : 'Ambil Kartu!'}
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-popup" onClick={closePopup}>&times;</button>
            <h2>Kartu Terpilih:</h2>
            <p className="drawn-card-text">{currentCard}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
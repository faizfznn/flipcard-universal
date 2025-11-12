// Impor yang diperlukan (XLSX kembali aktif)
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as XLSX from 'xlsx'; 
import './App.css'; 

// HAPUS: const GOOGLE_SCRIPT_URL

function App() {
  // --- STATE ---
  const [masterList, setMasterList] = useState([]);
  const [drawnCards, setDrawnCards] = useState([]);
  const [newCard, setNewCard] = useState(''); 
  const [currentCard, setCurrentCard] = useState(null); 
  const [isShuffling, setIsShuffling] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  
  // DIUBAH: Loading di-set false, karena tidak ada auto-load
  const [isLoading, setIsLoading] = useState(false);

  // BARU: State untuk menampung URL GSheet dari input pengguna
  const [sheetUrl, setSheetUrl] = useState('');

  // --- DERIVED STATE ---
  // (Tidak berubah)
  const availableCards = useMemo(() => {
    return masterList.filter(card => !drawnCards.includes(card));
  }, [masterList, drawnCards]);

  // --- FUNGSI ---

  // FUNGSI 1: Fetch dari GSheet (Sekarang dinamis & manual)
  const handleFetchCards = () => {
    if (!sheetUrl.trim()) {
      alert('Silakan masukkan URL Google Sheet Web App Anda.');
      return;
    }

    setIsLoading(true);
    // Ambil URL dari state
    fetch(sheetUrl)
      .then(res => res.json())
      .then(data => {
        if (data.status === "success" && data.cards) {
          // Ini adalah Hard Reset
          setMasterList(data.cards); 
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

  // HAPUS: useEffect(() => { fetchCards() }, [fetchCards]);

  // FUNGSI 2: Tambah manual (Tidak berubah)
  const handleAddCard = (e) => {
    e.preventDefault(); 
    if (newCard.trim() !== '') {
      setMasterList(prevMaster => [...prevMaster, newCard]);
      setNewCard(''); 
    }
  };

  // FUNGSI 3: Upload Excel (Tidak berubah)
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

  // FUNGSI 4: Ambil Kartu (Tidak berubah)
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

  // FUNGSI 5: Tutup popup (Tidak berubah)
  const closePopup = () => {
    setShowPopup(false);
    setTimeout(() => setCurrentCard(null), 300);
  };

  // --- TAMPILAN JSX (Gabungan) ---
  return (
    <div className="App">
      <div className="container">
        {/* HAPUS: img logoBem */}
        
        {/* DIUBAH: Judul menjadi universal */}
        <h1>Web Kartu Acak</h1>

        {isLoading ? (
          <p className="loading-text">Memuat kartu...</p>
        ) : (
          <p className="card-count">Tersisa {availableCards.length} kartu di dek.</p>
        )}
        
        {/* BARU: Input GSheet Dinamis */}
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
            {/* Tombol ini menggunakan style .input-form button */}
            <button onClick={handleFetchCards}>
              Muat
            </button>
          </div>
        </div>

        {/* DIKEMBALIKAN: Bagian Excel */}
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
        
        {/* DIKEMBALIKAN: Bagian Manual */}
        <form onSubmit={handleAddCard} className="input-form">
          <input
            type="text"
            value={newCard}
            onChange={(e) => setNewCard(e.target.value)}
            placeholder="Masukkan keterangan kartu..."
          />
          <button type="submit">Tambah Kartu</button>
        </form>

        {/* Dek dan Tombol (Tidak berubah) */}
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

      {/* Popup Modal (Tidak berubah) */}
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
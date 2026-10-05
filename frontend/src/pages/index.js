import { useState, useEffect } from 'react';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletName, setWalletName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [kitInstance, setKitInstance] = useState(null);
  const [kitModules, setKitModules] = useState(null);

  // Memuat library dompet secara dinamis di sisi klien
  useEffect(() => {
    import("@creit.tech/stellar-wallets-kit").then((module) => {
      const { StellarWalletsKit, WalletNetwork, ALBEDO_ID, FREIGHTER_ID, RUMI_ID, XBULL_ID } = module;
      
      const kit = new StellarWalletsKit({
        network: WalletNetwork.TESTNET,
        wallets: [
          FREIGHTER_ID,
          XBULL_ID,
          RUMI_ID,
          ALBEDO_ID
        ]
      });
      setKitInstance(kit);
      setKitModules(module);
    });
  }, []);

  // Fungsi untuk memicu koneksi berdasarkan dompet yang dipilih secara visual
  async function connectWalletById(walletId) {
    if (!kitInstance) return;
    setLoading(true);
    setShowCustomModal(false);
    
    try {
      // Membuka koneksi langsung ke ID dompet pilihan tanpa memanggil modal bawaan library
      const connection = await kitInstance.connect(walletId);
      if (connection && connection.address) {
        setWalletAddress(connection.address);
        setWalletName(walletId);
      }
    } catch (error) {
      console.error("Gagal terhubung ke dompet:", error);
      alert("Koneksi dibatalkan atau pastikan ekstensi dompet Anda sudah terbuka.");
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif', backgroundColor: '#121212', color: '#fff', minHeight: '100vh', position: 'relative' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ color: '#00e676', fontSize: '2.8rem', margin: '0 0 10px 0' }}>🚀 StellarLaunch</h1>
        <p style={{ color: '#aaa', fontSize: '1.2rem', margin: 0 }}>Platform Multi-Wallet Fair Launch di Jaringan Stellar</p>
      </header>
      
      <div style={{ margin: '40px 0' }}>
        {walletAddress ? (
          <div style={{ padding: '20px 30px', backgroundColor: '#1e1e1e', border: '1px solid #00e676', borderRadius: '12px', display: 'inline-block', textAlign: 'left' }}>
            <p style={{ margin: '0 0 8px 0', color: '#00e676', fontWeight: 'bold' }}>
              ✓ Terhubung via <span style={{ textTransform: 'uppercase', backgroundColor: '#333', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{walletName}</span>
            </p>
            <small style={{ fontFamily: 'monospace', fontSize: '15px', color: '#fff', wordBreak: 'break-all' }}>
              {walletAddress}
            </small>
          </div>
        ) : (
          <button 
            onClick={() => setShowCustomModal(true)}
            disabled={loading}
            style={{ 
              padding: '16px 32px', 
              cursor: 'pointer', 
              fontSize: '18px', 
              fontWeight: 'bold',
              backgroundColor: '#00e676',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 6px 20px rgba(0,230,118,0.3)'
            }}
          >
            {loading ? "Memproses..." : "Connect Wallet Kit"}
          </button>
        )}
      </div>

      {/* MODAL KUSTOM YANG DIJAMIN MUNCUL & INDAH (TANPA FILE CSS EKSTERNAL) */}
      {showCustomModal && kitModules && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#1e1e1e', padding: '30px', borderRadius: '16px', border: '1px solid #333', width: '340px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '1.4rem' }}>Connect Wallet</h3>
            <p style={{ color: '#888', fontSize: '0.9rem', margin: '0 0 20px 0' }}>Powered by Stellar Wallets Kit</p>
            
            {/* Opsi 1: Freighter */}
            <button 
              onClick={() => connectWalletById(kitModules.FREIGHTER_ID)}
              style={{ width: '100%', padding: '14px', marginBottom: '12px', backgroundColor: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>🛸 Freighter Wallet</span>
              <span style={{ fontSize: '10px', color: '#00e676', backgroundColor: '#111', padding: '2px 6px', borderRadius: '4px' }}>INSTALLED</span>
            </button>

            {/* Opsi 2: xBull */}
            <button 
              onClick={() => connectWalletById(kitModules.XBULL_ID)}
              style={{ width: '100%', padding: '14px', marginBottom: '12px', backgroundColor: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', textAlign: 'left' }}
            >
              🐂 xBull Wallet
            </button>

            {/* Opsi 3: Albedo */}
            <button 
              onClick={() => connectWalletById(kitModules.ALBEDO_ID)}
              style={{ width: '100%', padding: '14px', marginBottom: '20px', backgroundColor: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', textAlign: 'left' }}
            >
              🌌 Albedo Wallet
            </button>

            {/* Tombol Tutup */}
            <button 
              onClick={() => setShowCustomModal(false)}
              style={{ backgroundColor: 'transparent', color: '#aaa', border: 'none', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }}
            >
              Kembali
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

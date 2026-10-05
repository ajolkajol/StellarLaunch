import { useState, useEffect } from 'react';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletName, setWalletName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [freighterApi, setFreighterApi] = useState(null);

  // Membaca ketersediaan ekstensi secara aman di browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      setFreighterApi(window.freighterApi);
    }
  }, []);

  async function connectViaFreighter() {
    setLoading(true);
    setShowCustomModal(false);
    try {
      if (!window.freighterApi) {
        alert("Freighter Wallet tidak ditemukan! Silakan pasang ekensinya di browser Chrome Anda.");
        setLoading(false);
        return;
      }

      const connected = await window.freighterApi.isConnected();
      if (!connected) {
        alert("Dompet terdeteksi tetapi sedang terkunci. Silakan buka kunci Freighter Anda.");
        setLoading(false);
        return;
      }

      // Meminta izin akses alamat publik
      const allowedPublicKey = await window.freighterApi.requestAccess();
      if (allowedPublicKey) {
        setWalletAddress(allowedPublicKey);
        setWalletName("Freighter");
      } else {
        alert("Koneksi ditolak oleh pengguna.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menghubungkan ke Freighter.");
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif', backgroundColor: '#121212', color: '#fff', minHeight: '100vh', position: 'relative' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ color: '#00e676', fontSize: '2.8rem', margin: '0 0 10px 0' }}>🚀 StellarLaunch</h1>
        <p style={{ color: '#aaa', fontSize: '1.2rem' }}>Platform Fair Launch Multi-Wallet di Jaringan Stellar</p>
      </header>
      
      <div style={{ margin: '40px 0' }}>
        {walletAddress ? (
          <div style={{ padding: '20px 30px', backgroundColor: '#1e1e1e', border: '1px solid #00e676', borderRadius: '12px', display: 'inline-block' }}>
            <p style={{ margin: '0 0 8px 0', color: '#00e676', fontWeight: 'bold' }}>
              ✓ Terhubung via {walletName}
            </p>
            <small style={{ fontFamily: 'monospace', fontSize: '15px', color: '#fff' }}>{walletAddress}</small>
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
            {loading ? "Memproses..." : "Connect Wallet"}
          </button>
        )}
      </div>

      {/* TAMPILAN JENDELA POPUP MODAL CUSTOM (SEKARANG DIJAMIN KELIHATAN) */}
      {showCustomModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#1e1e1e', padding: '30px', borderRadius: '12px', border: '1px solid #333', width: '320px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#fff' }}>Pilih Dompet Stellar</h3>
            
            {/* Tombol Pilihan Dompet 1: Freighter */}
            <button 
              onClick={connectViaFreighter}
              style={{ width: '100%', padding: '12px', marginBottom: '12px', backgroundColor: '#333', color: '#fff', border: '1px solid #444', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>🛸 Freighter Wallet</span>
              <span style={{ fontSize: '11px', color: '#00e676', backgroundColor: '#111', padding: '2px 6px', borderRadius: '4px' }}>POPULAR</span>
            </button>

            {/* Tombol Pilihan Dompet 2: Rumi / Albedo Tiruan */}
            <button 
              onClick={() => alert("Integrasi Rumi Wallet memerlukan konfigurasi deeplink tambahan. Gunakan Freighter terlebih dahulu untuk Testnet.")}
              style={{ width: '100%', padding: '12px', marginBottom: '20px', backgroundColor: '#222', color: '#777', border: '1px solid #333', borderRadius: '6px', cursor: 'not-allowed', fontSize: '15px', textAlign: 'left' }}
            >
              🔒 Rumi / Albedo Wallet
            </button>

            {/* Tombol Tutup Jendela */}
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

import { useState, useEffect } from 'react';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiReady, setApiReady] = useState(false);

  // Memastikan browser selesai memuat seluruh ekstensi sebelum tombol bisa digunakan
  useEffect(() => {
    const checkApi = () => {
      if (typeof window !== "undefined" && window.freighterApi) {
        setApiReady(true);
      }
    };
    
    // Cek langsung saat muat halaman
    checkApi();
    
    // Cek ulang dalam hitungan milidetik untuk memberi waktu ekstensi menyuntikkan data
    const interval = setInterval(checkApi, 500);
    return () => clearInterval(interval);
  }, []);

  async function handleConnect() {
    setLoading(true);
    try {
      // Mengambil objek dompet secara dinamis dari browser
      const freighter = typeof window !== "undefined" ? window.freighterApi : null;

      if (!freighter) {
        alert("Menunggu ekstensi dompet Freighter merespons... Silakan klik ikon ekstensi Anda terlebih dahulu lalu klik ulang tombol ini.");
        setLoading(false);
        return;
      }

      // 1. Cek status koneksi dompet
      const isConnected = await freighter.isConnected();
      if (!isConnected) {
        alert("Dompet Freighter terdeteksi tetapi statusnya sedang terkunci. Silakan buka kunci dompet Anda terlebih dahulu.");
        setLoading(false);
        return;
      }

      // 2. Memicu pop-up persetujuan hak akses situs
      const allowedPublicKey = await freighter.requestAccess();
      
      if (allowedPublicKey) {
        setWalletAddress(allowedPublicKey);
      } else {
        alert("Akses koneksi dompet ditolak oleh pengguna.");
      }

    } catch (error) {
      console.error("Detail Error:", error);
      alert("Terjadi masalah saat berkomunikasi dengan Freighter Wallet.");
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif', backgroundColor: '#1a1a1a', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ color: '#00e676', fontSize: '2.5rem', marginBottom: '10px' }}>🚀 StellarLaunch</h1>
      <p style={{ color: '#aaa', fontSize: '1.1rem' }}>Platform Meluncurkan Token Secara Adil (Fair Launch) di Jaringan Stellar</p>
      
      <div style={{ margin: '40px 0' }}>
        {walletAddress ? (
          <div style={{ padding: '15px 25px', backgroundColor: '#2a2a2a', border: '1px solid #333', borderRadius: '8px', display: 'inline-block' }}>
            <p style={{ margin: '0 0 5px 0', color: '#00e676', fontWeight: 'bold' }}>✓ Terhubung</p>
            <small style={{ fontFamily: 'monospace', fontSize: '14px', color: '#00e676' }}>Address: {walletAddress}</small>
          </div>
        ) : (
          <button 
            onClick={handleConnect}
            disabled={loading}
            style={{ 
              padding: '14px 28px', 
              cursor: 'pointer', 
              fontSize: '16px', 
              fontWeight: 'bold',
              backgroundColor: apiReady ? '#00e676' : '#555',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              boxShadow: apiReady ? '0 4px 15px rgba(0,230,118,0.3)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? "Menghubungkan ke Dompet..." : "Connect Freighter Wallet"}
          </button>
        )}
      </div>
    </div>
  );
}

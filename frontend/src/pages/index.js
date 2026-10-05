import { useState } from 'react';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleConnect() {
    setLoading(true);
    try {
      // 1. Cek apakah objek window dan ekstensi Freighter tersedia secara global
      if (typeof window === "undefined" || !window.freighterApi) {
        alert("Freighter Wallet tidak terdeteksi! Silakan pasang/aktifkan ekstensi Freighter di browser komputer Anda.");
        setLoading(false);
        return;
      }

      // 2. Cek apakah dompet terhubung/aktif
      const isConnected = await window.freighterApi.isConnected();
      if (!isConnected) {
        alert("Freighter Wallet terpasang namun statusnya belum siap.");
        setLoading(false);
        return;
      }

      // 3. Paksa meminta izin akses alamat public key (Memicu popup persetujuan)
      const allowedPublicKey = await window.freighterApi.requestAccess();
      
      if (allowedPublicKey) {
        setWalletAddress(allowedPublicKey);
      } else {
        alert("Akses ke dompet ditolak oleh pengguna.");
      }

    } catch (error) {
      console.error("Detail Error:", error);
      alert("Gagal terhubung: Pastikan ekstensi Freighter Anda sudah dimasukkan password (unlocked).");
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
            <p style={{ margin: '0 0 5px 0', color: '#00e676', fontWeight: 'bold' }}>✓ Terhubung ke Ekstensi</p>
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
              backgroundColor: '#00e676',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              boxShadow: '0 4px 15px rgba(0,230,118,0.3)'
            }}
          >
            {loading ? "Membuka Jendela Dompet..." : "Connect Freighter Wallet"}
          </button>
        )}
      </div>
    </div>
  );
}

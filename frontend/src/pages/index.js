import { useState } from 'react';
import { isConnected, getPublicKey } from "@stellar/freighter-api";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleConnect() {
    setLoading(true);
    try {
      // 1. Cek apakah ekstensi Freighter sudah terinstall di browser
      const connected = await isConnected();
      
      if (!connected) {
        alert("Freighter Wallet tidak ditemukan! Silakan install ekstensi dompet Freighter di browser Anda terlebih dahulu.");
        setLoading(false);
        return;
      }

      // 2. Memicu popup Freighter untuk mengambil alamat public key user
      const publicKey = await getPublicKey();
      setWalletAddress(publicKey);
      
    } catch (error) {
      console.error("Gagal terhubung ke wallet:", error);
      alert("Pengguna membatalkan koneksi atau terjadi kesalahan.");
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif', backgroundColor: '#1a1a1a', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ color: '#00e676' }}>🚀 StellarLaunch</h1>
      <p>Platform Meluncurkan Token Secara Adil (Fair Launch) di Jaringan Stellar</p>
      
      <div style={{ margin: '30px 0' }}>
        {walletAddress ? (
          <div style={{ padding: '10px', backgroundColor: '#333', borderRadius: '5px', display: 'inline-block' }}>
            <p style={{ margin: 0, color: '#00e676' }}>✓ Terhubung</p>
            <small style={{ fontFamily: 'monospace' }}>Address: {walletAddress}</small>
          </div>
        ) : (
          <button 
            onClick={handleConnect}
            disabled={loading}
            style={{ 
              padding: '12px 24px', 
              cursor: 'pointer', 
              fontSize: '16px', 
              fontWeight: 'bold',
              backgroundColor: '#00e676',
              color: '#000',
              border: 'none',
              borderRadius: '5px',
              boxShadow: '0 4px 6px rgba(0,230,118,0.2)'
            }}
          >
            {loading ? "Menghubungkan..." : "Connect Freighter Wallet"}
          </button>
        )}
      </div>
    </div>
  );
}

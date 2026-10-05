import { useState } from 'react';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleDirectConnect() {
    setLoading(true);
    try {
      // Mengambil objek API langsung secara paksa dari memori browser
      const freighter = typeof window !== "undefined" ? window.freighterApi : null;

      if (!freighter) {
        alert("Freighter tidak merespons. Pastikan dompet Anda menampilkan halaman saldo (bukan halaman settings/network), lalu refresh halaman web ini.");
        setLoading(false);
        return;
      }

      // Cek apakah ekstensi aktif
      const active = await freighter.isConnected();
      if (!active) {
        alert("Dompet terdeteksi tetapi terkunci. Silakan masukkan password dompet Anda terlebih dahulu.");
        setLoading(false);
        return;
      }

      // Ambil public key secara langsung (Memicu pop-up persetujuan resmi)
      const publicKey = await freighter.requestAccess();
      if (publicKey) {
        setWalletAddress(publicKey);
      } else {
        alert("Koneksi dompet ditolak.");
      }

    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem saat membaca ekstensi dompet.");
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif', backgroundColor: '#121212', color: '#fff', minHeight: '100vh' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ color: '#00e676', fontSize: '2.8rem', margin: '0 0 10px 0' }}>🚀 StellarLaunch</h1>
        <p style={{ color: '#aaa', fontSize: '1.2rem' }}>Platform Fair Launch di Jaringan Stellar</p>
      </header>
      
      <div style={{ margin: '40px 0' }}>
        {walletAddress ? (
          <div style={{ padding: '20px 30px', backgroundColor: '#1e1e1e', border: '1px solid #00e676', borderRadius: '12px', display: 'inline-block' }}>
            <p style={{ margin: '0 0 8px 0', color: '#00e676', fontWeight: 'bold' }}>✓ Dompet Sukses Terhubung</p>
            <small style={{ fontFamily: 'monospace', fontSize: '15px', color: '#fff', wordBreak: 'break-all' }}>{walletAddress}</small>
          </div>
        ) : (
          <button 
            onClick={handleDirectConnect}
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
            {loading ? "Menghubungkan Langsung..." : "Connect Freighter Wallet"}
          </button>
        )}
      </div>
    </div>
  );
}

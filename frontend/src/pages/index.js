import { useState, useEffect } from 'react';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [isExtensionAvailable, setIsExtensionAvailable] = useState(false);

  // Deteksi kehadiran objek Freighter secara berkala agar sinkron dengan browser
  useEffect(() => {
    const checkExtension = () => {
      if (typeof window !== "undefined" && (window.freighterApi || window.stargazer || typeof window.StellarSdk !== 'undefined')) {
        setIsExtensionAvailable(true);
      }
    };

    checkExtension();
    const interval = setInterval(checkExtension, 1000);
    return () => clearInterval(interval);
  }, []);

  async function connectViaFreighter() {
    setLoading(true);
    try {
      // Mengambil objek API secara dinamis langsung saat tombol diklik
      const targetApi = typeof window !== "undefined" ? window.freighterApi : null;

      if (!targetApi) {
        alert("Freighter Wallet belum siap disuntikkan oleh browser. Silakan klik ikon dompet Anda di pojok kanan atas sekali, lalu klik ulang tombol ini.");
        setLoading(false);
        return;
      }

      // Memaksa permintaan akses (Memicu pop-up persetujuan dari ekstensi)
      const allowedPublicKey = await targetApi.requestAccess();
      
      if (allowedPublicKey) {
        setWalletAddress(allowedPublicKey);
        setShowCustomModal(false);
      } else {
        alert("Koneksi dompet dibatalkan atau ditolak.");
      }
    } catch (error) {
      console.error("Detail Error:", error);
      alert("Gagal terhubung: Pastikan dompet sudah dibuka kunci.");
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
            <p style={{ margin: '0 0 8px 0', color: '#00e676', fontWeight: 'bold' }}>✓ Dompet Terhubung</p>
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

      {/* JENDELA POPUP PILIHAN DOMPET */}
      {showCustomModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#1e1e1e', padding: '30px', borderRadius: '12px', border: '1px solid #333', width: '320px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#fff' }}>Pilih Dompet Stellar</h3>
            
            <button 
              onClick={connectViaFreighter}
              style={{ width: '100%', padding: '12px', marginBottom: '15px', backgroundColor: '#333', color: '#fff', border: '1px solid #444', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>🛸 Freighter Wallet</span>
              <span style={{ fontSize: '10px', color: '#00e676', backgroundColor: '#111', padding: '2px 6px', borderRadius: '4px' }}>ONLINE</span>
            </button>

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

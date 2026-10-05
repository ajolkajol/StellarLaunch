import { useState, useEffect } from 'react';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletName, setWalletName] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [walletKit, setWalletKit] = useState(null);
  const [availableWallets, setAvailableWallets] = useState([]);

  useEffect(() => {
    // Memuat secara dinamis agar aman dari kompilasi SSR Vercel
    import("@creit.tech/stellar-wallets-kit").then((module) => {
      const { WalletKit, WalletNetwork, AllWallets } = module;
      
      // Inisialisasi menggunakan class WalletKit versi terbaru (2.5.0)
      const kitInstance = new WalletKit({
        network: WalletNetwork.TESTNET,
        wallets: AllWallets // Mengaktifkan semua daftar dompet yang didukung ekosistem
      });
      
      setWalletKit(kitInstance);
      setAvailableWallets(AllWallets);
    }).catch(err => console.error("Gagal memuat modul kit:", err));
  }, []);

  async function connectWallet(walletId) {
    if (!walletKit) return;
    setLoading(true);
    setModalOpen(false);
    try {
      // 1. Pilih target ID dompet menggunakan fungsi bawaan versi 2.5.0
      walletKit.setWallet(walletId);
      
      // 2. Ambil kunci publik alamat akun user
      const publicKey = await walletKit.getPublicKey();
      
      if (publicKey) {
        setWalletAddress(publicKey);
        setWalletName(walletId);
      }
    } catch (error) {
      console.error("Koneksi gagal atau ditolak:", error);
      alert("Gagal Terhubung: Pastikan dompet Anda tidak sedang membuka tab settings.");
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#0c0f12', color: '#ecefe7', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* HEADER TAMPILAN STELLAR LAB */}
      <div style={{ borderBottom: '1px solid #1c232b', width: '100%', maxWidth: '800px', paddingBottom: '20px', marginBottom: '30px', textAlign: 'left' }}>
        <h2 style={{ margin: 0, color: '#3fe88b', fontSize: '1.8rem' }}>StellarLaunch — Laboratory v2.5 Setup</h2>
        <p style={{ margin: '5px 0 0 0', color: '#7a8c9e', fontSize: '0.95rem' }}>Bypass validation tool sync with official repository package</p>
      </div>

      {/* INDIKATOR KONEKSI */}
      <div style={{ backgroundColor: '#131920', border: '1px solid #1c232b', borderRadius: '8px', padding: '30px', width: '100%', maxWidth: '500px', textAlign: 'center' }}>
        {walletAddress ? (
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <span style={{ color: '#3fe88b', fontWeight: 'bold', fontSize: '0.9rem' }}>● STATUS: CONNECTED</span>
              <span style={{ fontSize: '11px', backgroundColor: '#1c232b', padding: '3px 8px', borderRadius: '4px', color: '#7a8c9e' }}>{walletName.toUpperCase()}</span>
            </div>
            <label style={{ fontSize: '0.8rem', color: '#7a8c9e', display: 'block', marginBottom: '5px' }}>PUBLIC KEY (ACCOUNT ID)</label>
            <div style={{ backgroundColor: '#0c0f12', padding: '12px', borderRadius: '4px', border: '1px solid #1c232b', fontFamily: 'monospace', fontSize: '13px', wordBreak: 'break-all', color: '#ecefe7' }}>
              {walletAddress}
            </div>
          </div>
        ) : (
          <div>
            <p style={{ margin: '0 0 20px 0', color: '#7a8c9e', fontSize: '0.95rem' }}>Klik tombol di bawah untuk membuka popup pilihan wallet ekosistem Stellar.</p>
            <button 
              onClick={() => setModalOpen(true)}
              disabled={loading}
              style={{ width: '100%', padding: '14px', backgroundColor: '#3fe88b', color: '#0c0f12', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '15px', letterSpacing: '0.5px' }}
            >
              {loading ? "CONNECTING..." : "CONNECT WALLET KIT"}
            </button>
          </div>
        )}
      </div>

      {/* POPUP MODAL PILIHAN DOMPET */}
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#131920', border: '1px solid #2e3947', borderRadius: '8px', width: '360px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #1c232b', paddingBottom: '10px' }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#ecefe7' }}>Connect Wallet</h4>
              <span onClick={() => setModalOpen(false)} style={{ cursor: 'pointer', color: '#7a8c9e', fontSize: '18px', fontWeight: 'bold' }}>&times;</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {availableWallets.map((wallet) => (
                <button 
                  key={wallet.id}
                  onClick={() => connectWallet(wallet.id)} 
                  style={{ width: '100%', padding: '12px', textAlign: 'left', backgroundColor: '#1c232b', color: '#ecefe7', border: '1px solid #2e3947', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>{wallet.name}</span>
                  <span style={{ color: '#3fe88b', fontSize: '10px' }}>READY</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

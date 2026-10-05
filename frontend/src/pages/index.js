import { useState, useEffect } from 'react';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletName, setWalletName] = useState("");
  const [loading, setLoading] = useState(false);
  const [kit, setKit] = useState(null);

  useEffect(() => {
    // Memuat modul secara dinamis di sisi client agar tidak crash saat build Vercel
    import("@creit.tech/stellar-wallets-kit").then((module) => {
      const { StellarWalletsKit, WalletNetwork, ALBEDO_ID, FREIGHTER_ID, RUMI_ID, XBULL_ID } = module;
      
      // Mengimpor file desain CSS resmi bawaan kit agar popup langsung muncul & kelihatan di layar
      import("@creit.tech/stellar-wallets-kit/styles/index.css").catch((err) => console.log("CSS Load: ", err));

      const walletKit = new StellarWalletsKit({
        network: WalletNetwork.TESTNET,
        wallets: [
          FREIGHTER_ID,
          XBULL_ID,
          RUMI_ID,
          ALBEDO_ID
        ]
      });
      setKit(walletKit);
    });
  }, []);

  async function handleConnectKit() {
    if (!kit) {
      alert("Menyiapkan modul multi-wallet, silakan klik kembali dalam 2 detik.");
      return;
    }

    setLoading(true);
    try {
      // Membuka modal pop-up pilihan dompet persis seperti di website Stellar Lab
      await kit.openModal({
        onConnect: (connection) => {
          setWalletAddress(connection.address);
          setWalletName(connection.id);
          console.log("Sukses masuk menggunakan:", connection.id);
        },
        onClose: () => {
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Gagal interaksi wallet:", error);
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif', backgroundColor: '#121212', color: '#fff', minHeight: '100vh' }}>
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
            onClick={handleConnectKit}
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
            {loading ? "Membuka Menu Dompet..." : "Connect Wallet Kit"}
          </button>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
// import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
// import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { PublicKey, SystemProgram, Transaction, TransactionInstruction, TransactionSignature } from "@solana/web3.js";
import axios from 'axios';
import Cookies from 'js-cookie';
// import { useNavigate } from 'react-router-dom';

function Wallet({ donationAmount, customAmount, type, plan, tmdbId }) {
  const userId = Cookies.get('userId');
  // console.log(userId, type);

  const [txId, setTxId] = useState('');
  // get a connection
  const { connection } = useConnection();
  // use the hook in your component
  const { connected, sendTransaction, publicKey } = useWallet();
  // console.log(wallet, publicKey, connection);
  // const { sendTransaction } = useWallet();

  // const navigate = useNavigate();

  const LAMPORTS_PER_SOL = 1000000000;

  // const baseURL = "https://mateys.xyz/web_api/";

  const handleDonation = (donationAmount, customAmount) => {
    // Perform any logic here based on donationAmount and customAmount
    // For example, calculate lamports
    const lamports = Math.floor((donationAmount || customAmount) * LAMPORTS_PER_SOL);

    // Return the result or perform other actions
    return lamports;
  };

  const lamports = handleDonation(donationAmount, customAmount);

  // const publicKey = "C79zVCxaueBqMdGyH8pSEWQoVagGbzNcnNUK63YHjhzS";
  //   const connected = true;

  // console.log(lamports, donationAmount, customAmount, type, plan);

  const sendSolana = async () => {
    if (!connected) {
      // Prompt the user to connect their wallet
      // or provide a UI indicating that the wallet is not connected.
      alert("Wallet not connected. Please connect your wallet before sending a transaction.");
      return;
    }

    // "F9rXiSZgBuU3iAG6ftfWRGUDucKY38PxBfNpAWNGec1T"

    const toPublicKey = new PublicKey("C5yrAUHXwpguBibfYYnLAoiX2Tz9uv9tgyjewRgrenD4");

    // const signature = await connection.requestAirdrop(toPublicKey, LAMPORTS_PER_SOL);

    // const transaction = new Transaction();
    
    // const latestBlockhash = await connection.getLatestBlockhash();
    // transaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;
    // transaction.recentBlockhash = latestBlockhash.blockhash;

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: toPublicKey,
        lamports: lamports
      })
    );
    // const latestBlockhash = await connection.getLatestBlockhash();
    // transaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;
    // transaction.recentBlockhash = latestBlockhash.blockhash;
    // console.log(transaction, connection, txId);

    try {
      // and then send the transaction:
      const signature = await sendTransaction(transaction, connection);

      // const hash = await sendTransaction(transaction, connection, new PublicKey(publicKey));
      // console.log(hash);

      if (signature) {
        // const hash = await sendTransaction(transaction, connection, new PublicKey(publicKey));
        // console.log(hash);
        const hash = await connection.confirmTransaction(signature, "processed");

        setTxId(hash);

        // console.log(hash);

        const amt = donationAmount || customAmount;

        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('hash', hash);
        formData.append('amount', amt);
        formData.append('tmdbId', tmdbId);
        // formData.append('date', new Date().toLocaleDateString());

        const response = await axios.post('https://mateys.xyz/web_api/insert_sol.php', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Set the content type for FormData
          },
          maxBodyLength: Infinity,
        });

        // console.log(JSON.stringify(response.data));
        alert("Solana sent successfully!");
        window.location = "/v1/home3";
      }
      else {
        alert("Failed to send Solana!");
        // navigate(-1);
        window.location = "/v1/home3";
      }
    }
    catch (error) {
      // console.log("Error sending Solana: ");
      // console.log(error.message);
      if (error.message === 'Unexpected error') {
        alert("Failed to send Solana: Insufficient Balance");
      }
      else {
        alert("Failed to send Solana: " + error.message);
      }
      // navigate(-1);
      window.location = "/v1/home3";
    }
  };

  if (type == 'premium') {
    // console.log("you are premium");

    async function getData() {
      if (!connected) {
        // Prompt the user to connect their wallet
        // or provide a UI indicating that the wallet is not connected.
        alert("Wallet not connected. Please connect your wallet before sending a transaction.");
        return;
      }

      // "F9rXiSZgBuU3iAG6ftfWRGUDucKY38PxBfNpAWNGec1T"
      const toPublicKey = new PublicKey("C5yrAUHXwpguBibfYYnLAoiX2Tz9uv9tgyjewRgrenD4");
      // const signature = await connection.requestAirdrop(toPublicKey, LAMPORTS_PER_SOL);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: toPublicKey,
          lamports: lamports
        })
      );

      try {
        // and then send the transaction:
        // const hash = await sendTransaction(transaction, connection, new PublicKey(publicKey));
        // console.log(hash);

        const signature = await sendTransaction(transaction, connection);

        if (signature) {
          const hash = await connection.confirmTransaction(signature, "processed");

          setTxId(hash);
          // console.log(hash);

          const formData = new FormData();
          formData.append('id', userId);
          formData.append('planId', plan);

          const response = await axios.post('https://mateys.xyz/web_api/update_user.php', formData, {
            headers: {
              'Content-Type': 'multipart/form-data', // Set the content type for FormData
            },
            maxBodyLength: Infinity,
          });

          // console.log(response.data);
          alert("Solana sent successfully!");
          window.location = "/v1/home3";
        }
        else {
          alert("Failed to send Solana!");
          // navigate(-1);
          window.location = "/v1/home3";
        }
      }
      catch (error) {
        // console.error("Error sending Solana:", error);
        alert("Failed to send Solana: " + error.message);
        window.location = "/v1/home3";
      }
    }

    getData();
  }

  return (
    <div>
    {type == 'donation' ? (
      <>
      {donationAmount || customAmount ? (
        <>
          <button 
            className="bg-dark mb-2" 
            disabled={!publicKey} 
            onClick={sendSolana}
            style={{
              background: 'black',
              padding: '15px 30px',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '20px',
              color: 'white',
              boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2), 0 3px 6px rgba(0, 0, 0, 0.15)'
            }}
          >
              Send transaction
          </button>
          {txId && <p>The transaction hash is {txId}</p>}
        </>
      ) : (
        <p className="mt-2 text-white">Select some amount to Continue...</p>
      )}
      </>
    ): (
      <div 
        className="text-white text-center" 
        style={{ marginTop: '50px' }}
      >
        <p>
          Do not close this notice, refresh, or leave this page.<br /><br /> 
          Your payment of {donationAmount} SOL is now charging.<br /><br />
          Please Wait...
        </p>
        <div className="spinner"></div>
      </div>
    )}
    </div>
  );
}

export default Wallet;
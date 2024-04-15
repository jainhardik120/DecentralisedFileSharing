import './App.css';
import { useState, useEffect } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import Web3Modal from "web3modal";
import FileUpload from './components/FileUpload';
import Display from './components/Display';
import Drive from "./artifacts/contracts/Drive.sol/Drive.json"

function App() {
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);

  const CONTRACT_ADDRESS = "0x4De435cc8Ad7CEeFf4b6560051C011D0a39cd8a9"
  // const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

  const contract = new Contract(CONTRACT_ADDRESS, Drive.abi, signer);
  useEffect(() => {
    const web3modal = new Web3Modal();
    if (web3modal.cachedProvider) connectWallet();
    window.ethereum.on("accountsChanged", connectWallet);
  }, []);

  const connectWallet = async () => {
    try {
      const web3modal = new Web3Modal({ cacheProvider: true });
      const instance = await web3modal.connect();
      const provider = new BrowserProvider(instance);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setSigner(signer);
      setAddress(address);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <div className="App">
        <h1 style={{ color: "white" }}>Gdrive 5.0</h1>
        <div className="bg"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>
        <p style={{ color: "white" }}>Account: {address ? address : "Please connect Metamask"}</p>
        {/* TO upload a file, you need the account and provider=> pass them as props */}
        <FileUpload account={address} contract={contract} ></FileUpload>
        <Display account={address} contract={contract} ></Display>
      </div>
    </>
  );
}

export default App;

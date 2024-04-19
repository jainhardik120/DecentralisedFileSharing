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

  const [isActive, setIsActive] = useState(false);

  const toggleState = () => {
    setIsActive(!isActive);
  };

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
        <nav>
          <input type="checkbox" id="sidebar-active" />
          <label htmlFor="sidebar-active" className='open-sidebar-button'>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg>
          </label>
          <label id="overlay" htmlFor="sidebar-active">
          </label>
          <div className="links-container">
            <label htmlFor="sidebar-active"
              className='close-sidebar-button'>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
            </label>
            <a className="home-link" href="/">DxDrive2.0</a>
            <p>
              {address ? address : "Connect Wallet"}
            </p>
            <a href="/">Github</a>
            <a href="/">Social</a>
            <a href="/">Help</a>
          </div>
        </nav>
        {isActive && (
          <FileUpload account={address} contract={contract} onClose={toggleState} ></FileUpload>
        )}
        <Display account={address} contract={contract} ></Display>
        <div className={`floating-action-button ${isActive ? 'active' : ''}`} onClick={toggleState}>
          <span className="icon">+</span>
        </div>
      </div>
    </>
  );
}

export default App;

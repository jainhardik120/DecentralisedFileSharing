import './App.css';
import { useState, useEffect } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import Web3Modal from "web3modal";
import FileUpload from './components/FileUpload';
import Display from './components/Display';
import Drive from "./artifacts/contracts/Drive.sol/Drive.json"
import Navbar from './components/Navbar';
import Help from './components/Help';


function App() {
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);

  const CONTRACT_ADDRESS = "0x3386ac1Cc99CDAB80C31b634c42A1d378aF5bAcB"

  const contract = new Contract(CONTRACT_ADDRESS, Drive.abi, signer);
  useEffect(() => {
    const web3modal = new Web3Modal();
    if (web3modal.cachedProvider) connectWallet();
    window.ethereum.on("accountsChanged", connectWallet);
  }, []);

  const [isActive, setIsActive] = useState(false);
  const [activeLink, setactiveLink] = useState(false);
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
        <Navbar address={address} connect={connectWallet} setactiveLink={setactiveLink} />
        {isActive && (
          <FileUpload account={address} contract={contract} onClose={toggleState} ></FileUpload>
        )}
        {activeLink ? (<Help />) : (<>
          <Display account={address} contract={contract} ></Display>
          <div className={`floating-action-button ${isActive ? 'active' : ''}`} onClick={toggleState}>
            <span className="icon">+</span>
          </div>
        </>
        )}
      </div>
    </>
  );
}

export default App;

import Upload from './artifacts/contracts/Drive.sol/Drive.json';//got the ABI code of the smart contract
import './App.css';
import { useState,useEffect } from 'react';
import {ethers} from 'ethers';
import FileUpload from './components/FileUpload';
import Display from './components/Display';
import Modal from './components/Modal';
function App() {
  const [account,setAccount]=useState("");
  const [contract,setContract]=useState(null);
  const [provider,setProvider]=useState(null);
  const [modalOpen,setModalOpen]=useState(false);
  //runs everytime the the page reloads, creates an instance of that contract to use its functionalities and get signers and accoutn address which will use those functionalities
  useEffect(()=>{
    const provider=new ethers.providers.Web3Provider(window.ethereum);//load provider to call read function in contract
    //check if provider loaded properly
    const loadProvider=async()=>{
      //if provided loaded, then automatically open Metamask to get the account which will be used
      if(provider){
        //what if you sudddenly switch your account or change the blockchain network in metamsk app? For that metamask provides a script to make sure window reloads on such changes
        window.ethereum.on("chainChanged",()=>{
          window.location.reload();
        });
        window.ethereum.on("accountsChanged",()=>{
          window.location.reload();
        });
        //now we need to request the account from metamask
        await provider.send("eth_requestAccounts",[]);
        //now we  get the signer to be able to call write functions in the contract
        const signer=provider.getSigner();
        const address=await signer.getAddress();
        //now you know which account is being used. Set that account to current account
        setAccount(address);
        //to create an instance of the contract you need three things: contaract address, abi,signer/provider
        let contractAddress="0x5FbDB2315678afecb367f032d93F642f64180aa3";//you get this after you have deployed it on hardhat local blockchain
        const contract=new ethers.Contract(contractAddress,Upload.abi,signer);
        console.log(contract)
        setContract(contract);
        setProvider(provider);
      }
      else
      {
        console.error("Metamask Unavailable !");
      }
      };
      provider && loadProvider();
  },[]);
  return (
    <>
    {!modalOpen && (<button className='share' onClick={()=>{setModalOpen(true)}} >Share</button>)}
    {modalOpen &&(<Modal setModalOpen={setModalOpen} contract={contract}/>)}
    <div className="App">
      <h1 style={{color:"white"}}>Gdrive 5.0</h1>
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>
      <p style={{color:"white"}}>Account: {account?account:"Please connect Metamask"}</p>
      {/* TO upload a file, you need the account and provider=> pass them as props */}
      <FileUpload account={account} provider={provider} contract={contract} ></FileUpload>
      <Display account={account} provider={provider} contract={contract} ></Display>
    </div>
    </>
  );
}

export default App;

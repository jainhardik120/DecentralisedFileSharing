import { useEffect, useState } from "react";
import './Display.css';

const Display = ({ account, contract }) => {

  const [myFiles, setMyFiles] = useState(null);
  const [sharedFiles, setSharedFiles] = useState(null);
  const [sharedAccounts, setSharedAccounts] = useState(null);
  const convertData = (dataArray) => {
    const isEmpty = Object.keys(dataArray).length === 0;
    if (isEmpty) {
      return null;
    }
    return dataArray.toString().split(",").map((item, i) => {
      const arr = item.split('$');
      return ({
        url: arr[0],
        name: arr[1]
      })
    })
  }
  async function getData() {
    setMyFiles(convertData(await contract.viewOwnedFiles()));
    setSharedFiles(convertData(await contract.viewSharedFiles()));
  }
  useEffect(() => {
    if (account) {
      getData();
    }
  }, [account, contract]);
  const [accessPopupOpen, setaccessPopupOpen] = useState(false);
  const [transferPopupOpen, setTransferPopupOpen] = useState(false);
  const [accessSelectedFile, setAccessSelectedFile] = useState("");
  useEffect(() => {
    async function getSharedList() {
      const accounts = await contract.viewAccessList(accessSelectedFile);
      if (Object.keys(accounts).length === 0) {
        setSharedAccounts(null);
        return;
      }
      setSharedAccounts(accounts);
    }
    if (accessSelectedFile) {
      getSharedList();
    }
  }, [account, contract, accessSelectedFile]);
  const openPopup = (index) => {
    setAccessSelectedFile(`${myFiles[index].url}$${myFiles[index].name}`);
    setaccessPopupOpen(true);
  }

  const openTransferPopup = (index) => {
    setAccessSelectedFile(`${myFiles[index].url}$${myFiles[index].name}`);
    setTransferPopupOpen(true);
  }

  const [address, setaddress] = useState("");
  const sharing = async () => {
    try {
      if (address.length === 0) {
        throw Error("Error !");
      }
      const transaction = await contract.shareFile(address, accessSelectedFile);
      await transaction.wait();
      alert("Updated Access Settings");
    } catch (error) {
      alert("Please Enter some Address!");
      console.error(error);
    }
  };
  //transfer ownership
  const transfer = async () => {
    try {
      if (address.length === 0) {
        throw Error("Error !");
      }
      const transaction = await contract.transfer(address, accessSelectedFile);
      await transaction.wait();
      alert("File Transferred Successfully");
      getData();
    } catch (error) {
      alert("Please Enter some Address!");
      console.error(error);
    }
  }
  const revokeAccess = async (address) => {
    const transaction = await contract.revokeAccess(address, accessSelectedFile);
    await transaction.wait();
    alert("Updated Access Settings");
  }
  const onChange = (e) => {
    setaddress(e.target.value);
  }
  //download selected file
  function downloadFile(url, name) {
    fetch(url)
    .then(response => response.blob())
    .then(blob => {

      const blobUrl = URL.createObjectURL(blob);


      const link = document.createElement('a');

      link.href = blobUrl;
      link.download = name; 

      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    })
    .catch(error => {
      console.error('Error downloading file:', error);
    });
  }
  return (
    <>
      {accessPopupOpen && <div className="popup-background">
        <div className="popup">
          <button className="close-btn" onClick={() => {
            setaccessPopupOpen(false);
            setAccessSelectedFile("");
          }}>
            X
          </button>
          {sharedAccounts && sharedAccounts.map((item, i) => {
            return (
              <>
                <div style={{marginTop:"10px"}}>
                  <p style={{marginRight:"20px",display:"inline"}}>{item}</p>
                  <button className="upload" onClick={async () => {
                    revokeAccess(item);
                  }}>Revoke Access</button>
                </div>
              </>
            )
          })}
          <div className="share-btn">
            <input type="text" className="address" placeholder='Enter address to share to' value={address} onChange={onChange} />
            <button className="upload" onClick={sharing}>Share</button>
          </div>
        </div>
      </div>}
      {transferPopupOpen && <div className="popup-background">
        <div className="popup">
          <button className="close-btn" onClick={() => {
            setTransferPopupOpen(false);
          }}>X</button>
          <input type="text" className="address" placeholder='Enter address to transfer to' value={address} onChange={onChange} />
          <button className="upload" onClick={transfer}>Transfer</button>
        </div>
      </div>}
      <div className="file-container">
        <p>Your Files:</p>
        {myFiles &&
          myFiles.map((item, i) => {
            return (
              <div key={i} className="file-link">
                <p>{item.name}</p>
                <div className="dropdown">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" /></svg>
                  <div className="dropdown-content">
                    <button onClick={() => {
                      openPopup(i);
                    }}>Modify Access</button>
                    <br />
                    <button onClick={()=>{downloadFile(item.url,item.name)}}>Download</button>
                    <br />
                    <button onClick={() => {
                      openTransferPopup(i);
                    }}>Transfer Ownership</button>
                  </div>
                </div>
              </div>
            );
          })}
        <p>Shared Files:</p>
        {sharedFiles &&
          sharedFiles.map((item, i) => {
            return (
              <div key={i} className="file-link">
                <p href={item.url}>{item.name}</p>
                <svg onClick={()=>{downloadFile(item.url,item.name)}} style={{ marginLeft: "auto" }} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" /></svg>
              </div>
            );
          })}
      </div>

    </>
  );
}
export default Display;
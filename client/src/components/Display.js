import { useEffect, useState } from "react";
import './Display.css';

const NoFiles = () => {
  return (
    <>
      <div style={{"textAlign" :"center"}}>
        
        <svg width="150px" height="150px" opacity="0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.5 11C9.32843 11 10 10.3284 10 9.5C10 8.67157 9.32843 8 8.5 8C7.67157 8 7 8.67157 7 9.5C7 10.3284 7.67157 11 8.5 11Z" fill="#0F0F0F" />
          <path d="M17 9.5C17 10.3284 16.3284 11 15.5 11C14.6716 11 14 10.3284 14 9.5C14 8.67157 14.6716 8 15.5 8C16.3284 8 17 8.67157 17 9.5Z" fill="#0F0F0F" />
          <path d="M15.1091 16.4588C15.3597 16.9443 15.9548 17.1395 16.4449 16.8944C16.9388 16.6474 17.1391 16.0468 16.8921 15.5528C16.8096 15.3884 16.7046 15.2343 16.5945 15.0875C16.4117 14.8438 16.1358 14.5299 15.7473 14.2191C14.9578 13.5875 13.7406 13 11.9977 13C10.2547 13 9.03749 13.5875 8.24796 14.2191C7.85954 14.5299 7.58359 14.8438 7.40078 15.0875C7.29028 15.2348 7.1898 15.3889 7.10376 15.5517C6.85913 16.0392 7.06265 16.6505 7.55044 16.8944C8.04053 17.1395 8.63565 16.9443 8.88619 16.4588C8.9 16.4339 9.08816 16.1082 9.49735 15.7809C9.95782 15.4125 10.7406 15 11.9977 15C13.2547 15 14.0375 15.4125 14.498 15.7809C14.9072 16.1082 15.0953 16.4339 15.1091 16.4588Z" fill="#0F0F0F" />
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM12 20.9932C7.03321 20.9932 3.00683 16.9668 3.00683 12C3.00683 7.03321 7.03321 3.00683 12 3.00683C16.9668 3.00683 20.9932 7.03321 20.9932 12C20.9932 16.9668 16.9668 20.9932 12 20.9932Z" fill="#0F0F0F" />
        </svg>
        <p>
          No Files Here
        </p>
      </div>
    </>
  )
}

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
                <div style={{ marginTop: "10px" }}>
                  <p style={{ marginRight: "20px", display: "inline" }}>{item}</p>
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
        <p className="file-header">Your Files:</p>
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
                    <button onClick={() => { downloadFile(item.url, item.name) }}>Download</button>
                    <br />
                    <button onClick={() => {
                      openTransferPopup(i);
                    }}>Transfer Ownership</button>
                  </div>
                </div>
              </div>
            );
          })}
        {
          (myFiles == null || myFiles.length === 0) && (
            <>
              <NoFiles />
            </>
          )

        }
        <p className="file-header">Shared Files:</p>
        {sharedFiles &&
          sharedFiles.map((item, i) => {
            return (
              <div key={i} className="file-link">
                <p href={item.url}>{item.name}</p>
                <svg onClick={() => { downloadFile(item.url, item.name) }} style={{ marginLeft: "auto" }} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" /></svg>
              </div>
            );
          })}
        {
          (sharedFiles == null || sharedFiles.length === 0) && (
            <>
              <NoFiles />
            </>
          )

        }
      </div>

    </>
  );
}
export default Display;
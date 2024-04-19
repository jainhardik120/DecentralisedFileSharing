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
  return (
    <>
      {accessPopupOpen && <div className="popup-background">
        <div className="popup">
          <button onClick={() => {
            setaccessPopupOpen(false);
          }}>Close</button>
          {sharedAccounts && sharedAccounts.map((item, i) => {
            return (
              <>
                <p>
                  {item}
                  <button onClick={async () => {
                    revokeAccess(item);
                  }}>Revoke Access</button>
                </p>
              </>
            )
          })}
          <input type="text" className="address" placeholder='Enter address to share to' value={address} onChange={onChange} />
          <button onClick={sharing}>Share</button>
        </div>
      </div>}
      {transferPopupOpen && <div className="popup-background">
        <div className="popup">
          <button onClick={() => {
            setTransferPopupOpen(false);
          }}>Close</button>
          <input type="text" className="address" placeholder='Enter address to transfer to' value={address} onChange={onChange} />
          <button onClick={transfer}>Transfer</button>
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
                    <button>Download</button>
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
                <a href={item.url}>{item.name}</a>
              </div>
            );
          })}
      </div>

    </>
  );
}
export default Display;
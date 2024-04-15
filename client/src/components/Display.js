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
  useEffect(() => {
    async function getData() {
      setMyFiles(convertData(await contract.viewOwnedFiles()));
      setSharedFiles(convertData(await contract.viewSharedFiles()));
    }
    if (account) {
      getData();
    }
  }, [account, contract]);
  const [accessPopupOpen, setaccessPopupOpen] = useState(false);
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
      {accessPopupOpen && <div className="popup-container">
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

      <div>
        <p>Your Files : </p>
        {myFiles && myFiles.map((item, i) => {
          return (<>
            <p>
              <a href={item.url}>{item.name}</a>
              <button onClick={() => {
                openPopup(i);
              }}>Modify Access</button>
            </p>
          </>)
        })}
        <p>Shared Files : </p>
        {sharedFiles && sharedFiles.map((item, i) => {
          return (<>
            <p>
              <a href={item.url}>{item.name}</a>
            </p>
          </>)
        })}
      </div>
    </>
  );
}
export default Display;
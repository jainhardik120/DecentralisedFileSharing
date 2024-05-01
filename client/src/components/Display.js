import { useCallback, useEffect, useState } from "react";
import './Display.css';
import { AccessPopup } from "./AccessPopup";
import { TransferPopup } from "./TransferPopup";
import { NoFiles } from "./NoFiles";

const Display = ({ account, contract }) => {
  
  const [myFiles, setMyFiles] = useState(null);
  const [sharedFiles, setSharedFiles] = useState(null);

  const getData = useCallback(async ()=>{
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
    setMyFiles(convertData(await contract.viewOwnedFiles()));
    setSharedFiles(convertData(await contract.viewSharedFiles()));
  }, [contract])

  useEffect(() => {
    if (account) {
      getData();
    }
  }, [account, contract, getData]);

  const [accessPopupOpen, setaccessPopupOpen] = useState(false);
  const [transferPopupOpen, setTransferPopupOpen] = useState(false);
  const [accessSelectedFile, setAccessSelectedFile] = useState("");

  const openPopup = (index) => {
    setAccessSelectedFile(`${myFiles[index].url}$${myFiles[index].name}`);
    setaccessPopupOpen(true);
  }

  const openTransferPopup = (index) => {
    setAccessSelectedFile(`${myFiles[index].url}$${myFiles[index].name}`);
    setTransferPopupOpen(true);
  }

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
      {accessPopupOpen && <AccessPopup setAccessSelectedFile={setAccessSelectedFile} setaccessPopupOpen={setaccessPopupOpen} accessSelectedFile={accessSelectedFile} contract={contract} />}

      {transferPopupOpen && <TransferPopup contract={contract} setTransferPopupOpen={setTransferPopupOpen} selectedFile={accessSelectedFile} getData={getData} />}

      <div className="file-container">
        <p className="file-header">Your Files</p>
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
        <p className="file-header">Shared Files</p>
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
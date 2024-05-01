import { useEffect, useState } from "react";

export const AccessPopup = ({ accessSelectedFile, setAccessSelectedFile, contract, setaccessPopupOpen }) => {

  const [address, setaddress] = useState("");
  const [sharedAccounts, setSharedAccounts] = useState(null);

  const revokeAccess = async (address) => {
    const transaction = await contract.revokeAccess(address, accessSelectedFile);
    await transaction.wait();
    alert("Updated Access Settings");
  };

  const onChange = (e) => {
    setaddress(e.target.value);
  };

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
  }, [contract, accessSelectedFile]);

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

  return (
    <>
      <div className="popup-background">
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
            );
          })}
          <div className="share-btn">
            <input type="text" className="address" placeholder='Enter address to share to' value={address} onChange={onChange} />
            <button className="upload" onClick={sharing}>Share</button>
          </div>
        </div>
      </div>
    </>
  );
};

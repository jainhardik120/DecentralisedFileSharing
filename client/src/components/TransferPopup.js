import { useState } from "react";

export const TransferPopup = ({ contract, setTransferPopupOpen, selectedFile, getData }) => {

  const [address, setaddress] = useState("");

  const onChange = (e) => {
    setaddress(e.target.value);
  };

  const transfer = async () => {
    try {
      if (address.length === 0) {
        throw Error("Error !");
      }
      const transaction = await contract.transfer(address, selectedFile);
      await transaction.wait();
      alert("File Transferred Successfully");
      getData();
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
            setTransferPopupOpen(false);
          }}>X</button>
          <input type="text" className="address" placeholder='Enter address to transfer to' value={address} onChange={onChange} />
          <button className="upload" onClick={transfer}>Transfer</button>
        </div>
      </div>
    </>
  );
};

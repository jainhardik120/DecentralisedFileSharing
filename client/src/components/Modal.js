import {useEffect} from "react";
import "./Modal.css";
const Modal=({setModalOpen,contract})=>{
    const sharing=async()=>{
        try {
            const address=document.querySelector(".address").value;
            if(address.length===0)
            {
                throw Error("Error !");
            }
            await contract.allow(address);//allows access to the *address*
        } catch (error) {
            alert("Please Enter some Address!");
        }
    };
    const removeAccess=async()=>{
        try {
            const address=document.querySelector(".address").value;
            if(address.length===0)
            {
                throw Error("Error !");
            }
            await contract.disallow(address);
        } catch (error) {
            alert("Please Enter some Address!");
        }
    }
    //by default when modal open/mounts we want to trigger that all people who already have access should be displayed
    useEffect(()=>{
        const accessList=async()=>{
        const addressList=await contract.shareAccess();
        let select=document.querySelector("#selectNumber");
        const options=addressList;
        
        for(let i=0;i<options.length;i++)
        {
            let opt=options[i];
            let e1=document.createElement("option");//creating an element of type option to be inserted into the select tag
            e1.textContent=opt.user;
            e1.value=opt.user;
            if(opt.access===false)
            {
                e1.style.backgroundColor="red";
            }
            else
            {
                e1.style.backgroundColor="green";
            }
            select.appendChild(e1);
        };
    };
    //run this accessList() only when you have a valid contract
    contract && accessList();
    },[]);
    return <>
    <div className="modalBackground">
        <div className="modalContainer">
            <div className="title">Share With</div>
            <div className="body">
            <input type="text" className="address" placeholder="Enter Address" />
            </div>
            <form id="myForm">
                <select  id="selectNumber">
                    <option className="address">People With Access</option>
                </select>
            </form>
            <div className="footer">
                <button onClick={()=>{setModalOpen(false)}} id="close">Close</button>
                <button id="cancelBtn" onClick={removeAccess}>Remove Access</button>
                <button onClick={sharing} className="give-access">Give Access</button>

            </div>
        </div>
    </div>
    </>;
}
export default Modal;
import { useState } from "react";
import axios from 'axios';
import FormData from 'form-data';
import './FileUpload.css';
const FileUpload=({account,provider,contract})=>{
    //const JWT="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0ZjE3ZDQ0MS1lOWIyLTRmOWEtYmQ4Ni05MjQyNTAwNmEyYzYiLCJlbWFpbCI6ImthcnRpa3NyaTE5MTFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjNmMzA0MjkzNDNjM2Y2ZWQzMDgyIiwic2NvcGVkS2V5U2VjcmV0IjoiYjNhMTkxZDgyNzFkMzgzY2QyMDQ1MWI3YmVkZTAxMWE2YjNiZGRhMzJlNzE5ZDI3OTkzNmQ2MjBhOTliMjUxMyIsImlhdCI6MTcxMzA5OTk2NX0.lxO4kBVAduu66q52VCoSamCRnMPhPBrr6MBuCQVFmnc";
    const [file,setFile]=useState(null);
    const [fileName,setFileName]=useState('No file Selected');
    //here  we will work with pinata to store files on ipfs, and for that we need *axios*
    const handleSubmit=async(e)=>{
        //on form submission we don't want page to reload
        e.preventDefault();
        if(file){
            //try pushing it on to pinata
            try {
                const formData=new FormData();
                formData.append("file",file);

                const resFile=await axios({
                    method:"post",
                    url:"https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                        pinata_api_key: '9147cde9acdf22c0f8c7',
                        pinata_secret_api_key:'51da65ceaa4e2447aa3e734f4f830897442ef375de2738685c4caee8117aab74',
                        'Content-Type': "multipart/form-data;",
                      },
                });
                const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
                //after uploading file to ipfs , you need the hash stored in your contract to access that fie in the future
                contract.uploadFile(ImgHash+"$"+fileName);
                alert("File uploaded Successfully");
                //after image uploaded go back to default state;
                setFileName("No File selected");
                setFile(null);

            } catch (error) {
                alert("Unable to upload file to pinata",error);
            }
        }
    };
    const retrieveFile=(e)=>{
        e.preventDefault();
        //image uploaded ins generally in some format like png, jpg etc. So we change it to data format
        /*const data=e.target.files[0];//whatever  files we select, files object keeps track of it. We just want the 0th index file.
        console.log(data);
        const reader=new window.FileReader();//we use window's filereader functionality
        reader.readAsArrayBuffer(data);//read data as array buffer
        reader.onloadend=()=>{*/
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        
    }
    return <div className="top">
        <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="file-upload" className="choose">
                Choose File
            </label>
            <input disabled={!account} type="file" id="file-upload" name="data" onChange={retrieveFile}/>
            <span className="textArea">Image:{fileName}</span>
            <button type="submit" className="upload" disabled={!file}>Upload File</button>
        </form>
    </div>;
}
export default FileUpload;
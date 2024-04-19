import { useState } from "react";
import axios from 'axios';
import FormData from 'form-data';
import './FileUpload.css';
const FileUpload = ({ account, contract, onClose }) => {
	const [file, setFile] = useState(null);
	const [fileName, setFileName] = useState('No file Selected');
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (file) {
			try {
				const formData = new FormData();
				formData.append("file", file);
				const resFile = await axios({
					method: "post",
					url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
					data: formData,
					headers: {
						pinata_api_key: '9147cde9acdf22c0f8c7',
						pinata_secret_api_key: '51da65ceaa4e2447aa3e734f4f830897442ef375de2738685c4caee8117aab74',
						'Content-Type': "multipart/form-data;",
					},
				});
				const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
				const transaction = await contract.uploadFile(ImgHash + "$" + fileName);
				await transaction.wait();
				alert("File uploaded Successfully");
				setFileName("No File selected");
				setFile(null);
			} catch (error) {
				alert("Unable to upload file to pinata", error);
			}
		}
	};
	const retrieveFile = (e) => {
		e.preventDefault();
		setFile(e.target.files[0]);
		setFileName(e.target.files[0].name);
	}
	return (
		<div className="popup-background">
			<div className="popup">
				<form className="form" onSubmit={handleSubmit}>
					<label className="choose">
						<span className="text-gray-700">Choose File</span>
						<input disabled={!account} className="image-input" type="file" id="file-upload" name="data" onChange={retrieveFile} />
					</label>
					<div style={{ "display": "flex", "flexDirection": "column", "alignContent": "flex-end" }}>
						<button type="submit" className="upload" disabled={!file}>Upload File</button>
					</div>
				</form>
			</div>
		</div>
	);
}
export default FileUpload;
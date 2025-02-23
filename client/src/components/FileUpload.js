import { useState } from "react";
import axios from 'axios';
import FormData from 'form-data';
import './FileUpload.css';
import UploadLogo from '../upload-icon.svg'

const FileUpload = ({ account, contract, onClose }) => {
	const [file, setFile] = useState(null);
	const [fileName, setFileName] = useState('No file Selected');
	const [fileUploading, setFileUploading] = useState(false);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (file) {
			setFileUploading(true);
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
			setFileUploading(false);
		}
	};
	const retrieveFile = (e) => {
		e.preventDefault();
		setFile(e.target.files[0]);
		setFileName(e.target.files[0].name);
	}
	return (
		<>
			<div className="popup-background">
				<div className="popup" style={{ textAlign: "center" }}>
					{fileUploading && (<>
						<div className="loading-container">
							<div className="loading-icon"></div>
							<p className="loading-text">Uploading file</p>
						</div>
					</>)}
					{!fileUploading && (
						<form className="form" onSubmit={handleSubmit}>
							<input disabled={!account} className="image-input" type="file" id="file-upload" name="data" onChange={retrieveFile} />
							<label for="file-upload" className="custom-file-upload">
								<img style={{ width: "30%" }} src={UploadLogo} alt="" />
							</label>

							<p className="file-name">{fileName}</p>

							<div style={{ "display": "flex", "flexDirection": "column", "alignContent": "flex-end" }}>
								<button type="submit" className="upload" disabled={!file}>Upload File</button>
							</div>
						</form>)}
				</div>
			</div>
		</>
	);
}
export default FileUpload;
import React from 'react'

const Help = ({address}) => {
  return (
    <div>
        <main>
    <section>
      <h2>Instructions:</h2>
      <p>Welcome to our decentralized file sharing app. Below are instructions on how to use the app:</p>
      <ol>
        <li><strong>Connect your MetaMask Wallet:</strong> Click on the MetaMask icon in your browser and connect your wallet to the app.</li>
        <li><strong>Upload a File:</strong> Click on the "Upload" button and select the file you want to upload.</li>
        <li><strong>Share Access to a File:</strong> Enter the recipient's address and the file ID in the provided form and click "Share".</li>
        <li><strong>Transfer Ownership of a File:</strong> Enter the new owner's address and the file ID in the provided form and click "Transfer".</li>
        <li><strong>Revoke Access to a File:</strong> Enter the recipient's address and the file ID in the provided form and click "Revoke Access".</li>
        <li><strong>Download a File:</strong> Enter the file ID in the provided form and click "Download".</li>
      </ol>
      <p>If you encounter any issues or need further assistance, please contact our support team.</p>
    </section>
  </main>
  <footer>
    <p>&copy; 2024 Decentralized File Sharing App. All rights reserved.</p>
  </footer>
    </div>
  )
}

export default Help

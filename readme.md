# Decentralized File Sharing System

## Overview

This repository contains the implementation of a decentralized file sharing system built on blockchain technology. The system enables users to securely upload, share, and manage files without relying on centralized authorities.

## Features

- **Secure File Upload**: Users can securely upload files to the decentralized network.
- **Access Control**: Smart contracts govern access control, ensuring that only authorized users can view files.
- **Ownership Management**: Users can manage ownership of files through blockchain-based ownership records.
- **Decentralized Access**: No central authority controls file access, enhancing privacy and security.
- **Permission Management**: Users can grant and revoke access to their files using smart contract functionality.

## Technologies Used

- **Solidity**: Smart contracts are written in Solidity, the programming language for Ethereum smart contracts.
- **Hardhat**: Hardhat is used for Ethereum development, providing testing, debugging, and deployment utilities.
- **Web3.js**: The Ethereum JavaScript API, Web3.js, is used for interacting with the Ethereum blockchain.
- **React**: The frontend user interface is built using React.js for a dynamic and responsive user experience.
- **MetaMask**: MetaMask is used for interacting with the Ethereum blockchain from the browser.

## Project Structure

The project is divided into two main folders:

1. **client**: Contains the frontend application built using React.js for interacting with the decentralized file sharing system.
2. **hardhat**: Contains the Ethereum smart contracts, deployment scripts, and testing scripts using Hardhat.

## Installation

1. Clone the repository:
```
git clone https://github.com/your_username/your_repository.git
```
2. Install dependencies for the client:
```
cd client
npm install
```
3. Install dependencies for the hardhat:
```
cd ../hardhat
npm install
```
4. Create a .env file in the hardhat folder and add the following variables:
```
ALCHEMY_SEPOLIA_URL=<Your Alchemy URL>
SEPOLIA_PRIVATE_KEY=<Your Private Key>
```
Make sure to replace <Your Alchemy URL> with your Alchemy endpoint URL and <Your Private Key> with your Ethereum account's private key.
5. Compile the smart contracts:
```
npx hardhat compile
```
6. Deploy the smart contracts to a local blockchain or test network:
```
npx hardhat run --network sepolia scripts/deploy.js
```
7. Start the client application:
```
cd ../client
npm start
```
8. Access the decentralized file sharing system through your web browser at http://localhost:3000.

## Usage
1. Connect your MetaMask wallet to the decentralized application (DApp).
2. Upload files securely to the decentralized network.
3. Manage access control and ownership of files through smart contracts.
4. Share files with authorized users and revoke access when needed.
5. Download files securely from the decentralized network.
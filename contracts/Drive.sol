// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Strings.sol";

contract Drive {
    using Strings for string;
    mapping(string => address) public fileOwners;
    mapping(address => string[]) public ownedFiles;

    mapping(string => address[]) public access;
    mapping(address => string[]) public sharedFiles;
    
    function uploadFile(string memory url) public  {
        fileOwners[url] = msg.sender;
        ownedFiles[msg.sender].push(url);
    }

    function viewOwnedFiles() public view returns(string[] memory){
        return ownedFiles[msg.sender];
    }

    function viewSharedFiles() public view returns(string[] memory){
        return sharedFiles[msg.sender];
    }

    function viewAccessList(string memory file) public view returns(address[] memory){
        return access[file];
    }

    function transfer(address newOwner, string memory file) public {
        require(msg.sender==fileOwners[file], "You are not the owner of file");
        revokeAccess(newOwner,file);
        fileOwners[file] = newOwner;
        uint index = 0;
        bool found = false;
        for(uint i = 0; i < ownedFiles[msg.sender].length; i++){
            if(ownedFiles[msg.sender][i].equal(file)){
                found = true;
                index = i;
                break;
            }
        }
        require(found == true, "You are not the owner of file");

        ownedFiles[msg.sender][index] = ownedFiles[msg.sender][ownedFiles[msg.sender].length-1];
        ownedFiles[msg.sender].pop();
        ownedFiles[newOwner].push(file);

    }

    function shareFile(address user, string memory file) public {
        require(msg.sender==fileOwners[file], "You are not the owner of file");
        access[file].push(user);
        sharedFiles[user].push(file);
    }

    function revokeAccess(address user, string memory file) public {
        require(msg.sender==fileOwners[file], "You are not the owner of file");
        uint index = 0;
        bool found = false;
        for(uint i = 0; i < access[file].length; i++){
            if(access[file][i]==user){
                index = i;
                found = true;
                break;
            }
        }
        require(found == true, "File not shared with user");
        access[file][index] = access[file][access[file].length-1];
        access[file].pop();
        index = 0;
        found = false;
        for(uint i = 0; i < sharedFiles[user].length; i++){
            if(sharedFiles[user][i].equal(file)){
                index = i;
                found = true;
                break;
            }
        }
        require(found == true, "File not shared with user");
        sharedFiles[user][index] = sharedFiles[user][sharedFiles[user].length-1];
        sharedFiles[user].pop();
    }
}
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Drive", function () {

    const file1 = "https://some-token.uri/";
    const file2 = "https://some-token.uri2/";
    let drive, owner, otherAccount, otherAccount2;

    async function deployContract() {
        const drive = await ethers.deployContract("Drive");
        return drive;
    };

    this.beforeEach(async () => {
        drive = await loadFixture(deployContract);
        [owner, otherAccount, otherAccount2] = await ethers.getSigners();
    })

    describe("Upload Functionality", function () {
        it("Test Upload File", async () => {
            await drive.uploadFile("https://some-token.uri/");
            const list = await drive.viewOwnedFiles();
            expect(list[0]).to.equal("https://some-token.uri/");
        });
    })


    describe("Test Transfer File", function () {

        this.beforeEach(async () => {
            await drive.uploadFile(file1);
            await drive.uploadFile(file2);
        })

        it("Checking first user files", async () => {

            const list1pre = await drive.viewOwnedFiles();
            expect(list1pre.length).to.equal(2);
            expect(list1pre[0]).to.equal(file1);
            expect(list1pre[1]).to.equal(file2);
        });

        it("Checking second user files", async () => {

            const list2pre = await drive.connect(otherAccount).viewOwnedFiles();
            expect(list2pre.length).to.equal(0);
        });


        it("Trying transfer not owned file by second user", async () => {

            await expect(drive.connect(otherAccount).transfer(owner, file1)).to.be.revertedWith("You are not the owner of file");
        });


        it("Checking first user files after transferring", async () => {

            await drive.transfer(otherAccount, file2);
            const list1post = await drive.viewOwnedFiles();
            expect(list1post.length).to.equal(1);
            expect(list1post[0]).to.equal(file1);
        });


        it("Checking second user files after transferring", async () => {

            await drive.transfer(otherAccount, file2);
            const list2post = await drive.connect(otherAccount).viewOwnedFiles();
            expect(list2post.length).to.equal(1);
            expect(list2post[0]).to.equal(file2);
        });

        it("Transferring already transferred file", async () => {
            await drive.transfer(otherAccount, file2);
            await expect(drive.transfer(otherAccount2, file2)).to.be.revertedWith("You are not the owner of file");
        });

        it("Transfer file back to original owner by second account", async () => {
            await drive.transfer(otherAccount, file2);
            expect(drive.connect(otherAccount).transfer(owner, file2));
        })
    });

    describe("Checking file sharing functionality", function () {
        it('Owner Should upload file and share to otherAccount', async () => {
            expect(await drive.uploadFile(file1));
            expect(await drive.shareFile(otherAccount, file1));
            const ownerFiles = await drive.viewOwnedFiles();
            const personFiles = await drive.connect(otherAccount).viewSharedFiles();
            expect(ownerFiles[0]).to.equal(personFiles[0]);
        });
        it('otherAccount Should try to share access to a file to otherAccount2 and get error', async () => {
            expect(await drive.uploadFile(file1));
            await expect(drive.connect(otherAccount).shareFile(otherAccount2, file1)).to.be.revertedWith("You are not the owner of file");
        });
        it('Owner Should upload file,share to otherAccount and then revoke share access', async () => {
            await drive.uploadFile(file1);
            await drive.shareFile(otherAccount, file1);
            const ownerFiles = await drive.viewOwnedFiles();
            const personFiles = await drive.connect(otherAccount).viewSharedFiles();
            expect(ownerFiles[0]).to.equal(personFiles[0]);

            await drive.revokeAccess(otherAccount, file1);
            const newPersonFiles = await drive.connect(otherAccount).viewSharedFiles();
            expect(newPersonFiles.length).to.equal(0);
        });
        it('Should revert error if file was not previously shared', async () => {
            await drive.uploadFile(file1);
            await expect(drive.revokeAccess(otherAccount, file1)).to.be.revertedWith("File not shared with user");
        })
    })
});
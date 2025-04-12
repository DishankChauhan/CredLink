import { expect } from "chai";
import hre from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { CredentialRegistry } from "../typechain-types";

describe("CredentialRegistry", function () {
  let credentialRegistry: CredentialRegistry;
  let owner: HardhatEthersSigner;
  let issuer: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  beforeEach(async function () {
    // Get signers
    [owner, issuer, user1, user2] = await hre.ethers.getSigners();

    // Deploy the contract
    const CredentialRegistryFactory = await hre.ethers.getContractFactory("CredentialRegistry");
    credentialRegistry = await CredentialRegistryFactory.deploy();
  });

  describe("Issuer Management", function () {
    it("Should allow owner to register an issuer", async function () {
      await expect(credentialRegistry.registerIssuer(issuer.address))
        .to.emit(credentialRegistry, "IssuerRegistered")
        .withArgs(issuer.address);

      expect(await credentialRegistry.isRegisteredIssuer(issuer.address)).to.be.true;
    });

    it("Should prevent non-owners from registering issuers", async function () {
      await expect(
        credentialRegistry.connect(user1).registerIssuer(user2.address)
      ).to.be.revertedWithCustomError(credentialRegistry, "OwnableUnauthorizedAccount");
    });

    it("Should allow owner to remove an issuer", async function () {
      // First register the issuer
      await credentialRegistry.registerIssuer(issuer.address);

      // Then remove the issuer
      await expect(credentialRegistry.removeIssuer(issuer.address))
        .to.emit(credentialRegistry, "IssuerRemoved")
        .withArgs(issuer.address);

      expect(await credentialRegistry.isRegisteredIssuer(issuer.address)).to.be.false;
    });
  });

  describe("Credential Management", function () {
    const testCredential = "Bachelor of Science in Computer Science from XYZ University, GPA 3.8, 2022";

    beforeEach(async function () {
      // Register the issuer before each test in this block
      await credentialRegistry.registerIssuer(issuer.address);
    });

    it("Should allow a user to add a credential", async function () {
      await expect(credentialRegistry.connect(user1).addCredential(testCredential))
        .to.emit(credentialRegistry, "CredentialAdded");
      
      // Get the user's credentials
      const userCredentialIds = await credentialRegistry.getUserCredentialIds(user1.address);
      expect(userCredentialIds.length).to.equal(1);
    });

    it("Should allow a registered issuer to verify a credential", async function () {
      // User adds a credential
      await credentialRegistry.connect(user1).addCredential(testCredential);
      
      // Get the credential ID
      const userCredentialIds = await credentialRegistry.getUserCredentialIds(user1.address);
      const credentialId = userCredentialIds[0];
      
      // Issuer verifies the credential
      await expect(
        credentialRegistry.connect(issuer).verifyCredential(user1.address, credentialId)
      ).to.emit(credentialRegistry, "CredentialVerified")
       .withArgs(credentialId, user1.address, issuer.address);
      
      // Check if the credential is valid
      expect(await credentialRegistry.isCredentialValid(credentialId)).to.be.true;
    });

    it("Should prevent unregistered issuers from verifying credentials", async function () {
      // User adds a credential
      await credentialRegistry.connect(user1).addCredential(testCredential);
      
      // Get the credential ID
      const userCredentialIds = await credentialRegistry.getUserCredentialIds(user1.address);
      const credentialId = userCredentialIds[0];
      
      // Unregistered user tries to verify
      await expect(
        credentialRegistry.connect(user2).verifyCredential(user1.address, credentialId)
      ).to.be.revertedWith("Not a registered issuer");
    });

    it("Should allow an issuer to revoke a credential they verified", async function () {
      // User adds a credential
      await credentialRegistry.connect(user1).addCredential(testCredential);
      
      // Get the credential ID
      const userCredentialIds = await credentialRegistry.getUserCredentialIds(user1.address);
      const credentialId = userCredentialIds[0];
      
      // Issuer verifies the credential
      await credentialRegistry.connect(issuer).verifyCredential(user1.address, credentialId);
      
      // Issuer revokes the credential
      await expect(
        credentialRegistry.connect(issuer).revokeCredential(credentialId)
      ).to.emit(credentialRegistry, "CredentialRevoked")
       .withArgs(credentialId, issuer.address);
      
      // Check if the credential is now invalid
      expect(await credentialRegistry.isCredentialValid(credentialId)).to.be.false;
    });

    it("Should return the correct verified credentials for a user", async function () {
      // User adds multiple credentials
      await credentialRegistry.connect(user1).addCredential(testCredential);
      await credentialRegistry.connect(user1).addCredential(testCredential + " - Updated");
      
      // Get the credential IDs
      const userCredentialIds = await credentialRegistry.getUserCredentialIds(user1.address);
      
      // Issuer verifies only the first credential
      await credentialRegistry.connect(issuer).verifyCredential(user1.address, userCredentialIds[0]);
      
      // Get verified credentials
      const [verifiedIds, hashes, issuers] = await credentialRegistry.getVerifiedCredentials(user1.address);
      
      // Should only have one verified credential
      expect(verifiedIds.length).to.equal(1);
      expect(verifiedIds[0]).to.equal(userCredentialIds[0]);
      expect(issuers[0]).to.equal(issuer.address);
    });
  });
}); 
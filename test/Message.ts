import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Message Test", function () {
  // Reuseable async method for deployment

  async function deployMessageFixture() {
    // contracts are deployed using the first signer/sccount by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const Message = await hre.ethers.getContractFactory("Message");
    const message = await Message.deploy();

    return { message, owner, otherAccount };
  }

  describe("Deployment", () => {
    it("Should check if it deployed ", async function () {
      const { message, owner } = await loadFixture(deployMessageFixture);

      expect(await message.owner()).to.equal(owner);
    });

    it("Should be able to set message", async function () {
      const { message, owner } = await loadFixture(deployMessageFixture);
      const msg = "Hello world!";
      await message.connect(owner).setMessage(msg);

      expect(await message.getMessage()).to.equal(msg);
    });

    it("Should not be able to set message if not owner", async function () {
      const { message, otherAccount } = await loadFixture(deployMessageFixture);
      const msg = "Hello world!";
      await expect(
        message.connect(otherAccount).setMessage(msg)
      ).to.be.revertedWith("You aren't the owner of this message");
    });
    

    describe("Transfer ownership", async () => {
      it("The New Owner should not be address zero", async function () {
        const { owner, message, otherAccount } = await loadFixture(
          deployMessageFixture
        );

        await message.connect(owner).transferOwnership(otherAccount);
        expect(await message.owner()).to.be.equal(otherAccount);
      });
    });
  });
});

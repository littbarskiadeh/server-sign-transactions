const express = require("express");
const router = express.Router();
const Web3 = require("web3");
const Tx = require("ethereumjs-tx");

// import contract details
const contractAddr = "0x3922c7744c1De2cBA34a1faD1Da16F593eF069A0";
const abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "n",
        type: "uint256",
      },
    ],
    name: "decrement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "n",
        type: "uint256",
      },
    ],
    name: "increment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "x",
        type: "uint256",
      },
    ],
    name: "set",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "get",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const providerURL = "http://localhost:7545";

function init() {
  const TxObj = Tx.Transaction;
  const web3 = new Web3(new Web3.providers.HttpProvider(providerURL));
  web3.eth.getAccounts(console.log);
  let contractInstance = new web3.eth.Contract(abi, contractAddr);
  console.log("contractInstance");

  // account and private key from ganache
  const account = "0x60195F5f1dace2a26066e69557278Cbbc24A3312";
  const privateKey = Buffer.from(
    "e4a1d0af074ddea1a24489943b3997b806ef87664887b1f11286225fdf0db991",
    "hex"
  );
  //const newAddress = '0x5aB5E52245Fd4974499aa625709EE1F5A81c8157';
  //var TestContract = new web3.eth.Contract([YOUR_ABI], contractAddress);
  const _data = contractInstance.methods.set(10).encodeABI();
  console.log(_data);

  // create transaction (as object) to be sent
  let rawTx = {};
  web3.eth.getTransactionCount(account).then((nonce) => {
    rawTx = {
      nonce: nonce,
      gasPrice: "0x20000000000",
      gasLimit: "0x41446",
      to: contractAddr,
      value: 0,
      data: _data,
    };

    const tx = new TxObj(rawTx);
    tx.sign(privateKey);

    // what is serialize()
    const serializedTx = tx.serialize();

    // send the signed transaction
    web3.eth
      .sendSignedTransaction("0x" + serializedTx.toString("hex"))
      .on("receipt", console.log);
  });
}

/* GET home page. */
router.get("/", function(req, res, next) {
  init();
  res.render("index", { title: "Server Signing" });
});

module.exports = router;

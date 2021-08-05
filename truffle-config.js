const path = require("path");

const HDWalletProvider = require("@truffle/hdwallet-provider")
const infuraKey = "e51a791200b94e5e9fdcb8bc7a84e7c0"
const fs = require("fs")
const mnemonic = fs.readFileSync(".secret").toString().trim()

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    // develop: {
    //   gas: 500000,
    //   port: 7545
    // },
    // "customNetwork": {
    //   network_id: 1,
    //   host: "127.0.0.1",
    //   port: 9546 // the port that Ganache-cli exposes
    // }
    ropsten: {
      
      provider: new HDWalletProvider(
        mnemonic,
        `https://ropsten.infura.io/v3/${infuraKey}`
      ),
      network_id: 3, // Ropsten's id
      gas: 5500000, // Ropsten has a lower block limit than mainnet
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
  }
};

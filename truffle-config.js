const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      gas: 500000,
      port: 7545
    },
    // "customNetwork": {
    //   network_id: 1,
    //   host: "127.0.0.1",
    //   port: 9546 // the port that Ganache-cli exposes
    // }
  }
};

import Web3 from "web3";
const infuraKey = "e51a791200b94e5e9fdcb8bc7a84e7c0"
const HDWalletProvider = require("@truffle/hdwallet-provider");
  
const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      // try{
    //   let provider = new HDWalletProvider({
    //     mnemonic:'artist mean chase blanket sport winter vacuum exotic memory bacon employ hole',
    //     providerOrUrl:`https://ropsten.infura.io/v3/${infuraKey}`
    //   });
    // const web3= new Web3(provider)
      // const web3 = new Web3(new Web3.providers.HttpProvider(`https://ropsten.infura.io/v3/${infuraKey}`));
      // resolve(web3);
      //   } catch (error) {
      //     reject(error);
      //   }
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
          // Accounts now exposed
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {
      //   var web3 = new Web3(new Web3.providers.HttpProvider(
      //     `https://ropsten.infura.io/v3/${infuraKey}`
      // ));
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:8545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
    });
  });

export default getWeb3;

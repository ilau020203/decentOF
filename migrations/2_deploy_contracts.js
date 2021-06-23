var StringUtils = artifacts.require("StringUtils");
var decentOF = artifacts.require("decentOF");


module.exports = function (deployer) {
 deployer.deploy(StringUtils);
  deployer.link(StringUtils, decentOF);
  deployer.deploy(decentOF)
    
};

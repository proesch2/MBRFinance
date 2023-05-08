var MBRFinance = artifacts.require('./MBRFinance.sol');
var MBRDAO = artifacts.require('./MBRDAO.sol');

module.exports = function(deployer, network, accounts){
    deployer.deploy(MBRFinance);
    deployer.deploy(MBRDAO);
}
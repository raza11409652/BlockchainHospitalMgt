const Migrations = artifacts.require("Patient");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};

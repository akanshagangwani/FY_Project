const DegreeVerification = artifacts.require("DegreeVerification");

module.exports = function (deployer) {
  deployer.deploy(DegreeVerification);
};

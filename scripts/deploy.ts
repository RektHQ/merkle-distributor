// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

import { program } from 'commander'
import fs from 'fs'
import { parseBalanceMap } from '../src/parse-balance-map'

async function main() {

    program
        .version('0.0.0')
        .requiredOption(
            '-i, --input <path>',
            'input JSON file location containing a map of account addresses to string balances'
        )
        .requiredOption(
            '-o, --output <path>',
            'Merkle tree output file location containing Merkle root and Merkle proofs'
        )

    program.parse(process.argv)

    const json = JSON.parse(fs.readFileSync(program.input, { encoding: 'utf8' }))

    if (typeof json !== 'object') throw new Error('Invalid JSON')

    const merkleTree = parseBalanceMap(json)

    fs.writeFileSync(program.output, JSON.stringify(merkleTree, null, 2));

    // We get the contract to deploy
    const MerkleDistributor = await hre.ethers.getContractFactory("MerkleDistributor");
    const merkleDistributor = await MerkleDistributor.deploy(
        "0x6B175474E89094C44Da98b954EedeAC495271d0F",  // TODO: change later
        merkleTree.merkleRoot
    );

    await merkleDistributor.deployed();

    console.log("Merkle Distributor deployed to:", merkleDistributor.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
import { program } from 'commander'
import fs from 'fs'
import csv from 'csv-parser'
import Web3 from "web3"

import { parseBalanceMap } from '../src/parse-balance-map'

program
.version('0.0.0')
.requiredOption(
  '-i, --input <path>',
  'input CSV file'
)
.requiredOption(
  '-a, --amount <number>',
  'Amount to airdrop'
)
.requiredOption(
  '-o, --output <path>',
  'Merkle tree output file location containing Merkle root and Merkle proofs'
)
.requiredOption(
  '-n, --node <path>',
  'ETH node url'
)


program.parse(process.argv)

const web3 = new Web3(new Web3.providers.HttpProvider(program.node));

const results: any = [];
const amount: Number = Number(program.amount);

fs.createReadStream(program.input)
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', async () => {
    let balanceMap: any = {}

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      let address = result["Ethereum wallet (optional) - to receive rewards"]
      if (address) {
        const date = result["OPTIN_TIME"]
        if(address.includes(".eth")) {
          address = await web3.eth.ens.getAddress(address)
        } 
  
        if (new Date("2020-12-01 0:00:00").getTime() > new Date(date).getTime()) {
          balanceMap[address] = amount
        } else {
          balanceMap[address] = Number(amount) / 2
        }
      }
      
    }
    fs.writeFileSync(`${program.output.split(".")[0]}_balanceMap.json`, JSON.stringify(balanceMap, null, 2));
    fs.writeFileSync(program.output, JSON.stringify(parseBalanceMap(balanceMap), null, 2));
  })


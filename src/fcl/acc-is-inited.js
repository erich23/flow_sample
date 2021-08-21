// File: ./src/flow/init-account.tx.js

import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function accountIsInitialized() {
    let currUser = await fcl.currentUser().snapshot();
    return await fcl
    .send([
        fcl.script`
          import BnGNFTContract from 0xProfile

          pub fun main(targetAddress: Address) : String {
              let nftOwner = getAccount(targetAddress)
          
              let capability = nftOwner.getCapability<&{BnGNFTContract.NFTReceiver}>(/public/NFTReceiver)
          
              let receiverRef = capability.borrow()
              if receiverRef == nil {
                return true
              }
              return false
          }
        `,
        fcl.args([
        fcl.arg(currUser.addr, t.Address),
        ])
    ])
    .then(fcl.decode)
    .catch(err => {
        console.log(err);
    })
}
// File: ./src/flow/init-account.tx.js

import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function burnNFT(id) {
    const txId = await fcl
    .send([
      fcl.args([fcl.arg(id, t.UInt64)]),
      fcl.transaction`
      import BnGNFTContract from 0xProfile

      transaction (id:UInt64) {
          let collectionRef : &BnGNFTContract.Collection
          prepare(acct: AuthAccount) {
              // Create a new empty collection
              self.collectionRef = acct.borrow<&BnGNFTContract.Collection>(from: /storage/BnGNFTCollection) ?? panic("Could not borrow collection ref")
          }
          execute {
              let token <-self.collectionRef.ownedNFTs.remove(key: id)!
              self.collectionRef.NFTMetadata.remove(key: id)!
              destroy token
          }
      }
      `,
      fcl.payer(fcl.authz), // current user is responsible for paying for the transaction
      fcl.proposer(fcl.authz), // current user acting as the nonce
      fcl.authorizations([fcl.authz]), // current user will be first AuthAccount
      fcl.limit(1000), // set the compute limit
    ])
    .then(fcl.decode)
  return fcl.tx(txId).onceSealed()
}
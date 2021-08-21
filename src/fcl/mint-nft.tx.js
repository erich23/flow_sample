// File: ./src/flow/init-account.tx.js

import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function mintNFT(receiverAddr, resourceUri, metadataUri) {
  const txId = await fcl
    .send([
    fcl.args([fcl.arg(receiverAddr, t.Address), fcl.arg(resourceUri, t.String), fcl.arg(metadataUri, t.String)]),
      // Transactions use fcl.transaction instead of fcl.script
      // Their syntax is a little different too
      fcl.transaction`
      import BnGNFTContract from 0xProfile

      // This transaction transfers an NFT from one user's collection
      // to another user's collection.
      transaction (receiverAddress: Address, resourceUri: String, metadataUri: String){
      
          // The field that will hold the NFT as it is being
          // transferred to the other account
          let minterRef: @BnGNFTContract.NFTMinter
          // Admin account authorizer ONLY
          prepare(acctAdmin: AuthAccount) {
              // Borrow a capability for the NFTMinter in storage
              self.minterRef = acctAdmin.borrow<&BnGNFTContract.NFTMinter>(from: /storage/NFTMinter)
                  ?? panic("Could not borrow minter reference")
          }
      
          execute {
              // Get the recipient's public account object
              let recipient = getAccount(receiverAddress)
      
              // Get the Collection reference for the receiver
              // getting the public capability and borrowing a reference from it
              let receiverRef = recipient.getCapability<&{BnGNFTContract.NFTReceiver}>(/public/NFTReceiver)
                  .borrow()
                  ?? panic("Could not borrow receiver reference")
      
              // Use the minter reference to mint an NFT, which deposits
              // the NFT into the collection that is sent as a parameter.
              let newNFT <- self.minterRef.mintNFT(metadata: {"resourceUri": resourceUri, "metadataUri": metadataUri})
      
              // Deposit the NFT in the receivers collection
              receiverRef.deposit(token: <-self.newNFT)
          }
      }
      `,
      fcl.payer(process.env.REACT_APP_CONTRACT_PROFILE), // current user is responsible for paying for the transaction
      fcl.proposer(fcl.authz), // current user acting as the nonce
      fcl.authorizations([fcl.authz]), // current user will be first AuthAccount
      fcl.limit(35), // set the compute limit
    ])
    .then(fcl.decode)

  return fcl.tx(txId).onceSealed()
}
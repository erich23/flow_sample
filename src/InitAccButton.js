import React, {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {initAccount} from "./fcl/init-acc.tx"
import {accountIsInitialized} from "./fcl/acc-is-inited"



export function InitAccountButton() {

  const initStatus = "Account is not setup";
  const [status, setStatus] = React.useState(initStatus);

  async function initAccount() {
    let newStatus = await accountIsInitialized();
    setStatus(newStatus);
    if (newStatus === "Account is setup"){
      return
    } else {
      const txId = await fcl
      .send([
        // Transactions use fcl.transaction instead of fcl.script
        // Their syntax is a little different too
        fcl.transaction`
          import BnGNFTContract from 0xProfile //todo

          transaction {
              prepare(acct: AuthAccount) {
          
              let collection <- BnGNFTContract.createEmptyCollection()
          
              acct.save<@BnGNFTContract.Collection>(<-collection, to: /storage/BnGNFTCollection)
          
              acct.link<&{BnGNFTContract.NFTReceiver}>(/public/NFTReceiver, target: /storage/BnGNFTCollection)
              }
          }
        `,
        fcl.payer(fcl.authz), // current user is responsible for paying for the transaction
        fcl.proposer(fcl.authz), // current user acting as the nonce
        fcl.authorizations([fcl.authz]), // current user will be first AuthAccount
        fcl.limit(1000), // set the compute limit
      ])
      .then(fcl.decode)
      fcl.tx(txId).onceSealed()
    }
  }

  if (status === "Account is not setup") {
    return (
      <div>
        <button onClick={initAccount}>Setup Account</button>
      </div>
    )
  } else {
    return <div>
      {status}
    </div>
  }
  
}
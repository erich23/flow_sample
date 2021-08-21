import React, {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"
import {mintNFT} from "./fcl/mint-nft.tx"

export function MintNFTButton() {
  return (
    <div>
      <button onClick={() => mintNFT('LINK1', 'LINK2')}>Mint NFT</button>
    </div>
  )
}
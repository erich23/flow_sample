import React, {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {viewNFTMetadata} from "./fcl/view-nft-metadata"
import {burnNFT} from "./fcl/burn-nft.tx.js"


export function ViewNFTMetadata() {
  const NFTList = [];
  const [list, setList] = React.useState(NFTList);

  async function handleRefresh() {
    let currUser = await fcl.currentUser().snapshot();
    console.log(currUser.addr);
    let newList = await viewNFTMetadata(currUser.addr);
    console.log('new list');
    console.log(newList);
    setList(newList);
  }
  async function burn(id){
    burnNFT(id);
  }
  if(list.length == 0){
    return (
      <div>
        <h> No NFTs! </h>
        <button onClick={handleRefresh}>Refresh</button>
      </div>
    )
  } else {
    return (
      <div>
        <ul>
        {
        list.map(function(item) {
          return <div> 
              <li key={item.id}>{item.id}, {item.resourceUri}, {item.metadataUri}</li>
              <button onClick={()=>burn(parseInt(item.id))}>Burn NFT {item.id}</button>
            </div>;
        })}
        </ul>
        <button onClick={handleRefresh}>Refresh</button>
      </div>
    )
  }
}
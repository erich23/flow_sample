// File: ./src/Auth.js

import React from "react"
import {AuthCluster} from "./auth-cluster"
import{MintNFTButton} from "./MintNFT"
import{ViewNFTMetadata} from "./ViewNFTMetadata"
import{InitAccountButton} from "./InitAccButton"

export default function App() {
  return (
    <div>
      <AuthCluster />
      <InitAccountButton/>
      <ViewNFTMetadata/>
    </div>
  )
}

import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
export async function viewNFTMetadata(targetAddress) {
    return await fcl
    .send([
        fcl.script`
            import BnGNFTContract from 0xProfile

            pub fun main(targetAddress: Address) : [{String : String}] {
                let nftOwner = getAccount(targetAddress)
            
                let capability = nftOwner.getCapability<&{BnGNFTContract.NFTReceiver}>(/public/NFTReceiver)
            
                let receiverRef = capability.borrow()
                    ?? panic("Could not borrow the receiver reference")
                let IDs = receiverRef.getIDs()
                // let metadata : {UInt64 : {String : String}} = {}
                var metadata : [{String:String}] = []
                for id in IDs {
                    // metadata[id] = receiverRef.getMetadataByID(id: id)
                    var temp = receiverRef.getMetadataByID(id: id)
                    temp["id"] = id.toString()
                    metadata = metadata.concat([temp])
                }
                return metadata
            }
        `,
        fcl.args([
        fcl.arg(targetAddress, t.Address),
        ])
    ])
    .then(fcl.decode)
    .catch(err => {
        console.log(err);
    })
}

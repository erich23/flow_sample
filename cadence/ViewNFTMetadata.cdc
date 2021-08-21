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
        var temp = receiverRef.getMetadataByID(id: id)
        if temp != nil {
            temp["id"] = id
            metadata = metadata.concat([temp])
        } 
    }
    return metadata
}
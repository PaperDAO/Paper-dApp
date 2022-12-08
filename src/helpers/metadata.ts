
/**
 * Image src tag content for SVG image
 */
 export const generateMetadata = (): string => {
  let metadataObj = {
    // name: _tokenName[tokenId],
    // image_data: _createSvg(tokenId),
    
    // "name": "Herbie Starbelly",
    // "description": "Friendly OpenSea Creature that enjoys long swims in the ocean.",
    // "image": "https://storage.googleapis.com/opensea-prod.appspot.com/creature/50.png",

    type:"",
    content:"",

    attributes: [
    //   {"trait_type": "type", "value": "A4"},
    //   {"trait_type": "Inches", "value": "8-1/4 x 11-3/4 in"},
    //   {"trait_type": "Millimeters", "value": "210 x 297 mm"}, 
    ],
  };
  
  return JSON.stringify(metadataObj);
}
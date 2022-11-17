import axios from 'axios';

// IPFS Gateway Servers
const gateway = {
  moralis: 'https://ipfs.moralis.io:2053/ipfs/',
  cloudflare: 'https://cloudflare-ipfs.com/ipfs/',
  dweb: 'https://dweb.link/ipfs/',
  ipfs: 'https://gateway.ipfs.io/ipfs/',
  infura: 'https://whitepaper.infura-ipfs.io/ipfs/',
};

/// Resolve IPFS Link
export const resolveLink = (url: string): string => {
  //Add Gateway
  if (url.includes('ipfs://')) url = url.replace('ipfs://', gateway.infura);
  return url;
};

/// Fetch File From IPFS by Hash (Works with JSON Filed)
export const fetchJSONFromIPFS = async (ipfsHash: string): Promise<any> => {
  const url = gateway.infura + ipfsHash;
  const response = await fetch(url);
  return await response.json();
};

///
export const loadJsonFromIPFS = async function (url: any): Promise<any> {
  const response = await axios.get(url);
  if (response.data.errors) {
    throw new Error(`Error loading json from IPFS: ${response.data.errors}`);
  }
  return response.data;
};

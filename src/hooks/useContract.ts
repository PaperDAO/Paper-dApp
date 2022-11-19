import detectEhereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers'
import { useEffect, useState } from 'react';
import NFT from '../abi/paper721.json';

/**
 * Hook for working with the contract
 */
export default function useContract() {
  const [contract, setContract] = useState<any>(null);
  
  const getContract = async (): Promise<any> => {
    //Vadliate
    if(!process.env.REACT_APP_CONTRACT_ADDRESS) throw new Error("Missing ENV:CONTRACT_ADDRESS")
    const provider:any  = await detectEhereumProvider();
    const ethProvider =  new ethers.providers.Web3Provider(provider)
    const signer: ethers.Signer = ethProvider.getSigner()
    return new ethers.Contract(
      process.env.REACT_APP_CONTRACT_ADDRESS,
      NFT.abi,
      signer
    );
  }

  useEffect(() => {
    getContract().then((res) => {
        setContract(res);
        console.warn("Got Contract", res, {proc:process.env});
    })
    .catch((error) => {
        console.error("Error Fetching Contract", error);
        setContract(null);
    });
  },[]);

  return { contract, getContract }
}

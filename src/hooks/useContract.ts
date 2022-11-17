import detectEhereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers'
import { useEffect, useState } from 'react';
import NFT from '../abi/paper721.json';
import { nftContractAddress } from "../config";
console.log("REACT_ENV_CONTRACT_ADDRESS", process.env.REACT_ENV_CONTRACT_ADDRESS);

/**
 * Hook for working with the contract
 */
export default function useContract() {
  const [contract, setContract] = useState<any>(null);
  
  const getContract = async () => {
    const provider:any  = await detectEhereumProvider();
    const ethProvider =  new ethers.providers.Web3Provider(provider)
    const signer: ethers.Signer = ethProvider.getSigner()
    const nftContract = new ethers.Contract(
      nftContractAddress,
      NFT.abi,
      signer
    );
  }

  useEffect(() => {
    getContract().then((res) => {setContract(res);
      console.warn("Got Contract", res);
    })
    .catch((error) => {
      console.error("Error Fetching Contract", error);
      setContract(null);
    });
  },[]);

  return { contract, getContract }
}

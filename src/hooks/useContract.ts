import detectEhereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers'
import { useEffect, useState } from 'react';
import NFT from '../abi/paper721.json';

/**
 * Hook for working with the contract
 */
export default function useContract() {
  const [contract, setContract] = useState<any>(null);
  
  /// Validation
  function validate() {
    // if (isNetworkChainIdCorrect === null) throw new NoWalletError();
    // if (!isNetworkChainIdCorrect) throw new WrongNetworkError();
  }

  const getContract = async (): Promise<any> => {
    validate();
    //Vadliate
    if(!process.env.REACT_APP_CONTRACT_ADDRESS) throw new Error("Missing ENV:CONTRACT_ADDRESS")
    
    //TODO: This should go on Context and this functions shouldn't be Async! 
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

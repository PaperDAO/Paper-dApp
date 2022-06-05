import detectEhereumProvider from '@metamask/detect-provider';
import { nftContractAddress } from './config'
import { ethers } from 'ethers'
import NFT from './Whitepaper.json';

export async function getSignContract(){
  const provider  = await detectEhereumProvider();
  const ethProvider =  new ethers.providers.Web3Provider(provider as any)

  const signer = ethProvider.getSigner()
  const nftContract = new ethers.Contract(
    nftContractAddress,
    NFT.abi,
    signer
  )

  return { signer, nftContract }
}
import detectEhereumProvider from '@metamask/detect-provider';
import { nftContractAddress } from './config'
import { ethers } from 'ethers'
import NFT from './Whitepaper.json';
import {Paper} from "./Router";
// @ts-ignore
import base64 from "base-64";

export async function getSignContract(){
  const provider:any  = await detectEhereumProvider();
  const ethProvider =  new ethers.providers.Web3Provider(provider)

  const signer: ethers.Signer = ethProvider.getSigner()
  const nftContract = new ethers.Contract(
    nftContractAddress,
    NFT.abi,
    signer
  )

  return { signer, nftContract }
}

export interface AssetMetaData {
  image_data: string;
  name: string;
}

export function getPaperMetadata(paper: Paper): AssetMetaData | null {
  const url = paper.paper;
  try {
    const splitedUrl = url.split("data:application/json;base64,")
    const base64string = splitedUrl[1]
    const decodedData = base64.decode(base64string);

    return JSON.parse(decodedData);
  }
  catch (e) {
    console.error(e)
    return  null
  }

}
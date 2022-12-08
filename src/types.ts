import { ethers } from 'ethers'

export interface TSignContact {
  signer:any;
  nftContract:ethers.Contract;
}

export interface AssetMetaData {
	image_data: string;
	name: string;
}
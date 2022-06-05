import { ethers } from 'ethers'

export interface TSignContact {
  signer:any;
  nftContract:ethers.Contract;
}
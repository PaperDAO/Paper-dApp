import { ethers } from 'ethers'

export interface TSignContact {
  signer:ethers.providers.JsonRpcSigner;
  nftContract:ethers.Contract;
}
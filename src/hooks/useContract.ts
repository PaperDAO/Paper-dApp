import { Contract } from 'ethers';

export default function useContract() {
  const contractAbi = ''; // add contract Abi
  
  function getContract(signerOrProvider:any) {
    return new Contract(
      process.env.NEXT_PUBLIC_AVATAR_NFT_CONTRACT_ADDRESS as string,
      contractAbi,
      signerOrProvider,
    );
  }
}
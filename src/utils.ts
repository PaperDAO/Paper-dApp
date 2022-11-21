import detectEhereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers'
import NFT from './abi/paper721.json';
import {Paper} from "./Router";
// @ts-ignore
import base64 from "base-64";

export const sliceAccount = (account: any) => {
    return (
        account &&
        `${account.slice(0, 6)}...${account.slice(
            account.length - 4,
            account.length,
        )}`
    );
};

// Checks if wallet is connected to the correct network
export const checkCorrectNetwork = async () => {
	const { ethereum } = window;
	let chainId = '';
	if (ethereum) {
		chainId = await ethereum.request({ method: 'eth_chainId' })
		console.log('Connected to chain:' + chainId)
	}
	return chainId === process.env.REACT_APP_NETWORK_ID;
}

export async function getContract(){
	//Vadliate
    if(!process.env.REACT_APP_CONTRACT_ADDRESS) throw new Error("Missing ENV:CONTRACT_ADDRESS")
    const provider:any  = await detectEhereumProvider();
	const ethProvider =  new ethers.providers.Web3Provider(provider)
	const signer: ethers.Signer = ethProvider.getSigner()
	const nftContract = new ethers.Contract(
		process.env.REACT_APP_CONTRACT_ADDRESS,
		NFT.abi,
		signer
	)
	return { signer, nftContract }
}

export interface AssetMetaData {
	image_data: string;
	name: string;
}

export function getPaperMetadata(paper: Paper): AssetMetaData | {} {
	const url = paper.paper;
	const splitedUrl = url.split("data:application/json;base64,")
	const base64string = splitedUrl[1]
	let decodedData = base64.decode(base64string);
	//Escape Special JSON Characters
	decodedData = decodedData.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
	try {
		return JSON.parse(decodedData);
	}
	catch (error) {
		console.error("Failed to parse JSON String:", {error, decodedData, base64string, paper});
		return {};
	}
}

export function isMobileDevice() {
	return 'ontouchstart' in window || 'onmsgesturechange' in window;
}

// based on this https://github.com/MetaMask/metamask-mobile/issues/3855
export function openMetaMaskUrl(url:string) {
	// const a = document.createElement("a");
	// a.href = url;
	// a.target = "_self";
	// document.body.appendChild(a);
	// a.click();
	// a.remove();
	window.location.href = url;
}
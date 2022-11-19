import axios from "axios";
import { Paper } from "../Router";

export const getOpenseaURL = (paper: Paper) => {
    return `https://testnets.opensea.io/assets/rinkeby/${process.env.REACT_APP_CONTRACT_ADDRESS}/${paper.id}`;
}

export const getOpenseaApiRequestURL = (paper: Paper) => {
    const network = 'testnet';
    const apiSubDomain = network === 'testnet' ? 'testnets-api' : 'api';
    return `https://${apiSubDomain}.opensea.io/api/v1/asset/${process.env.REACT_APP_CONTRACT_ADDRESS}/${paper.id}/?force_update=true`;
}

export const updateOpenseaMetadata = async (paper: Paper | undefined) => {
    if (!paper) return;
    const url = getOpenseaApiRequestURL(paper);
    try {
        await axios.get(url);
    } catch (error) {
        console.error(error);
    }
}
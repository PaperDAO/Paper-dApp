import React from 'react';
import  {request, gql} from "graphql-request"
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Landing from './pages/Landing';
import  Editor from './pages/Editor';
import Collection from './pages/Collection';
import {ethers} from "ethers";
import detectEhereumProvider from "@metamask/detect-provider";
import {useEthers} from "@usedapp/core";



const checkNetwork = async () => {
    let chainId = await (window as any).ethereum.request({ method: 'eth_chainId' })

    const rinkebyChainId = '0x4'

    if (chainId !== rinkebyChainId) {
        return 1
    } else {
        return 2
    }
}
const getConnectedAccount = async () => {
    const { ethereum } = window;
    if (ethereum) {
        console.log('Got the ethereum obejct: ', ethereum)
    } else {
        console.log('No Wallet found. Connect Wallet')
    }

    const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' })

    if (accounts.length !== 0) {
        console.log('Found authorized Account: ', accounts[0])
        return accounts[0];
    } else {
        console.log('No authorized account found')
    }
}

const AppRoutes: any = () => {


    const {data: userPapers, isLoading} =  useQuery('getUserAssets', async  () => {
        const user =await getConnectedAccount();
        const res = await request(
            "https://api.thegraph.com/subgraphs/name/paperdao/whitepaper",
            gql`
                query ($user: String) {
                  whitepapers(where:{owner: $user}) {
                      id
                      paper
                  }
                }`,
            {
                user
            },);
        return res.whitepapers;
    })
    return (
         <Router>
          <Routes>
          <Route
              path="/"
              element={<Landing />} />
          <Route
              path="/editor"
              element={<Editor />} />
          <Route
              path="/market"
              element={<Collection />} />
        </Routes>
      </Router>

);
}

export default AppRoutes;

import React from 'react';
import  {request, gql} from "graphql-request"
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Landing from './pages/Landing';
import  Editor from './pages/Editor';
import Collection from './pages/Collection';
import { ethers } from "ethers";
import detectEhereumProvider from "@metamask/detect-provider";
import { useEthers } from "@usedapp/core";
import {AssetMetaData, getPaperMetadata} from "./utils";


const getConnectedAccount = async () => {
    const { ethereum } = window;

    if (ethereum) {
        console.log('Got the ethereum obejct: ', ethereum)
    } else {
        console.log('No Wallet found. Connect Wallet')
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' })

    if (accounts.length !== 0) {
        console.log('Found authorized Account: ', accounts[0])
        return accounts[0];
    } else {
        console.log('No authorized account found')
    }
}

export interface Paper {
  id: string;
  paper:string;
  isEdited: boolean;
  metadata: AssetMetaData;
  paperTitle: string;
  paperContent: string;
}
interface AppData {
  numMinted: number;
  numEdited: number;
}
interface IAppContext {
  userPapers: Paper[] | undefined;
  refetchUserPapers: () => void;
  appData: AppData | undefined;
  refetchAppData: () => void;
}

export const AppContext = React.createContext<IAppContext>({
    userPapers: [],
    refetchUserPapers: () => {},
    appData: {
        numEdited: 0,
        numMinted: 0
    },
    refetchAppData: () => {}
});


const AppRoutes: any = () => {

    const {data: userPapers, refetch: refetchUserPapers} =  useQuery<Paper[]>('getUserAssets', async  () => {
        const user =await getConnectedAccount();
        const res = await request(
            "https://api.thegraph.com/subgraphs/name/paperdao/whitepaper",
            gql`
                query ($user: String) {
                  whitepapers(where:{owner: $user}) {
                      id
                      paper
                      isEdited
                      paperTitle
                      paperContent
                  }
                }`,
            {
                user
            },);

         let whitepapers = res.whitepapers;
        whitepapers =  whitepapers.map((paper: Paper) => {
            const metadata = getPaperMetadata(paper);

            return {
                ...paper,
                metadata: metadata || {}
            }
        })


        return whitepapers;
    })
    const {data: appData, refetch: refetchAppData} =  useQuery<AppData>('getAppData', async  () => {
        const res = await request(
            "https://api.thegraph.com/subgraphs/name/paperdao/whitepaper",
            gql`
                query {
                    appData(id: "app") {
                       numMinted 
                        numEdited
                      }
                }`,
            );
        return res?.appData || {numEdited: 0, numMinted:0};

    })


    return (
        <AppContext.Provider value={{userPapers: userPapers, refetchUserPapers, appData, refetchAppData}}>
                 <Router>
                  <Routes>
                  <Route
                      path="/"
                      element={<Landing />} />
                  <Route
                      path="/editor"
                      element={<Editor />} />
                  <Route
                      path="/collection"
                      element={<Collection />} />
                </Routes>
              </Router>
        </AppContext.Provider>

);
}

export default AppRoutes;

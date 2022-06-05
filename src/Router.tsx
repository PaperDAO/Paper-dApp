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

interface Paper {
    id: string
    papaer :string
    isEdited: boolean
}

interface AppData {
        numMinted: number;
        numEdited: number;

}
interface AppContext {
    userPapers: Paper[] | undefined
    refetchUserPapers: () => void
    appData: AppData | undefined
    refetchAppData: () => void
}
export const AppContext = React.createContext<AppContext>({
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
                  }
                }`,
            {
                user
            },);
        return res.whitepapers;
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

    // const {data: allPapers, isLoading: allPapersLoading, refetch: refetchAllPapers} =  useQuery('allWhitepapers', async  () => {
    //     let papers: Paper[] = [];
    //     let skip = 0;
    //     let done = false
    //     do {
    //         const res = await request(
    //             "https://api.thegraph.com/subgraphs/name/paperdao/whitepaper",
    //             gql`
    //             query ($first: Int, $skip: Int) {
    //               whitepapers(first: $first, skip: $skip) {
    //                   id
    //                   paper
    //               }
    //             }`,
    //             {
    //                 first: 1000,
    //                 skip
    //             });
    //
    //         if (res?.whitepapers?.length) {
    //             papers = [...papers, ...res.whitepapers];
    //             skip = res?.whitepapers?.length;
    //         }
    //         else {
    //             done = true
    //         }
    //     } while (!done);
    //
    //     return papers;
    //
    //
    // })


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

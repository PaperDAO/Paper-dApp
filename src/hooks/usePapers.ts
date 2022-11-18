import { useQuery } from "react-query";
import { gql, request } from 'graphql-request';
import { getPaperMetadata } from "../utils";
import { Paper } from "../Router";
import { useEffect, useState } from "react";

/**
 * Fetch Whitepapers from Subgraph
 */
export default function usePapers(first: number = 100, skip: number = 0): any {
    const [papers, setPapers] = useState<Array<Paper>>([]);
    const {
        data,
        isLoading,
        refetch,
    } = useQuery('get-all-white-papers', async (): Promise<any> => {
        if (!process.env.REACT_APP_THE_GRAPH_URL) return null;
        return request(
            process.env.REACT_APP_THE_GRAPH_URL,
            gql`
                    query ($first: Int, $skip: Int) {
                    whitepapers(first: $first, skip: $skip) {
                        id
                        paper
                        isEdited
                        paperTitle
                        paperContent
                        owner
                    }
                }
            `,
            {
                first,
                skip,
            },
            
        );
    });

    useEffect(() => {
        isLoading && setPapers([]);
        //Process Reqults
        let items = data?.whitepapers || [];
        items = items.map((paper: Paper) => {
            return {...paper, metadata:getPaperMetadata(paper)};
        });
        // console.log("usePapers() "+items.length+" Set Papers ", {items, isLoading, data});
        setPapers(items);
      },[data, isLoading]);

    return { 
        papers,
        isLoading,
        refetch
    };
}

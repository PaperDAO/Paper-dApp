import { useQuery } from "react-query";
import { gql, request } from 'graphql-request';
import { getPaperMetadata } from "../utils";
import { Paper } from "../Router";

/**
 * Fetch Whitepapers from Subgraph
 */
export default function usePapers(first: number = 100, skip: number = 0): any {
    const {
        data: papers,
        isLoading,
        refetch,
    } = useQuery('get-all-white-papers', async (): Promise<any> => {
        if (!process.env.REACT_APP_THE_GRAPH_URL) return null;
        const res = await request(
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
        //Process Reqults
        let items = res?.whitepapers || [];
        return items.map((paper: Paper) => ({...paper, metadata:getPaperMetadata(paper)}));
    });

    return { 
        papers,
        isLoading,
        refetch
    };
}

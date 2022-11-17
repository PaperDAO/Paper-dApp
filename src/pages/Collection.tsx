import React from 'react';
import { useState } from 'react';
import { SimpleGrid, Box } from '@chakra-ui/react';
import Layout from '../components/Layout';
import { Header, SubTextLfSm } from '../components/Typography';
import PaperModal from '../components/PaperModal';
// import { useEthers } from '@usedapp/core';
// import '@fontsource/inter';
import { gql, request } from 'graphql-request';
import { Paper } from '../Router';
import { useQuery } from 'react-query';
import { getPaperMetadata } from '../utils';
import { svgImageSrc } from '../helpers/svg';

const Collection: any = () => {
    // const { account, deactivate } = useEthers();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSvg, setSelectedSvg] = useState('');
    const [selectedItem, setSelectedItem] = useState('');

    const {
        data: allPapers,
        isLoading: allPapersLoading,
        refetch: refetchAllPapers,
    } = useQuery('get-all-white-papers', async () => {
        const res = await request(
            'https://api.thegraph.com/subgraphs/name/paperdao/whitepaper',
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
                first: 1000,
                skip: 0,
            },
        );

        let whitepapers = res?.whitepapers || [];
        whitepapers = whitepapers.map((paper: Paper) => {
            const metadata = getPaperMetadata(paper);
            return {
                ...paper,
                metadata: metadata || {},
            };
        });
        return whitepapers;
    });

    const onClose = () => setIsOpen(false);

    const onModalOpen = (item: any, svg: any) => {
        setSelectedItem(item);
        setSelectedSvg(svg);
        setIsOpen(true);
    };

    const sliceAccount = (account: any) => {
        return (
            account &&
            `${account.slice(0, 6)}...${account.slice(
                account.length - 4,
                account.length,
            )}`
        );
    };

    const renderSvgs = (): JSX.Element => {
        const images: any = [];
        allPapers?.forEach(
            (
                item: { metadata: any; owner: string; paperTitle: string },
                index: any,
            ) => {
                if (item?.metadata.image_data) {
                    const buff = Buffer.from(item?.metadata.image_data);
                    const base64data = buff.toString('base64');

                    images.push(
                        <Box
                            key={index}
                            w="250px"
                            pt={2}
                            onClick={() => onModalOpen(item, base64data)}
                        >
                            <Box cursor="pointer">
                                <SubTextLfSm>
                                    {item?.paperTitle || '[no title]'}
                                </SubTextLfSm>
                            </Box>
                            <img src={svgImageSrc(item?.metadata.image_data)} />
                            {/* <SubTextLfSm>
                                {sliceAccount(item.owner)}
                            </SubTextLfSm> */}
                        </Box>,
                    );
                }
            },
        );

        return (
            <SimpleGrid columns={[1, 2, 3, 4, 5]} gap={4}>
                {images}
            </SimpleGrid>
        );
    };

    console.log('allPapers', allPapers);
    return (
        <Layout>
            <Header>White Paper Collection</Header>
            <Box padding="30px">
                {!allPapersLoading && !!allPapers && renderSvgs()}
            </Box>
            <PaperModal
                onClose={onClose}
                isOpen={isOpen}
                data={selectedItem}
                svg={selectedSvg}
            />
        </Layout>
    );
};

export default Collection;

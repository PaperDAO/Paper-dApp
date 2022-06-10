import React from "react";
import { useState } from 'react';
import { ChakraProvider, SimpleGrid, Box, Flex, Button, Text, Link } from "@chakra-ui/react";
import theme from "../theme";
import Layout from "../components/Layout";
import { Header, SubTextLfSm } from "../components/Typography";
import PaperModal from "../components/PaperModal";
import { useEthers } from "@usedapp/core";
import "@fontsource/inter";
import {gql, request} from "graphql-request";
import {Paper} from "../Router";
import {useQuery} from "react-query";
import {getPaperMetadata} from "../utils";

const testSvgWp = `<svg width='2494' height='3523' viewBox='0 0 2494 3523' fill='none' xmlns='http://www.w3.org/2000/svg'> <g filter='url(#filter0_d_1815_20075)'> <path d='M0 0.5H2480V3508.5H184.642L0 3309.79V0.5Z' fill='white'/> <path d='M187.142 3309.79V3307.29H184.642H2.5V3H2477.5V3506H187.142V3309.79ZM182.142 3312.29V3502.14L5.73556 3312.29H182.142Z' stroke='#A3A1A1' stroke-width='5'/> </g> <defs> <filter id='filter0_d_1815_20075' x='0' y='0.5' width='2494' height='3522' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'> <feFlood flood-opacity='0' result='BackgroundImageFix'/><feColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/> <feOffset dx='10' dy='10'/><feGaussianBlur stdDeviation='2'/> <feComposite in2='hardAlpha' operator='out'/> <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'/> <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_1815_20075'/> <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_1815_20075' result='shape'/> </filter></defs><text x='200' y='250' font-family='Arial' font-size='53.3' fill='black'>wagdsfdhcgnvhjgchfsdadghfjghdgsfagshfgnfmncgdsf</text><text x='200' y='350' font-family='Arial' font-size='53.3' fill='black'>safdgfhgnmhgfgdfagfhdgjfsgdfhn</text></svg>`

const data = { owner: 'ownerAdressxxxxxx', svg: testSvgWp, title: 'paperTitle' }
const svgs = [data, data, data, data, data, data];

const Collection: any = () => {
  const { account, deactivate } = useEthers();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSvg, setSelectedSvg] = useState('');
  const [selectedItem, setSelectedItem] = useState('');

  const { data: allPapers, isLoading: allPapersLoading, refetch: refetchAllPapers } =  useQuery('get-all-white-papers', async  () => {
    const res = await request(
        "https://api.thegraph.com/subgraphs/name/paperdao/whitepaper",
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
        }`,
        {
            first: 1000,
            skip: 0
        });

       let whitepapers = res?.whitepapers || [];
        whitepapers =  whitepapers.map((paper: Paper) => {
            const metadata = getPaperMetadata(paper);

            return {
                ...paper,
                metadata: metadata || {}
            }
        });
    return whitepapers;
  })

  const onClose = () => {
    setIsOpen(false)
  }

  const onModalOpen = (item:any, svg:any) => {
    setSelectedItem(item)
    setSelectedSvg(svg)
    setIsOpen(true)
  };

  const sliceAccount = (account:any) => {
    return (account &&
      `${account.slice(0, 6)}...${account.slice(
        account.length - 4,
        account.length
      )}`
    )
  };
  
  const renderSvgs = () => {
    const images:any = [];
    allPapers?.forEach((item:{metadata:any,owner:string,paperTitle:string}, index:any) => {
      if (item?.metadata.image_data) {
        const buff = new Buffer(item?.metadata.image_data);
        const base64data = buff.toString('base64');

        images.push(
          <Box key={index} w='250px' pt={2} onClick={() => onModalOpen(item, base64data)}>
            <SubTextLfSm>{sliceAccount(item.owner)}</SubTextLfSm>
            <Box cursor="pointer" h='50px'>
              <SubTextLfSm>{item?.paperTitle || "[no title]"}</SubTextLfSm>
            </Box>
            <img src={`data:image/svg+xml;base64,${base64data}`} />
          </Box>
        )
      }
    })

    return (
      <SimpleGrid columns={[1, 2, 3, 4, 5]} gap={4}>
        {images}
      </SimpleGrid>
    )
  }

  console.log('allPapers', allPapers)
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Header>White Paper Collection</Header>
        <Box padding="30px">
          {!allPapersLoading && !!allPapers && renderSvgs()}
        </Box>
        <PaperModal onClose={onClose} isOpen={isOpen} data={selectedItem} svg={selectedSvg} />
      </Layout>
    </ChakraProvider>
  );
}

export default Collection;
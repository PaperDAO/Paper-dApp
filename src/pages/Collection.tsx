import React from "react";
import { useState } from 'react';
import { ChakraProvider, SimpleGrid, Box } from "@chakra-ui/react";
import theme from "../theme";
import Layout from "../components/Layout";
import { Header } from "../components/Typography";
import PaperModal from "../components/PaperModal";
import "@fontsource/inter";

const testSvgWp = `<svg width='2494' height='3523' viewBox='0 0 2494 3523' fill='none' xmlns='http://www.w3.org/2000/svg'> <g filter='url(#filter0_d_1815_20075)'> <path d='M0 0.5H2480V3508.5H184.642L0 3309.79V0.5Z' fill='white'/> <path d='M187.142 3309.79V3307.29H184.642H2.5V3H2477.5V3506H187.142V3309.79ZM182.142 3312.29V3502.14L5.73556 3312.29H182.142Z' stroke='#A3A1A1' stroke-width='5'/> </g> <defs> <filter id='filter0_d_1815_20075' x='0' y='0.5' width='2494' height='3522' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'> <feFlood flood-opacity='0' result='BackgroundImageFix'/><feColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/> <feOffset dx='10' dy='10'/><feGaussianBlur stdDeviation='2'/> <feComposite in2='hardAlpha' operator='out'/> <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'/> <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_1815_20075'/> <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_1815_20075' result='shape'/> </filter></defs><text x='200' y='250' font-family='Arial' font-size='53.3' fill='black'>wagdsfdhcgnvhjgchfsdadghfjghdgsfagshfgnfmncgdsf</text><text x='200' y='350' font-family='Arial' font-size='53.3' fill='black'>safdgfhgnmhgfgdfagfhdgjfsgdfhn</text></svg>`

const svgs = [testSvgWp, testSvgWp, testSvgWp, testSvgWp, testSvgWp, testSvgWp];

const Collection: any = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSvg, setSelectedSvg] = useState('');

  const onClose = () => {
    setIsOpen(false)
  }

  const onModalOpen = (svg:any) => {
    setSelectedSvg(svg)
    setIsOpen(true)
  }

  const renderSvgs = (
    <SimpleGrid columns={4} gap={8}>
    {svgs.map((item, index) => {
      const buff = new Buffer(item);
      const base64data = buff.toString('base64');
      return (
        <Box key={index} w='200px' onClick={() => onModalOpen(base64data)}>
          <img src={`data:image/svg+xml;base64,${base64data}`} />
        </Box>
      )
    })}
    </SimpleGrid>
  )


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
    <ChakraProvider theme={theme}>
      <Layout>
        <Header>Collection</Header>
        <Box padding="30px">
          {renderSvgs}
        </Box>
        <PaperModal onClose={onClose} isOpen={isOpen} svg={selectedSvg} />
      </Layout>
    </ChakraProvider>
  );
}

export default Collection;
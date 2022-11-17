import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Box, Input, Select, Textarea } from '@chakra-ui/react';
import theme from '../theme';
import Layout from '../components/Layout';
import {
    Header,
    LinkText,
    MintedText,
    MintStatusText,
    SubText,
} from '../components/Typography';
import ActionButton from '../components/ActionButton';
// import { getContract} from "../utils";
import { AppContext, Paper } from '../Router';
import '@fontsource/inter';
import { makeSVG, textToArray, svgImageSrc } from '../helpers/svg';
import useContract from '../hooks/useContract';

const Title = styled.div`
    color: #cacbcc;
    font-size: 34px;
    font-weight: 700;
    text-align: center;
`;

function getOpenseaApiRequestURL(paper: Paper) {
    const network = 'testnet';
    const apiSubDomain = network === 'testnet' ? 'testnets-api' : 'api';
    return `https://${apiSubDomain}.opensea.io/api/v1/asset/${process.env.REACT_APP_CONTRACT_ADDRESS}/${paper.id}/?force_update=true`;
}

function getOpenseaURL(paper: Paper) {
    return `https://testnets.opensea.io/assets/rinkeby/${process.env.REACT_APP_CONTRACT_ADDRESS}/${paper.id}`;
}

async function updateOpenseanMetadata(paper: Paper | undefined) {
    if (!paper) return;
    const url = getOpenseaApiRequestURL(paper);
    try {
        await axios.get(url);
    } catch (error) {
        console.error(error);
    }
}

/**
 * Create a new on-chain document
 */
const Write = () => {
    const { getContract } = useContract();
    const [value, setValue] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [pageName, setPageName] = useState('');
    const [miningStatusMsg, setMiningStatusMsg] = useState('');
    const [resultMsg, setResultMsg] = useState('');
    const { userPapers, appData, refetchAppData, refetchUserPapers } =
        useContext(AppContext);
    const [currentTokenId, setCurrentTokenId] = useState<string>();
    const MAX_LINES = 31; //Max lines in a single page

    const currentPaper = !!userPapers?.length
        ? userPapers.find(
              (paper: Paper) => paper.id === currentTokenId?.toString(),
          )
        : undefined;
    const handlePageNameChanged = (e: any) => setPageName(e.target.value);
    const handleInputChange = (e: any) => setValue(e.target.value);

    const handleWriteAction = async (): Promise<void> => {
        let valueArray = textToArray(value, MAX_LINES);
        const nftContract: any = await getContract();
        // const { nftContract }: TSignContact = await getContract();
        console.log('Contract: ' + nftContract, { proc: process.env });
        if (!nftContract) {
            console.error('Contract not (yet) available');
            return;
        }
        let nftTx = await nftContract.typewrite(
            Number(currentTokenId),
            pageName,
            valueArray,
        );
        setMiningStatusMsg(`Writing to blockchain....`);
        await nftTx.wait(2);
        refetchAppData();
        refetchUserPapers();
        updateOpenseanMetadata(currentPaper);
        setMiningStatusMsg('');
        setResultMsg(`Written!`);
        setValue('');
        setPageName('');
    };

    const handleWhitepaperSelected = (event: any) => {
        setMiningStatusMsg('');
        setCurrentTokenId(event.target.value);
    };

    useEffect(() => {
        if (userPapers?.length === 1) {
            setCurrentTokenId('1');
        }
    }, [userPapers]);

    const RenderSvg = ({ image_data }: { image_data: string }) => {
        if (!image_data) return null;
        const buff = Buffer.from(image_data);
        const base64data = buff.toString('base64');
        return <img src={`data:image/svg+xml;base64,${base64data}`} />;
    };

    return (
        <Layout>
            <Header>The Typewriter</Header>
            <MintedText>{appData?.numEdited || 0}/10000 written</MintedText>

            <Select
                borderWidth="3px"
                maxWidth="550px"
                placeholder="Select a White Paper"
                onChange={handleWhitepaperSelected}
                value={currentTokenId}
            >
                {userPapers?.length &&
                    userPapers.map((paper) => (
                        <option key={paper.id} value={paper.id}>
                            Whitepaper #{paper.id}{' '}
                            {!!paper.paperTitle && ` - ${paper.paperTitle}`}
                        </option>
                    ))}
            </Select>
            <Box maxWidth="550px">
                <Input
                    fontSize="14px"
                    marginTop="20px"
                    width="550px"
                    borderWidth="3px"
                    value={pageName}
                    _hover={{
                        borderColor: 'blue.100',
                    }}
                    _active={{
                        borderColor: 'blue.100',
                    }}
                    _focus={{
                        borderColor: 'blue.100',
                    }}
                    placeholder={'Paper title'}
                    onChange={handlePageNameChanged}
                />
                <Textarea
                    height="700px"
                    fontSize="14px"
                    marginTop="20px"
                    width="550px"
                    borderWidth="3px"
                    style={{
                        whiteSpace: 'pre-wrap',
                        borderColor: isValid ? 'inherit' : 'red',
                    }}
                    value={value}
                    _hover={{
                        borderColor: 'blue.100',
                    }}
                    _active={{
                        borderColor: 'blue.100',
                    }}
                    _focus={{
                        borderColor: 'blue.100',
                    }}
                    color="gray.500"
                    onChange={handleInputChange}
                    onKeyUp={(evt: any) => {
                        let lineCount =
                            evt.target.value.split(/\r\n|\r|\n/).length;
                        setIsValid(lineCount <= MAX_LINES);
                    }}
                    placeholder="Text editor"
                ></Textarea>

                <Box>
                    * Immutable: Once written, this paper can never be changed!
                </Box>

                <Box marginBottom="40px" textAlign="center" mt="6">
                    <ActionButton
                        handleAction={handleWriteAction}
                        width="300px"
                        text="Write to the blockchain"
                    />
                </Box>
                {!!miningStatusMsg && (
                    <MintStatusText>{miningStatusMsg}</MintStatusText>
                )}
                {!!resultMsg && <SubText>{resultMsg}</SubText>}
            </Box>
            <Box>
                BOX
                <img
                    width="500"
                    src={svgImageSrc(
                        makeSVG([
                            'line 1',
                            '',
                            '       line 3',
                            '...     ...  line 4',
                        ]),
                    )}
                />
            </Box>
        </Layout>
    );
};
export default Write;

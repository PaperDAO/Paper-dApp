import { useContext, useEffect } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { flatten } from 'lodash';
import { Box, Input, Select, Link, Textarea } from '@chakra-ui/react';
import Layout from '../components/Layout';
import {
    Header,
    LinkText,
    MintedText,
    MintStatusText,
    SubText,
} from '../components/Typography';
import ActionButton from '../components/ActionButton';
import { getContract } from '../utils';
import { AppContext, Paper } from '../Router';
import type { TSignContact } from '../types';
import '@fontsource/inter';
import { getOpenseaURL, updateOpenseaMetadata } from '../helpers/opensea';

const Title = styled.div`
    color: #cacbcc;
    font-size: 34px;
    font-weight: 700;
    text-align: center;
`;

const Editor = () => {
    const [value, setValue] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [pageName, setPageName] = useState('');
    const [miningStatusMsg, setMiningStatusMsg] = useState('');
    const [resultMsg, setResultMsg] = useState('');
    const { userPapers, appData, refetchAppData, refetchUserPapers } =
        useContext(AppContext);
    const [currentTokenId, setCurrentTokenId] = useState<string>();
    const MAX_LINES = 31;

    const handleInputChange = (e: any) => {
        let inputValue = e.target.value;
        setValue(inputValue);
    };

    const handlePageNameChanged = (e: any) => {
        setPageName(e.target.value);
    };

    const currentPaper = !!userPapers?.length
        ? userPapers.find(
              (paper: Paper) => paper.id === currentTokenId?.toString(),
          )
        : undefined;

    const handleWriteAction = async () => {
        let valueArray = value.split('\n');
        valueArray = flatten(
            valueArray.map((line) =>
                !line ? ' ' : line.replace(/(.{89})/g, '$1\n').split('\n'),
            ),
        );

        if (valueArray.length > MAX_LINES) {
            setMiningStatusMsg(`Max ${MAX_LINES} Lines is allowed`);
            return;
        }

        const { nftContract }: TSignContact = await getContract();
        let nftTx = await nftContract.typewrite(
            Number(currentTokenId),
            pageName,
            valueArray,
        );
        setMiningStatusMsg(`Writing to blockchain....`);
        await nftTx.wait(2);
        refetchAppData();
        refetchUserPapers();
        updateOpenseaMetadata(currentPaper);
        setMiningStatusMsg('');
        setResultMsg(`Written!`);
        setValue('');
        setPageName('');
    };

    function handleWhitepaperSelected(event: any) {
        setMiningStatusMsg('');
        setCurrentTokenId(event.target.value);
    }

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

            {currentPaper?.isEdited && (
                <Box maxWidth="550px" mt={4} onClick={() => {}}>
                    <Title>{currentPaper?.paperTitle}</Title>
                    <RenderSvg image_data={currentPaper.metadata?.image_data} />
                    <Link
                        href={getOpenseaURL(currentPaper)}
                        isExternal
                        lineHeight={10}
                        _hover={{
                            color: 'gray.300',
                            textDecoration: 'underline',
                        }}
                    >
                        <LinkText>View on OpenSea</LinkText>
                    </Link>
                </Box>
            )}

            {currentPaper && !currentPaper.isEdited && (
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
                            let lines =
                                evt.target.value.split(/\r\n|\r|\n/).length;
                            setIsValid(lines <= MAX_LINES);
                        }}
                        placeholder="Text editor"
                    ></Textarea>

                    <Box>
                        * Immutable: Once written, this paper can never be
                        changed!
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
            )}
        </Layout>
    );
};
export default Editor;

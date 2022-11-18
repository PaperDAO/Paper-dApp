import { useState } from 'react';
import { SimpleGrid, Box } from '@chakra-ui/react';
import Layout from '../components/Layout';
import { Header, SubTextLfSm } from '../components/Typography';
import PaperModal from '../components/PaperModal';
// import { useEthers } from '@usedapp/core';
// import '@fontsource/inter';
import { svgImageSrc } from '../helpers/svg';
import usePapers from '../hooks/usePapers';

const Collection: any = () => {
    // const { account, deactivate } = useEthers();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSvg, setSelectedSvg] = useState('');
    const [selectedItem, setSelectedItem] = useState('');
    const { isLoading, papers } = usePapers(12);

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

    return (
        <Layout>
            <Header>White Paper Collection</Header>
            <Box padding="30px">
                {!isLoading && !!papers && (
                    <SimpleGrid columns={[1, 2, 3, 4, 5]} gap={4}>
                        {papers?.map(
                            (
                                item: {
                                    metadata: any;
                                    owner: string;
                                    paperTitle: string;
                                },
                                index: any,
                            ) => {
                                if (item?.metadata.image_data) {
                                    const buff = Buffer.from(
                                        item?.metadata.image_data,
                                    );
                                    const base64data = buff.toString('base64');
                                    const image = (
                                        <img
                                            src={svgImageSrc(
                                                item?.metadata.image_data,
                                            )}
                                        />
                                    );
                                    return (
                                        <Box
                                            key={index}
                                            w="250px"
                                            pt={2}
                                            onClick={() =>
                                                onModalOpen(item, base64data)
                                            }
                                        >
                                            <Box cursor="pointer">
                                                <SubTextLfSm>
                                                    {item?.paperTitle ||
                                                        '[no title]'}
                                                </SubTextLfSm>
                                            </Box>
                                            {image}
                                            {/* <SubTextLfSm>
                                                {sliceAccount(item.owner)}
                                            </SubTextLfSm> */}
                                        </Box>
                                    );
                                }
                            },
                        )}
                    </SimpleGrid>
                )}
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

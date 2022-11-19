import Layout from '../components/Layout';
import { Header, SubTextLfSm } from '../components/Typography';
// import { useEthers } from '@usedapp/core';
// import '@fontsource/inter';
import PapersGrid from '../components/PapersGrid';

const Collection: any = () => {
    // const { account, deactivate } = useEthers();

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
            <PapersGrid />
        </Layout>
    );
};

export default Collection;

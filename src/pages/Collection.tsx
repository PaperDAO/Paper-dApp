import Layout from '../components/Layout';
import { Header, SubTextLfSm } from '../components/Typography';
// import { useEthers } from '@usedapp/core';
// import '@fontsource/inter';
import PapersGrid from '../components/PapersGrid';

const Collection: any = () => {
    // const { account, deactivate } = useEthers();
    return (
        <Layout>
            <Header>White Paper Collection</Header>
            <PapersGrid />
        </Layout>
    );
};

export default Collection;

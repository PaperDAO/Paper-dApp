import { create } from 'ipfs-http-client';

/**
 * Hook for work with IPFS.
 */
export default function useIpfs() {
  //Validate
  if (
    !process.env.REACT_APP_INFURA_PROJECT_ID ||
    !process.env.REACT_APP_INFURA_SECRET
  )
    console.error('Missing Infura API Data');

  // eslint-disable-next-line prettier/prettier
  const auth = 'Basic ' + Buffer.from(process.env.REACT_APP_INFURA_PROJECT_ID + ':' + process.env.REACT_APP_INFURA_SECRET).toString('base64');
  const infuraClient = create({
    // url: process.env.REACT_APP_INFURA_IPFS_API,
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  });
  const theGraphClient = create({
    url: process.env.REACT_APP_THE_GRAPH_IPFS_API,
  });

  const uploadFileToIPFS = async function (file: any) {
    const created = await infuraClient.add({
      path: '',
      content: file,
    });
    const cid = created.path;
    const url = `ipfs://${cid}`;
    return { cid, url };
  };

  const uploadJsonToIPFS = async function (json: any) {
    const jsonString = JSON.stringify(json);
    // Upload to the graph for usage in graph queries
    theGraphClient
      .add(jsonString)
      .catch((error) => console.error('Failed to save file to Graph IPFS', error));
    // Upload to IPFS via infura
    const created = await infuraClient.add(jsonString);
    const cid = created.path;
    const url = `ipfs://${cid}`;
    return { cid, url };
  };

  return { uploadFileToIPFS, uploadJsonToIPFS };
}

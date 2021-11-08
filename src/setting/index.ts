const requireEnv = (name: string): string => {
  const env = process.env[name];
  if (!env) {
    throw new Error(`[requireEnv]: ${name} is not set`);
  }
  return env;
};

export default {
  // ETH_CHAIN_ID: requireEnv('REACT_APP_ETH_CHAIN_ID'),
  // BSC_CHAIN_ID: requireEnv('REACT_APP_BSC_CHAIN_ID'),
  // ETH_SWAP_AGENT_CONTRACT: requireEnv('REACT_APP_ETH_SWAP_AGENT_CONTRACT'),
  // BSC_SWAP_AGENT_CONTRACT: requireEnv('REACT_APP_BSC_SWAP_AGENT_CONTRACT'),
  ETH_SWAP_AGENT_CONTRACT: '0x4e3df2073bf4b43B9944b8e5A463b1E185D6448C',
  BSC_SWAP_AGENT_CONTRACT: '0x51a240271AB8AB9f9a21C82d9a85396b704E164d',
  ETH_CHAIN_ID: 1000,
  BSC_CHAIN_ID: 2000,
  COVALENT_API_KEY: requireEnv('REACT_APP_COVALENT_API_KEY'),
  API_URL: requireEnv('REACT_APP_API_URL'),
};

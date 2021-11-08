const requireEnv = (name: string): string => {
  const env = process.env[name];
  if (!env) {
    throw new Error(`[requireEnv]: ${name} is not set`);
  }
  return env;
};

export default {
  ETH_CHAIN_ID: requireEnv('REACT_APP_ETH_CHAIN_ID'),
  BSC_CHAIN_ID: requireEnv('REACT_APP_BSC_CHAIN_ID'),
  // ETH_CHAIN_ID: 1000,
  // BSC_CHAIN_ID: 2000,
  COVALENT_API_KEY: requireEnv('REACT_APP_COVALENT_API_KEY'),
  API_URL: requireEnv('REACT_APP_API_URL'),
};

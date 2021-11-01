const requireEnv = (name: string): string => {
  const env = process.env[name];
  if (!env) {
    throw new Error(`[requireEnv]: ${name} is not set`);
  }
  return env;
};

export default {
  REACT_APP_ETH_CHAIN_ID: requireEnv('REACT_APP_ETH_CHAIN_ID'),
  REACT_APP_BSC_CHAIN_ID: requireEnv('REACT_APP_BSC_CHAIN_ID'),
  REACT_APP_COVALENT_API_KEY: requireEnv('REACT_APP_COVALENT_API_KEY'),
};

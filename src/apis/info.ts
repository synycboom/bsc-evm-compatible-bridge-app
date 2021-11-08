import axios from 'axios';
import { InfoData } from 'src/interfaces/nft';
import setting from 'src/setting';

export const getInfo = async () => {
  const url = `${setting.API_URL}/v1/info`;
  const response = await axios.get<InfoData>(url);
  return response.data;
};

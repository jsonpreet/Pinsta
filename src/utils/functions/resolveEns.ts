
import { ENS_RESOLVER_WORKER_URL } from '@utils/constants';
import axios from 'axios';

export const resolveEns = async (addresses: string[]) => {
	const payload = JSON.stringify({
    addresses: addresses.map((address) => {
      return address.split("/")[0];
    }),
  });
  const response = await axios.post(ENS_RESOLVER_WORKER_URL, payload, {
    headers: {
      "Content-Type": "application/json",
    },
	});
  return response.data.ensNames;
};
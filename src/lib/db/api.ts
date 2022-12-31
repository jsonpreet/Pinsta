import axios from '@utils/axios';
import { PINSTA_API_URL } from '@utils/constants';

export const getUserBoards = async ({ queryKey }: any) => {
    const [_key, { user }] = queryKey
    const { data } = await axios.get(`${PINSTA_API_URL}/boards?type=profile&id=${user}`);
    return data;
}

export const getBoardPins = async ({ queryKey }: any) => {
    const [_key, { boardId }] = queryKey
    const { data } = await axios.get(`${PINSTA_API_URL}/pins?type=board&id=${boardId}`);
    return data;
}

export const getProfileBoardPins = async ({ queryKey }: any) => {
    const [_key, { boardId, profileId }] = queryKey
    const { data } = await axios.get(`${PINSTA_API_URL}/pins?type=profileBoard&id=${boardId}&profile=${profileId}`);
    return data;
}

export const getProfilePins = async ({ queryKey }: any) => {
    const [_key, { user }] = queryKey
    const { data } = await axios.get(`${PINSTA_API_URL}/pins?type=profile&id=${user}`);
    return data;
}
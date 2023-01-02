import axios from '@utils/axios';

export const getUserBoards = async ({ queryKey }: any) => {
    const [_key, { user }] = queryKey
    const { data } = await axios.get(`/boards?type=profile&id=${user}`);
    return data;
}

export const getBoardPins = async ({ queryKey }: any) => {
    const [_key, { boardId }] = queryKey
    const { data } = await axios.get(`/pins?type=board&id=${boardId}`);
    return data;
}

export const getProfileBoardPins = async ({ queryKey }: any) => {
    const [_key, { boardId, profileId }] = queryKey
    const { data } = await axios.get(`/pins?type=profileBoard&id=${boardId}&profile=${profileId}`);
    return data;
}

export const getProfilePins = async ({ queryKey }: any) => {
    const [_key, { user }] = queryKey
    const { data } = await axios.get(`/pins?type=profile&id=${user}`);
    return data;
}

export const getBoard = async (getBoardId: string) => {
    const { data } = await axios.get(`/boards?type=board&id=${getBoardId}`);
    return data;
}

export const directCheckSavedPin = async ({ user, pinId } : any) => {
    const { data } = await axios.get(`/pins?type=checkSaved&pin=${pinId}&id=${user}`);
    return data;
}

export const checkSavedPin = async ({ queryKey } : any) => {
    const [_key, { user, pinId }] = queryKey
    const { data } = await axios.get(`/pins?type=checkSaved&pin=${pinId}&id=${user}`);
    return data;
}
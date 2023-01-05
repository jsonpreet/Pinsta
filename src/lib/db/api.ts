import axios from '@utils/axios';

export const getUserBoards = async ({ queryKey }: any) => {
    const [_key, { user }] = queryKey
    
    const request = {
        user_id: user
    }
    const { data } = await axios.post(`/profile-boards`, request);
    return data;
}

export const getBoardPins = async ({ queryKey }: any) => {
    const [_key, { boardId }] = queryKey
    const request = {
        board_id: boardId
    }
    const { data } = await axios.post(`/pins/board`, request);
    return data;
}

export const getProfileBoardPins = async ({ queryKey }: any) => {
    const [_key, { boardId, profileId }] = queryKey
    const request = {
        board_id: boardId,
        user_id: profileId
    }
    const { data } = await axios.post(`/profile-board-pins`, request);
    return data.data;
}

export const getProfilePins = async ({ queryKey }: any) => {
    const [_key, { user }] = queryKey
    const request = {
        user_id: user
    }
    const { data } = await axios.post(`/profile-pins`, request);
    return data;
}

export const getBoard = async (getBoardId: string) => {
    const request = {
        board_id: getBoardId
    }
    const { data } = await axios.post(`/board`, request);
    return data;
}

export const directCheckSavedPin = async ({ user, pinId }: any) => {
    const request = {
        post_id: pinId,
        user_id: user
    }
    const { data } = await axios.post(`/check-saved-pin`, request);
    return data;
}

export const checkSavedPin = async ({ queryKey } : any) => {
    const [_key, { user, pinId }] = queryKey
    const request = {
        post_id: pinId,
        user_id: user
    }
    const { data } = await axios.post(`/check-saved-pin`, request);
    return data;
}

export const getBoardBySlug = async (slug: string) => {
    const request = {
        slug: slug
    }
    const { data } = await axios.post(`/board-by-slug`, request);
    return data;
}

// export const getBoardBySlug = async ({ queryKey } : any) => {
//     const [_key, { slug }] = queryKey
//     const { data } = await axios.get(`/boards?type=boardBySlug&slug=${slug}`);
//     return data;
// }
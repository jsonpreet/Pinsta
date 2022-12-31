import { useQuery } from "@tanstack/react-query";
import * as api from './api';

export const FetchProfileBoards = (user : any) => {
    return useQuery([['profile_boards', user], { user }], api.getUserBoards,
        {
            enabled: !!user,
            keepPreviousData: true,
        }
    )
}

export const FetchBoardPins = (boardId : string) => {
    return useQuery([['board_pins', boardId], { boardId }], api.getBoardPins,
        {
            enabled: !!boardId,
            keepPreviousData: true,
        }
    )
}

export const FetchProfileBoardPins = (boardId : string, profileId : string) => {
    return useQuery([['profile_board_pins', `${boardId}_${profileId}`], { boardId, profileId }], api.getProfileBoardPins,
        {
            enabled: !!boardId,
            keepPreviousData: true,
        }
    )
}

export const FetchProfilePins = (user : any) => {
    return useQuery([['profile_pins', user], { user }], api.getProfilePins,
        {
            enabled: !!user,
            keepPreviousData: true,
        }
    )
}
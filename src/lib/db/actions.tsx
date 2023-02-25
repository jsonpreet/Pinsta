import { useQuery } from "@tanstack/react-query";
import * as api from './api';

export const FetchProfileBoards = (user : string | null) => {
    return useQuery([['profile_boards', user], { user }], api.getUserBoards,
        {
            enabled: !!user,
            keepPreviousData: true,
        }
    )
}

export const FetchTotalBoards = () => {
    return useQuery(['total_boards'], api.getTotalBoards,
        {
            keepPreviousData: true,
        }
    )
}

export const FetchTotalPins = () => {
    return useQuery(['total_pins'], api.getTotalPins,
        {
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

export const FetchProfilePins = (user : string) => {
    return useQuery([['profile_pins', user], { user }], api.getProfilePins,
        {
            enabled: !!user,
            keepPreviousData: true,
        }
    )
}

// export const FetchBoardBySlug = (slug : string) => {
//     return useQuery([['board', slug], { slug }], api.getBoardBySlug,
//         {
//             enabled: !!slug,
//             keepPreviousData: true,
//         }
//     )
// }

export const CheckSavedPin = (user : string | null, pinId: string) => {
    return useQuery([['saved_pin', `${user}_${pinId}`], { user, pinId }], api.checkSavedPin,
        {
            enabled: !!user,
            keepPreviousData: true,
        }
    )
}
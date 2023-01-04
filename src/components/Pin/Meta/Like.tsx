import { PinstaPublication } from "@utils/custom-types";
import dayjs from "dayjs";
import { FC, useState } from "react";
import { HiHeart, HiOutlineHeart } from "react-icons/hi"
import relativeTime from 'dayjs/plugin/relativeTime'
import { useAppStore } from '@lib/store';
import { useRouter } from "next/router";
import { ApolloCache } from "@apollo/client";
import { ReactionTypes, useAddReactionMutation, useRemoveReactionMutation } from "@utils/lens/generated";
import { toast } from "react-hot-toast";
import onError from "@utils/functions/onError";
import { SIGN_IN_REQUIRED_MESSAGE } from "@utils/constants";
import { publicationKeyFields } from "@utils/functions/publicationKeyFields";
import { motion } from 'framer-motion';

dayjs.extend(relativeTime)

type Props = {
    pin: PinstaPublication
    isComment?: boolean
}

const Like: FC<Props> = ({ pin, isComment = false }) => {
    const currentProfile = useAppStore((state) => state.currentProfile);
    const { pathname } = useRouter();
    const [liked, setLiked] = useState(pin?.reaction === 'UPVOTE');
    const [count, setCount] = useState(pin?.stats?.totalUpvotes);

    const updateCache = (cache: ApolloCache<any>, type: ReactionTypes.Upvote | ReactionTypes.Downvote) => {
        if (pathname === '/pin/[id]') {
        cache.modify({
            id: publicationKeyFields(pin),
            fields: {
            stats: (stats) => ({
                ...stats,
                totalUpvotes: type === ReactionTypes.Upvote ? stats.totalUpvotes + 1 : stats.totalUpvotes - 1
            })
            }
        });
        }
    };

    const [addReaction] = useAddReactionMutation({
        onCompleted: () => {
            
        },
        onError: (error) => {
            setLiked(!liked);
            setCount(count - 1);
            onError(error);
        },
        update: (cache) => updateCache(cache, ReactionTypes.Upvote)
    });

    const [removeReaction] = useRemoveReactionMutation({
        onCompleted: () => {
            
        },
        onError: (error) => {
            setLiked(!liked);
            setCount(count + 1);
            onError(error);
        },
        update: (cache) => updateCache(cache, ReactionTypes.Downvote)
    });

    const createLike = () => {
        if (!currentProfile) {
            return toast.error(SIGN_IN_REQUIRED_MESSAGE);
        }

        const variable = {
            variables: {
                request: {
                    profileId: currentProfile?.id,
                    reaction: ReactionTypes.Upvote,
                    publicationId: pin?.id
                }
            }
        };

        if (liked) {
            setLiked(false);
            setCount(count - 1);
            removeReaction(variable);
        } else {
            setLiked(true);
            setCount(count + 1);
            addReaction(variable);
        }
    };

    return (
        <>
            <motion.button whileTap={{ scale: 0.9 }} onClick={createLike} aria-label="Like">
                <div className="flex flex-row justify-center items-center">
                    {liked ?
                        <HiHeart className='text-red-500' size={isComment ? 15 : 20} />
                        :
                        <HiOutlineHeart size={isComment ? 15 : 20} />
                    }
                    <span className={`ml-1 ${isComment ? `text-xs` : `text-base`}`}>{count}</span>
                </div>                
            </motion.button>
        </>

    )
}

export default Like
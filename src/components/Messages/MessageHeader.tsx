import Follow from "@components/Common/Follow";
import Unfollow from "@components/Common/Unfollow";
import UserProfile from "@components/Common/UserProfile";
import { useMessageStore } from "@lib/store/message";
import { AVATAR } from "@utils/constants";
import formatAddress from "@utils/functions/formatAddress";
import formatHandle from "@utils/functions/formatHandle";
import getProfilePicture from "@utils/functions/getProfilePicture";
import getStampFyiURL from "@utils/functions/getStampFyiURL";
import type { Profile } from "@utils/lens";
import Image from "next/image";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { BiChevronLeft } from "react-icons/bi";

interface Props {
  profile?: Profile;
  conversationKey: string;
}

const MessageHeader: FC<Props> = ({ profile, conversationKey }) => {
  const router = useRouter();
  const [following, setFollowing] = useState(true);
  const ensNames = useMessageStore((state) => state.ensNames);
  const ensName = ensNames.get(conversationKey?.split("/")[0] ?? "");
  const url =
    (ensName && getStampFyiURL(conversationKey?.split("/")[0] ?? "")) ?? "";

  const onBackClick = () => {
    router.push("/messages");
  };

  useEffect(() => {
    setFollowing(profile?.isFollowedByMe ?? false);
  }, [profile?.isFollowedByMe, profile]);

  if (!profile && !conversationKey) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-b-[1px] px-4 py-2 dark:border-gray-700">
      <div className="flex items-center">
        <BiChevronLeft
          onClick={onBackClick}
          className="mr-1 h-6 w-6 cursor-pointer lg:hidden"
        />
        {profile ? (
          <UserProfile profile={profile} />
        ) : (
          <>
            <Image
              // @ts-ignore
              src={ensName ? url : getProfilePicture(profile, AVATAR)}
              loading="lazy"
              className="mr-4 h-10 w-10 rounded-full border bg-gray-200 dark:border-gray-700"
              height={40}
              width={40}
              alt={formatHandle("")}
            />
            {ensName ?? formatAddress(conversationKey.split('/')[0] ?? "")}
          </>
        )}
			</div>
			{profile && (
				<>
					{!following ? (
						<Follow showText profile={profile} setFollowing={setFollowing} />
					) : (
						<Unfollow showText profile={profile} setFollowing={setFollowing} />
					)}
				</>
			)}
    </div>
  );
};

export default MessageHeader;

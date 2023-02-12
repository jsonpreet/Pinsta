import MetaTags from '@components/Common/MetaTags';
import { Card } from '@components/UI/Card';
import { APP } from '@utils/constants';
import type { NextPage } from 'next';
import Custom404 from 'src/pages/404';

import PreviewList from './PreviewList';
import useAppStore from '@lib/store';

const NoConversationSelected = () => {
    return (
        <div className="flex h-full flex-col text-center">
            <div className="m-auto">
                <span className="text-center text-5xl">👋</span>
                <h3 className="mt-3 mb-2 text-lg">
                    Select a conversation
                </h3>
                <p className="text-md lt-text-gray-500 max-w-xs">
                    Choose an existing conversation or create a new one to start messaging
                </p>
            </div>
        </div>
    );
};

const Messages: NextPage = () => {

    const currentProfile = useAppStore((state) => state.currentProfile);

    if (!currentProfile) {
        return <Custom404 />;
    }

    return (
        <>
            <MetaTags title={`Messages :: ${APP.Name}`} />
            <div className="flex w-full md:max-w-5xl mx-auto">
                <PreviewList />
                <div className="xs:hidden sm:hidden sm:h-[76vh] md:w-3/4 md:hidden md:h-[80vh] lg:block xl:h-[84vh]">
                    <Card className="h-full !rounded-tr-xl !rounded-br-xl !rounded-none">
                        <NoConversationSelected />
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Messages;
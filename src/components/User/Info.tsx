import { Profile } from "@utils/lens/generated"
import Cover from "./Cover"
import Details from "./Details"

const Info = ({ profile }: { profile: Profile }) => {
    return (
        <>
            <div className="flex flex-col">
                <div className="flex items-center justify-center">
                    <Cover
                        cover={
                        profile?.coverPicture?.__typename === 'MediaSet'
                            ? profile?.coverPicture?.original?.url
                            : `/patterns/9.png`
                        }
                    />
                </div>    
                <div className="flex flex-col flex-none max-w-7xl mx-auto w-full px-4 justify-start">
                    <Details profile={profile as any} />
                </div>
            </div>
        </>
    )
}

export default Info
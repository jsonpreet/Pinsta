import { Profile } from "@utils/lens/generated"
import Cover from "./Cover"
import Details from "./Details"

const Info = ({ profile }: { profile: Profile }) => {
    return (
        <>
            <div className="flex flex-col">
                <div className="flex items-center justify-center px-4 md:px-0">
                    <Cover
                        cover={
                        profile?.coverPicture?.__typename === 'MediaSet'
                            ? profile?.coverPicture?.original?.url
                            : null
                        }
                        profile={profile as Profile}
                    />
                </div>    
                <div className="flex flex-col flex-none justify-center mx-auto w-full">
                    <Details profile={profile as any} />
                </div>
            </div>
        </>
    )
}

export default Info
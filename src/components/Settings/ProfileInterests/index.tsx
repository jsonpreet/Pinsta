import { FC }  from 'react'
import Topics from './Topics'

const ProfileInterests:FC = () => {
  return (
    <>
      <div className="p-5 space-y-6 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-100 rounded-xl dark:bg-theme">
        <div className="mb-5">
          <h1 className="mb-1 text-xl font-semibold">Interests</h1>
          <p className="text opacity-80">
            There is so much good content on Pinsta, it may be hard to find
            what’s most relevant to you from time to time. That’s where profile
            interests can help curate content the way you like.
          </p>
        </div>
        <Topics />
      </div>
    </>
  )
}

export default ProfileInterests
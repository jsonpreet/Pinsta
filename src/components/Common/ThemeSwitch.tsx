import { useTheme } from 'next-themes'
import React, {FC} from 'react'
import { BsMoon, BsSun } from 'react-icons/bs'

const ThemeSwitch: FC = () => {
    const { theme, setTheme } = useTheme()

    return (
        <>
            <button
                type="button"
                className="flex items-center pr-2"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
                {theme === 'dark' ? (
                    <BsSun className="w-5 h-5" />
                ) : (
                    <BsMoon className="w-5 h-5" />
                )}
            </button>
        </>
    )
}

export default ThemeSwitch
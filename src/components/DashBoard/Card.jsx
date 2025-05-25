import React from 'react'
import { useTheme } from 'lvq'

const Card = ({icon, title, value}) => {
    const { theme } = useTheme();

    const getCardClass = () => {
        switch(theme) {
            case 'theme_1':
                return 'bg-zinc-900 text-white';
            case 'theme_2':
                return 'bg-white text-black border border-gray-200';
            case 'theme_3':
                return 'bg-indigo-500/30 text-white';
            case 'theme_4':
                return 'bg-rose-500/30 text-white';
            default:
                return 'bg-white text-black';
        }
    }

    const getIconClass = () => {
        switch(theme) {
            case 'theme_1':
                return 'text-gray-400';
            case 'theme_2':
                return 'text-gray-500';
            case 'theme_3':
                return 'text-indigo-200';
            case 'theme_4':
                return 'text-rose-200';
            default:
                return 'text-gray-500';
        }
    }

    return (
        <div className={`${getCardClass()} p-4 rounded-lg shadow-md flex items-center space-x-6`}>
            <div className={`text-3xl ${getIconClass()}`}>{icon}</div>
            <div>
                <h2 className='text-lg font-semibold'>{title}</h2>
                <p className='text-xl'>{value}</p>
            </div>
        </div>
    )
}

export default Card
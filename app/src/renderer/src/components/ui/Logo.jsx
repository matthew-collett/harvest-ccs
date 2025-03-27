import icon from '@/assets/icon.svg'
import { twMerge } from 'tailwind-merge'

export const Logo = ({ showText, className, iconSize = 'w-12' }) => (
  <div className={twMerge('flex flex-col justify-center items-center', className)}>
    <img src={icon} alt="Icon" className={iconSize} />
    {showText && <span>Harvest CCS</span>}
  </div>
)

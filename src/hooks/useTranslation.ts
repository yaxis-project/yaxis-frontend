import { useMemo } from 'react'
import { useLanguage } from '../state/user/hooks'
import Dictionary from '../constants/translations'

const useTranslation = () => {
    const language = useLanguage() || 'EN'
    return useMemo(() => Dictionary[language], [language])
}

export default useTranslation

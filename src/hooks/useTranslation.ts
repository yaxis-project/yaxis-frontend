import { useMemo } from 'react'
import { useLanguage } from '../state/user/hooks'
import Dictionary from '../constants/translations'

const useTranslation = () => {
    const language = useLanguage() || 'EN'
    return useMemo(() => (text: string) => {
        const translations = Dictionary[language]
        if (!translations) throw new Error(`Language ${language} is not supported`)
        const translation = translations[text]
        // if (!translation) throw new Error(`${language} Translation not found for '${text}''`)
        return translation
    }, [language])
}

export default useTranslation

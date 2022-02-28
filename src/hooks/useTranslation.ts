import { useMemo } from 'react'
import { useLanguage } from '../state/user/hooks'
import Dictionary, { TLanguages, Phrases } from '../constants/translations'

const useTranslation = () => {
	const language = (useLanguage() || 'EN') as TLanguages
	return useMemo(
		() => (text: Phrases) => {
			const translations = Dictionary[language]
			if (!translations)
				throw new Error(`Language ${language} is not supported`)
			const translation = translations[text]
			if (!translation)
				console.warn(`${language} Translation not found for '${text}''`)
			return translation
		},
		[language],
	)
}

export default useTranslation

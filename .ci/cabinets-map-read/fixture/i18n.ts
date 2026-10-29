export const useTranslation = () => ({i18n:{language:new URLSearchParams(location.search).get('lang')==='en'?'en':'fr'}});

module.exports = {
  locales: ['en', 'ja', 'zh-cn', 'es-mx'],
  defaultLocale: 'es-mx',
  pages: {
    '*': ['templates', 'components'],
  },
  loadLocaleFrom: async (lang, ns) => require(`./locales/${lang}/${ns}.json`),
}

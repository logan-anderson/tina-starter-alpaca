export default (router, cms) => {
  if (typeof window === "undefined") {
    const { lang } = router.query
    cms.api.localization.local = { language: lang }
  }
}

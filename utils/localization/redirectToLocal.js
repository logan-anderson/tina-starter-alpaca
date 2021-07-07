export default (router, cms) => {
  let lang = cms.api.localization.getLocal()
  const { lang: routeLang } = router.query
  console.log(router)
  if (lang !== routeLang) {
    // this takes the path name that the page is currently on and transforms it into a path where we went to go
    // EX:
    // given router.asPath = /en/docs/getting-started
    // asPath will be /<new Lang>/docs/getting-started
    if (typeof window !== "undefined") {
      const asPath = `/${lang}/${router.asPath.split("/").slice(2).join("/")}`
      console.log({ asPath })
      console.log({ route: router.route })
      // router.push(router.route, asPath)
      window.location.pathname = asPath
      // router.reload()
    }
  }
}

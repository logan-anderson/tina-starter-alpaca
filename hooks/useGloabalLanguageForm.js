import { useFormScreenPlugin, useCMS, useForm } from "tinacms"
import router from "next/router"
// import redirectToLocal from "../utils/localization/redirectToLocal"
const useLangForm = () => {
  const cms = useCMS()
  const formOptions = {
    id: "lang",
    label: "Choose language",
    layout: "fullscreen",
    initialValues: {
      language: cms.api.localization.getFormateLocale(),
    },
    fields: [
      {
        name: "language",
        component: "select",
        options: cms.api.localization.localeList.map((lang) => {
          return cms.api.localization.localeToString(lang)
        }),
      },
    ],
    onSubmit: (data) => {
      try {
        cms.api.localization.locale = { language: data.language }
        let currentRoutes = router.asPath.split("/")
        currentRoutes.splice(0, 3)
        cms.alerts.success("language set")
        const lang = cms.api.localization.getFormateLocale()
        router.push(`/${lang}/docs/${currentRoutes.join("/")}`)
        // if (typeof window !== "undefined") {
        //   cms.api.localization.setLocal(data.language)
        // }
      } catch (error) {
        console.error({ ErrorFromOnsubmit: error })
      }
    },
  }

  const [styleData, styleForm] = useForm(formOptions)

  useFormScreenPlugin(styleForm)
  return [styleData, styleForm]
}
export default useLangForm

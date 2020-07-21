import { useFormScreenPlugin, useCMS, useForm } from "tinacms"
import router from "next/router"
const useLangForm = () => {
  const cms = useCMS()
  const formOptions = {
    id: "lang",
    label: "Choose language",
    layout: "fullscreen",
    initialValues: {
      language: cms.api.localization.getLocal(),
    },
    fields: [
      {
        name: "language",
        component: "select",
        options: cms.api.localization.localList,
      },
    ],
    onSubmit: (data) => {
      try {
        cms.api.localization.setLocal(data.language)
        let currentRoutes = router.asPath.split("/")
        // remove docs path
        console.log(currentRoutes)
        currentRoutes.splice(0, 2)
        console.log(currentRoutes)
        if (currentRoutes[0].startsWith("lang")) {
          currentRoutes.splice(0, 1)
        }
        cms.alerts.success("language set")
        const lang = cms.api.localization.getNonDefaultLocal()
        router.push(`/docs/${lang ? `lang-${lang}/` : lang}${currentRoutes.join("/")}`)
      } catch (error) {
        console.error(error)
      }
    },
  }

  const [styleData, styleForm] = useForm(formOptions)

  useFormScreenPlugin(styleForm)
  return [styleData, styleForm]
}
export default useLangForm

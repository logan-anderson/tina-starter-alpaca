import { useFormScreenPlugin, useCMS, useForm } from "tinacms"

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
      cms.api.localization.setLocal(data.language)
      cms.alerts.success("language set")
    },
  }

  const [styleData, styleForm] = useForm(formOptions)

  useFormScreenPlugin(styleForm)
  return [styleData, styleForm]
}
export default useLangForm

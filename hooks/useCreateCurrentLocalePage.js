import { useCMS, usePlugins } from "tinacms"
import { useRouter } from "next/router"
import slugify from "slugify"
import { FORM_ERROR } from "final-form"
import { toMarkdownString, flatDocs, getRandID } from "@utils"
import { LocalGroupField } from "../utils/localization/LocalizationGroupField"
const useCreateLocaleDoc = (initalFileRelativePath) => {
  const router = useRouter()
  const cms = useCMS()
  const lang = cms.api.localization.getFormateLocale()
  const fileRelativePath =
    initalFileRelativePath.substring(0, initalFileRelativePath.length - 2) + lang + ".md"
  console.log({ fileRelativePath: initalFileRelativePath })
  console.log({ fileRelativePath })
  usePlugins([
    {
      __type: "content-creator",
      name: "Create locale for this page",
      fields: LocalGroupField.fields,
      onSubmit: async () => {
        // get json file from github
        const github = cms.api.github
        // this is getting the defult branch and not the current working branch

        // commit the markdown file to github
        return await github
          .commit(
            fileRelativePath,
            getCachedFormData(fileRelativePath).sha,
            toMarkdownString({
              fileRelativePath,
              rawFrontmatter: {
                title: fileRelativePath,
              },
            }),
            "Update from TinaCMS"
          )
          .then((response) => {
            setCachedFormData(fileRelativePath, {
              sha: response.content.sha,
            })
            setTimeout(() => router.reload(), 1500)
          })
          .catch((e) => {
            return { [FORM_ERROR]: e }
          })
      },
    },
  ])
}

const getCachedFormData = (id) => {
  if (typeof localStorage === "undefined") {
    return {}
  }
  return JSON.parse(localStorage.getItem(id) || "{}")
}

const setCachedFormData = (id, data) => {
  if (typeof localStorage === "undefined") {
    return
  }
  localStorage.setItem(id, JSON.stringify(data))
}

export default useCreateLocaleDoc

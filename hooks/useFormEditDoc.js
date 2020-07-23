import { useGithubMarkdownForm } from "react-tinacms-github"
import { useForm } from "tinacms"

const useFormEditDocs = (markdownFile, lang) => {
  const formOptions = {
    label: "Edit doc page",
    id: `${markdownFile.fileRelativePath}-${lang}`,
    fields: [
      {
        name: "frontmatter.title",
        label: "Title",
        component: "text",
      },
      {
        name: "markdownBody",
        label: "Doc Body",
        component: "markdown",
      },
    ],
  }

  return useGithubMarkdownForm(markdownFile, formOptions)
}

export default useFormEditDocs

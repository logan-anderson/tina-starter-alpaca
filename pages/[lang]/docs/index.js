import { useRouter } from "next/router"
import { useEffect } from "react"
import { getGithubPreviewProps, parseJson } from "next-tinacms-github"
import { useCMS } from "tinacms"

// Redirect to the first doc page
const DocIndex = (props) => {
  if (!props.navigation) {
    return null
  }
  console.log(props)
  const router = useRouter()
  const cms = useCMS()
  const topDoc = props.navigation.data.config[0].slug
  const lang = cms.api.localization.getFormateLocale()
  useEffect(() => {
    router.push("/[lang]/docs/[...slug]", `/${lang}/docs/${topDoc}`)
  }, [])
  return <p>Redirecting...</p>
}

// read more about getStaticProps, getStaticPaths and previewMode (its pretty cool stuff)
// https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation

export const getStaticProps = async function ({ preview, previewData }) {
  let allNestedDocsRemote
  // if we are in preview mode we will get the contents from github
  if (preview) {
    try {
      allNestedDocsRemote = await getGithubPreviewProps({
        ...previewData,
        fileRelativePath: "docs/config.json",
        parse: parseJson,
      })

      return {
        props: {
          navigation: {
            ...allNestedDocsRemote.props.file,
            fileRelativePath: `docs/config.json`,
          },
        },
      }
    } catch (e) {
      console.error(e)
      console.log("this is a error that should not happen")
      console.log(e)
      // return the erros from gitGithubPreviewProps
      return {
        props: {
          ...allNestedDocsRemote.props,
        },
      }
    }
  }

  // Not in preview mode so we will get contents from the file system
  const allNestedDocs = require("../../../docs/config.json")
  console.log({ allNestedDocs })

  return {
    props: {
      navigation: {
        fileRelativePath: `docs/config.json`,
        data: allNestedDocs,
      },
      preview: false,
      error: null,
    },
  }
}

export const getStaticPaths = () => {
  return {
    paths: [
      {
        params: { lang: "en" },
      },
      {
        params: { lang: "fr" },
      },
    ],
    fallback: true,
  }
}
export default DocIndex

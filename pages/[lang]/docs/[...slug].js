import matter from "gray-matter"
import { useRouter } from "next/router"
import Error from "next/error"
import { useFormScreenPlugin, usePlugin, useCMS } from "tinacms"
import { InlineTextField } from "react-tinacms-inline"
import { InlineWysiwyg } from "react-tinacms-editor"
import { getGithubPreviewProps, parseMarkdown, parseJson } from "next-tinacms-github"
import { InlineForm } from "react-tinacms-inline"
import Head from "@components/head"
import Layout from "@components/layout"
import PostNavigation from "@components/post-navigation"
import RichText from "@components/rich-text"
import PostFeedback from "@components/post-feedback"
import SideNav from "@components/side-nav"
import DocWrapper from "@components/doc-wrapper"
import MarkdownWrapper from "@components/markdown-wrapper"
import Toc from "@components/Toc"
import {
  useCreateMainDoc,
  useFormEditDoc,
  useCreateChildPage,
  useNavigationForm,
  useGlobalStyleForm,
} from "@hooks"
import { createToc } from "@utils"
import getGlobalStaticProps from "../../../utils/getGlobalStaticProps"
import useLangForm from "../../../hooks/useGloabalLanguageForm"
import setLangFromRouter from "../../../utils/localization/setLangFromRouter"
// import { connectScrollTo } from "react-instantsearch-dom"
import redirectToLocal from "../../../utils/localization/redirectToLocal"
import { LangSwitcherPlugin } from "../../../plugins/LangSwitcherPlugin"
import { useEffect } from "react"

const DocTemplate = (props) => {
  // console.log(props)
  if (!props.file) {
    return <Error statusCode={404} />
  }
  const cms = useCMS()
  const previewURL = props.previewURL || ""
  const router = useRouter()
  if (typeof window === undefined) {
    setLangFromRouter(router, cms)
  }

  const lang = cms.api.localization.getFormateLocale()
  console.log({ file: props.file, lang })

  const [data, form] = useFormEditDoc(props.file, lang)
  usePlugin(form)
  const [navData, navForm] = useNavigationForm(props.navigation, props.preview)
  useLangForm()
  const nestedDocs = navData.config
  const [styleData] = useGlobalStyleForm(props.styleFile, props.preview)

  useFormScreenPlugin(navForm)
  // wrappers around using the content-creator puglin with tinaCMS
  useCreateMainDoc(nestedDocs)
  useCreateChildPage(nestedDocs)
  useEffect(() => {
    cms.plugins.add(LangSwitcherPlugin)
  }, [])

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <Layout showDocsSearcher splitView theme={styleData} searchIndex="tina-starter-alpaca-Docs">
      <Head title={data.frontmatter.title} />
      <SideNav allNestedDocs={nestedDocs} currentSlug={router.query.slug} />
      <div
        style={{
          maxWidth: "762px",
          marginLeft: 0,
          flex: "1 1 0",
        }}
      >
        <InlineForm form={form}>
          <DocWrapper styled={true}>
            <RichText>
              <main>
                <h1>
                  <InlineTextField name="frontmatter.title" />
                </h1>
                {/* <button
                  onClick={() => {
                    cms.api.localization.locale = { language: "fr" }
                    redirectToLocal(router, cms)
                  }}
                >
                  change lang to fr
                </button>
                <button
                  onClick={() => {
                    cms.api.localization.locale = { language: "en" }
                    redirectToLocal(router, cms)
                  }}
                >
                  change lang to en
                </button> */}
                {!props.preview && props.Alltocs.length > 0 && <Toc tocItems={props.Alltocs} />}
                <InlineWysiwyg
                  imageProps={{
                    async upload(files) {
                      const directory = "/public/images/"
                      let media = await cms.media.store.persist(
                        files.map((file) => {
                          return {
                            directory,
                            file,
                          }
                        })
                      )
                      return media.map((m) => `public/images/${m.filename}`)
                    },
                    previewUrl: (str) => {
                      console.log({ str })
                      return `${previewURL}/${str}`
                    },
                  }}
                  name="markdownBody"
                >
                  <MarkdownWrapper source={data.markdownBody} />
                </InlineWysiwyg>
              </main>
            </RichText>
            <PostNavigation allNestedDocs={nestedDocs} />
            <PostFeedback />
          </DocWrapper>
        </InlineForm>
      </div>
    </Layout>
  )
}

// read more about getStaticProps, getStaticPaths and previewMode (its pretty cool stuff)
// https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation

export const getStaticProps = async function ({ preview, previewData, params }) {
  const global = await getGlobalStaticProps(preview, previewData)
  let { slug, lang } = params
  // TODO: this should be if lang = default lang
  if (lang === "en") {
    lang = ""
  } else {
    lang = "." + lang
  }
  const fileRelativePath = `docs/${slug.join("/")}${lang}.md`

  console.log({ relPathFromProps: fileRelativePath })

  // we need these to be in scope for the catch statment
  let previewProps = {}
  let allNestedDocsRemote = {}
  let Alltocs = ""
  // if we are in preview mode we will get the contents from github
  const getPropsFunc = async (fileRelativePath) => {
    previewProps = await getGithubPreviewProps({
      ...previewData,
      fileRelativePath,
      parse: parseMarkdown,
    })
    allNestedDocsRemote = await getGithubPreviewProps({
      ...previewData,
      fileRelativePath: "docs/config.json",
      parse: parseJson,
    })

    if (typeof window === "undefined") {
      Alltocs = createToc(previewProps.props.file.data.markdownBody)
    }
    return {
      props: {
        ...global,
        // markdown file stored in file:
        ...previewProps.props,
        // json for navigation form
        navigation: {
          ...allNestedDocsRemote.props.file,
          fileRelativePath: `docs/config.json`,
        },
        Alltocs,
        previewURL: `https://raw.githubusercontent.com/${previewData.working_repo_full_name}/${previewData.head_branch}`,
      },
    }
  }

  if (preview) {
    try {
      const returnVal = await getPropsFunc(fileRelativePath)
      return returnVal
    } catch (e) {
      // lets try to get the stuff from github but this time with the default lang
      try {
        console.log("geting other return val")
        const returnVal = await getPropsFunc(`/docs/${slug.join("/")}.md`)
        return returnVal
      } catch (error) {
        // return the erros from gitGithubPreviewProps
        return {
          props: {
            ...previewProps.props,
            ...allNestedDocsRemote.props,
          },
        }
      }
    }
  }

  // Not in preview mode so we will get contents from the file system
  const allNestedDocs = require("../../../docs/config.json")
  let content = ""
  try {
    const data = await import(`@docs/${slug.join("/")}${lang}.md`)
    content = data.default
  } catch (error) {
    const data = await import(`@docs/${slug.join("/")}.md`)
    content = data.default
  }
  const data = matter(content)

  // Create Toc (table of contents)
  if (typeof window === "undefined") {
    Alltocs = createToc(data.content)
  }

  return {
    props: {
      // the markdown file
      ...global,
      file: {
        fileRelativePath,
        data: {
          frontmatter: data.data,
          markdownBody: data.content,
        },
      },
      navigation: {
        fileRelativePath: `docs/config.json`,
        data: allNestedDocs,
      },
      Alltocs,
      preview: false,
      error: null,
    },
  }
}

export const getStaticPaths = async function () {
  const fg = require("fast-glob")
  const contentDir = "docs/"
  const files = await fg(`${contentDir}**/*.md`)
  const paths = []
  const langs = ["en", "fr"]
  langs.forEach((lang) => {
    const tempfiles = files.map((file) => {
      const path = file.substring(contentDir.length, file.length - 3)
      return { params: { slug: path.split("/"), lang } }
    })
    paths.push(...tempfiles)
  })
  return {
    fallback: true,
    paths,
  }
}

export default DocTemplate

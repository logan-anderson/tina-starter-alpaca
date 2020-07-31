export const LocalGroupField = {
  name: "locale",
  label: "Locale",
  component: "group",
  fields: [
    {
      label: "language",
      name: "language",
      component: "text",
    },
    {
      label: "region",
      name: "region",
      component: "text",
    },
    {
      label: "encoding",
      name: "encoding",
      component: "text",
    },
    // {
    //   label: "modifiers",
    //   name: "modifiers",
    //   component: "list",
    //   field: {
    //     component: "text",
    //   },
    // },
  ],
}

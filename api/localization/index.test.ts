import { Locale, LocalizationApi } from "./index"

describe("Localization API", () => {
  const LocalAPI = new LocalizationApi()
  it("Can be instantiated", () => {
    expect(LocalAPI).not.toBeNull()
  })
  it("stores a default locale", () => {
    expect(LocalAPI).not.toBeNull()
  })
  it("stores a locale", () => {
    const setLocale: Locale = {
      language: "en",
      encoding: "utf-8",
    }
    LocalAPI.setLocale(setLocale)
    expect(LocalAPI.locale).toBe(setLocale)
  })
  it("format's the locale when retrieved", () => {
    const vals: { locale: Locale; expected: string }[] = [
      {
        locale: {
          language: "en",
          encoding: "utf-8",
        },
        expected: "en.utf-8",
      },
      {
        locale: {
          language: "en",
          encoding: "utf-8",
          region: "CA",
        },
        expected: "en_CA.utf-8",
      },
      {
        locale: {
          language: "en",
          encoding: "utf-8",
          region: "CA",
        },
        expected: "en_CA.utf-8",
      },
      {
        locale: {
          language: "en",
          encoding: "utf-8",
          region: "CA",
          modifiers: ["test", "test2"],
        },
        expected: "en_CA.utf-8@test@test2",
      },
    ]
    vals.forEach((val) => {
      LocalAPI.setLocale(val.locale)
      expect(LocalAPI.getLocale()).toEqual(val.expected)
    })
  })
})

import { Locale, LocalizationApi } from "./index"

describe("Localization API", () => {
  const localAPI = new LocalizationApi()
  it("has a default locale", () => {
    expect(localAPI.getLocale()).not.toBeNull()
  })
  describe("#setLocal(newLocale)", () => {
    it("updates the locale to be newLocale", () => {
      const newLocal: Locale = {
        language: "en",
        encoding: "utf-8",
      }
      localAPI.setLocale(newLocal)
      expect(localAPI.locale).toBe(newLocal)
    })
  })
  describe("#getLocale()", () => {
    it("format's the locale to mathch language[_region][.encoding][@modifier]when retrieved", () => {
      const rand = Math.floor(Math.random() * 100)
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
            encoding: `utf-${rand}`,
          },
          expected: `en.utf-${rand}`,
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
            modifiers: ["test"],
          },
          expected: "en_CA.utf-8@test",
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
        localAPI.setLocale(val.locale)
        expect(localAPI.getLocale()).toEqual(val.expected)
      })
    })
  })
})

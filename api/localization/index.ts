const defaultList: Locale[] = [{ language: "en" }, { language: "fr" }, { language: "sp" }]
const LOCALE_CACHE_KEY = "locale-cache"

export interface Locale {
  language?: string
  region?: string
  encoding?: string
  modifiers?: string[]
}

export class LocalizationApi {
  public default: Locale = {
    language: "en",
    region: "CA",
    encoding: "utf-8",
    modifiers: ["example"],
  }
  public locale: Locale
  public localeList: Locale[]
  constructor(localeList = defaultList) {
    // console.log("this class is being constructed")
    this.locale = this.getCachedData(LOCALE_CACHE_KEY) || this.default
    this.localeList = localeList
  }
  getLocale(): string {
    const currentLocal =
      this.locale === this.default
        ? this.locale
        : this.getCachedData(LOCALE_CACHE_KEY) || this.locale

    return `${currentLocal.language || ""}${currentLocal.region ? "_" + currentLocal.region : ""}${
      currentLocal.encoding ? "." + currentLocal.encoding : ""
    }${currentLocal.modifiers ? "@" + currentLocal.modifiers.join("@") : ""}`
  }
  setLocale(locale) {
    this.locale = locale
    this.setCachedData(LOCALE_CACHE_KEY, locale)
  }
  getCachedData = (id): Locale => {
    if (typeof localStorage === "undefined") {
      return {}
    }
    return JSON.parse(localStorage.getItem(id) || "{}")
  }
  setCachedData = (id, data) => {
    if (typeof localStorage === "undefined") {
      return
    }
    localStorage.setItem(id, JSON.stringify(data))
  }
}

const localizationList = ["en", "fr", "es"]
const LOCALIZATION_ID = "localization-cache"

export class LocalizationApi {
  constructor(localList = localizationList) {
    console.log("this class is being constructed")
    this.default = "en"
    this.local = this.getCachedData(LOCALIZATION_ID) || this.default
    this.localList = localList
  }
  getLocal() {
    return this.local === this.default
      ? this.local
      : this.getCachedData(LOCALIZATION_ID) || this.local
  }
  getNonDefaultLocal() {
    // return this.getLocal()
    const currentLocal = this.getLocal()
    return currentLocal === this.default ? "" : currentLocal
  }
  setLocal(local) {
    this.local = local
    this.setCachedData(LOCALIZATION_ID, local)
  }
  getCachedData = (id) => {
    if (typeof localStorage === "undefined") {
      return ""
    }
    return localStorage.getItem(id) || ""
  }
  setCachedData = (id, data) => {
    if (typeof localStorage === "undefined") {
      return
    }
    localStorage.setItem(id, data)
  }
}

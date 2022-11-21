customElements.define('smart-img', class SmartImg extends HTMLImageElement {
  triggerEvent: string | undefined
  baseSrc: string
  resParam: string
  resolutions: Array<string>

  constructor() {
    super();

    this.baseSrc = this.dataset.src || ""
    this.resolutions = JSON.parse(this.dataset.resolutions || "[]")
    this.triggerEvent = this.dataset["triggerevent"]
    this.resParam = this.dataset["param"] || "resolution"

    if (this.triggerEvent) {
      globalThis.document.addEventListener(this.triggerEvent, () => this.beginLoading())
    } else this.beginLoading();

    console.log("constructed img-smart");
  }

  // connectedCallback() {
  //   console.log(this, 'connected!')
  // }

  async beginLoading() {
    // console.log("here", this.resolutions)
    if (!this.resolutions[0]) {
      // console.log(`requesting ${this.baseSrc}`)
      this.src = this.baseSrc
    }

    for (let i = 0; i < this.resolutions.length; i++) {
      const [width, height] = this.resolutions[i].split("x").map(s => Number(s))
      
      // basic check on screen - checking img or container forces dimension attributes
      if (
        width > globalThis.innerWidth || 
        height > globalThis.innerHeight
      ) break

      const newSrc = `${this.baseSrc}?${this.resParam}=${this.resolutions[i]}`
      this.src = newSrc

      while (!this.complete) {
        // console.log(`loading ${newSrc}`)
        await new Promise(res => setTimeout(res, 100))
      }
    }
  }
}, {
  extends: "img"
});
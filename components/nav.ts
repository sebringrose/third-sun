customElements.define('nav-menu', class NavMenu extends HTMLElement {
  home = document.querySelector("#info")
  nextSection = document.querySelector("#showcase")
  ogHeight = this.style.height
  ogWidth = this.style.width

  // used to throlle calls from IntersectionObserver
  // and relocate if menu opened not at scroll position
  onBody = false

  constructor() {
    super();
    globalThis.document.querySelector("#nav-button")!.addEventListener('click', () => {
      this.toggleOpen()
    });
  }

  connectedCallback() {
    console.log('here', this)
    const observer = new IntersectionObserver(e => {
      const showcaseInView = e[0].isIntersecting
      if (showcaseInView && !this.onBody) {
        this.onBody = true
        this.moveToBody()
      }
      if (!showcaseInView && this.onBody) {
        this.onBody = false
        this.moveBackHome()
      }
    }, {
      root: null, // document body
      rootMargin: "0px" // viewport bounds
    });
      
    observer.observe(this.nextSection!)
  }

  moveToBody() {
    globalThis.document.body.insertBefore(this, globalThis.document.body.firstChild)
  }

  moveBackHome() {
    this.home!.insertBefore(this, this.home!.firstChild)
  }

  async toggleOpen() {
    this.classList.toggle("isOpen");
    if (!this.onBody) this.home?.scrollIntoView({
      behavior: "smooth"
    })
    
    if (this.classList.contains("isOpen")) {
      globalThis.document.querySelector("#nav-button")!.textContent = "X"
      this.style.height = "100vh"
      this.style.width = "100vw"
    } else {
      globalThis.document.querySelector("#nav-button")!.textContent = "+"
      await new Promise(res => setTimeout(res, 600))
      this.style.height = this.ogHeight
      this.style.width = this.ogWidth
    }
  }
}, {
  extends: "nav"
});
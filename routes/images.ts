import * as Peko from "peko"
import { recursiveReaddir } from "recursiveReadDir"
import { fromFileUrl } from "fromFileUrl"
import sharp from "sharp"

const prod = Deno.env.get("ENVIRONMENT") === "production"
const cache = new Peko.ResponseCache()
const files = await recursiveReaddir(fromFileUrl(new URL("../static/images", import.meta.url)))

export default files.map((file): Peko.Route => {
  const fileRoute = file.slice(Deno.cwd().length+1)

  return {
    route: `/${fileRoute}`,
    middleware: prod ? Peko.cacher(cache) : [],
    handler: async (ctx) => await Peko.staticHandler(new URL(`../${fileRoute}`, import.meta.url), {
      transform: async (contents) => {
        const params = new URL(ctx.request.url).searchParams
        const resolution = params.get("resolution")
        if (!resolution || resolution.split("x").length !== 2) return contents
        
        return await sharp(contents)
          .resize(Number(resolution.split("x")[0]))
      },
      headers: new Headers({
        "Cache-Control": "max-age=600, stale-while-revalidate=86400"
      })
    })(ctx)
  }
})
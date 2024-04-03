let PROXY = (
    process.env.VERCEL ? "https://us-east1-toofake.cloudfunctions.net/toofakeproxy?target=" : ""
)

console.log("PROXY", PROXY)

export { PROXY };
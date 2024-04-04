let PROXY = (
    process.env.VERCEL ? "https://us-east1-toofake.cloudfunctions.net/toofakeproxy?target=" : ""
)

let GAPIKEY = "AIzaSyCgNTZt6gzPMh-2voYXOvrt_UR_gpGl83Q" 

console.log("PROXY", PROXY)

export { PROXY, GAPIKEY };
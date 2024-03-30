let BEREAL_SIGNATURE = "MToxNzExNTc0ODYyOoqIZ5a9FAreOBIuDRzjdonbo6QGGOQDNCQzQ5vC1UI4";

let PROXY = (
    process.env.VERCEL ? "https://us-east1-toofake.cloudfunctions.net/toofakeproxy?target=" : ""
)

console.log("PROXY", PROXY)

let HEADERS = {
    "bereal-app-version-code": "14549",
    "bereal-timezone": "Europe/Paris",
    "bereal-device-id": "937v3jb942b0h6u9",
    "bereal-signature": BEREAL_SIGNATURE,
}

export { BEREAL_SIGNATURE, HEADERS, PROXY };
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "client",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    new sst.aws.Nextjs("ToofakeSST", {
      domain: {
        domainName: "toofake.lol",
        redirects: ["www.toofake.lol"],
      }
    });
  },
});

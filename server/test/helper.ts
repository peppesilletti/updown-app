// This file contains code that we reuse between our tests.
const helper = require("fastify-cli/helper.js");
import * as path from "path";

export type TestContext = {
  after: typeof tap.after;
};

const AppPath = path.join(__dirname, "..", "src", "app.ts");

async function config() {
  return {};
}

// Automatically build and tear down our instance
async function build(t: TestContext) {
  // you can set all the options supported by the fastify CLI command
  const argv = [AppPath];

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  const app = await helper.build(argv, await config());

  // Tear down our app after we are done
  t.after(() => void app.close());

  return app;
}

export { build, config };

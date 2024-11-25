import tap from "tap";
import { createUser } from "../apiHelpers";
import { build } from "../helper";

tap.test(
  "Scenario 7: Rate limiting is enforced when bashing an endpoint with requests",
  async (t) => {
    const app = await build(t);

    // Simulate bashing the endpoint with multiple requests
    const requests = Array.from({ length: 101 }, () => createUser(app));

    const responses = await Promise.all(requests);

    // Check if any of the responses indicate rate limiting
    const rateLimitedResponse = responses.find(
      (response) => response.statusCode === 429
    );

    t.ok(rateLimitedResponse, "Rate limiting should be enforced");
  }
);

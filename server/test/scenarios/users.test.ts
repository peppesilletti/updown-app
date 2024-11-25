import tap from "tap";
import { createUser, fetchUserBets, fetchUserById } from "../apiHelpers";
import { build } from "../helper";

tap.test(
  "Scenario 1: User creates an account. The initial score is 0.",
  async (t) => {
    const app = await build(t);

    const createdUser = (await createUser(app)).createdUser;
    t.equal(createdUser.score, 0);

    const fetchedUser = await fetchUserById(app, createdUser.id);
    t.equal(fetchedUser.user.score, 0);
    t.equal(fetchedUser.user.username, createdUser.username);

    const fetchedUserBets = await fetchUserBets(app, createdUser.id);
    t.equal(fetchedUserBets.bets.length, 0);
  }
);

tap.test(
  "Scenario 2: User creates an account with a username that already exists.",
  async (t) => {
    const app = await build(t);

    const { createdUser: firstUser } = await createUser(app);
    const { statusCode } = await createUser(app, firstUser.username);

    t.equal(statusCode, 400);
  }
);

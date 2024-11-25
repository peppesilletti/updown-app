import { plugin as tapNock } from "@tapjs/nock";
import tap from "tap";

import {
  checkBet,
  createUser,
  fetchUserBets,
  makeBet,
  mockBTCPrice,
} from "../apiHelpers";
import { build } from "../helper";

tap.test("Scenario 1: User makes a bet, then checks their bets", async (t) => {
  const tn = tapNock(t);

  const app = await build(t);
  mockBTCPrice(tn, 50000);

  const createdUserId = (await createUser(app)).createdUser.id;

  const makeBetResponseBody = await makeBet(app, createdUserId, "UP");

  const fetchUserBetsResponseBody = await fetchUserBets(app, createdUserId);

  const createdBet = fetchUserBetsResponseBody.bets.find(
    (bet) => bet.id === makeBetResponseBody.createdBet.id
  );

  t.equal(createdBet?.direction, "UP");
  t.equal(createdBet?.status, "pending");
  t.equal(createdBet?.userId, createdUserId);
  t.equal(fetchUserBetsResponseBody.bets.length, 1);
});

tap.test(
  "Scenario 2: User makes bets 'UP'. The user wins and gets one point.",
  async (t) => {
    const tn = tapNock(t);

    mockBTCPrice(tn, 50000);

    const app = await build(t);
    const createdUserId = (await createUser(app)).createdUser.id;

    const { createdBet } = await makeBet(app, createdUserId, "UP");

    mockBTCPrice(tn, 60000);

    const checkBetResponseBody = await checkBet(app, createdBet.id);

    // Add assertions here to verify the behavior with the mocked BTC price
    t.equal(checkBetResponseBody.betResult.status, "won"); // Example assertion
    t.equal(checkBetResponseBody.betResult.newUserScore, 1); // Example assertion
  }
);

tap.test(
  "Scenario 3: User makes bets 'UP'. The user loses and loses one point.",
  async (t) => {
    const tn = tapNock(t);

    const app = await build(t);
    const createdUserId = (await createUser(app)).createdUser.id;

    mockBTCPrice(tn, 60000);
    const { createdBet } = await makeBet(app, createdUserId, "UP");

    mockBTCPrice(tn, 50000);
    const checkBetResponseBody = await checkBet(app, createdBet.id);

    // Add assertions here to verify the behavior with the mocked BTC price
    t.equal(checkBetResponseBody.betResult.status, "lost"); // Example assertion
    t.equal(checkBetResponseBody.betResult.newUserScore, -1); // Example assertion
  }
);

tap.test(
  "Scenario 4: User makes bets 'DOWN'. The user wins and gets one point.",
  async (t) => {
    const tn = tapNock(t);

    const app = await build(t);
    const createdUserId = (await createUser(app)).createdUser.id;

    mockBTCPrice(tn, 60000);
    const { createdBet } = await makeBet(app, createdUserId, "DOWN");

    mockBTCPrice(tn, 50000);
    const checkBetResponseBody = await checkBet(app, createdBet.id);

    // Add assertions here to verify the behavior with the mocked BTC price
    t.equal(checkBetResponseBody.betResult.status, "won"); // Example assertion
    t.equal(checkBetResponseBody.betResult.newUserScore, 1); // Example assertion
  }
);

tap.test(
  "Scenario 5: User makes bets 'DOWN'. The user loses and loses one point.",
  async (t) => {
    const tn = tapNock(t);

    const app = await build(t);

    const createdUserId = (await createUser(app)).createdUser.id;

    mockBTCPrice(tn, 60000);
    const { createdBet } = await makeBet(app, createdUserId, "DOWN");

    mockBTCPrice(tn, 70000);
    const checkBetResponseBody = await checkBet(app, createdBet.id);

    // Add assertions here to verify the behavior with the mocked BTC price
    t.equal(checkBetResponseBody.betResult.status, "lost"); // Example assertion
    t.equal(checkBetResponseBody.betResult.newUserScore, -1); // Example assertion
  }
);

tap.test(
  "Scenario 6: User bets. Then it tries to make another bet, but it fails because the former bet is not resolved yet.",
  async (t) => {
    const tn = tapNock(t);

    const app = await build(t);
    const createdUserId = (await createUser(app)).createdUser.id;

    mockBTCPrice(tn, 50000);
    await makeBet(app, createdUserId, "DOWN");

    await new Promise((res) => setTimeout(res, 1000));

    const { statusCode: makeBetUpStatusCode } = await makeBet(
      app,
      createdUserId,
      "UP"
    );

    t.equal(makeBetUpStatusCode, 401);
  }
);

tap.test(
  "Scenario 7: User makes a bet 'UP'. The price doesn't change, so the state remains the same.",
  async (t) => {
    const tn = tapNock(t);

    const app = await build(t);
    const createdUserId = (await createUser(app)).createdUser.id;

    mockBTCPrice(tn, 50000);
    const { createdBet } = await makeBet(app, createdUserId, "UP");

    mockBTCPrice(tn, 50000);
    const checkBetResponseBody = await checkBet(app, createdBet.id);

    // Add assertions here to verify the behavior with the mocked BTC price
    t.equal(checkBetResponseBody.betResult.status, "pending");

    const fetchUserBetsResponseBody = await fetchUserBets(app, createdUserId);
    const fetchedBet = fetchUserBetsResponseBody.bets.find(
      (bet) => bet.id === createdBet.id
    )!;

    t.equal(fetchedBet?.status, "pending");
  }
);

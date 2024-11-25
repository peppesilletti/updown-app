import { plugin as tapNock } from "@tapjs/nock";
import { FastifyInstance } from "fastify";
import { v4 as uuidv4 } from "uuid";
import { Bet } from "../src/schemas/bets";
import { User } from "../src/schemas/users";

async function createUser(app: FastifyInstance, username?: string) {
  const userRes = await app.inject({
    method: "POST",
    url: "/api/v1/users/create",
    payload: { username: username || `user-${uuidv4()}` },
  });

  return {
    statusCode: userRes.statusCode,
    createdUser: userRes.json().createdUser as User,
  };
}

async function makeBet(
  app: FastifyInstance,
  userId: number,
  direction: "UP" | "DOWN"
) {
  const makeBetResponse = await app.inject({
    method: "POST",
    url: "/api/v1/bets/make",
    payload: { userId, direction },
  });

  return {
    statusCode: makeBetResponse.statusCode,
    createdBet: makeBetResponse.json().createdBet as Bet,
  };
}

async function checkBet(app: FastifyInstance, betId: number) {
  const checkBetResponse = await app.inject({
    method: "POST",
    url: "/api/v1/bets/check",
    payload: { betId },
  });

  return {
    statusCode: checkBetResponse.statusCode,
    betResult: checkBetResponse.json().betResult,
  };
}

function mockBTCPrice(tn: ReturnType<typeof tapNock>, price: number) {
  tn.nock("https://api.coindesk.com")
    .get("/v1/bpi/currentprice/BTC.json")
    .reply(200, {
      bpi: { USD: { rate_float: price } },
    });
}

async function fetchUserById(app: FastifyInstance, userId: number) {
  const fetchUserResponse = await app.inject({
    method: "GET",
    url: `/api/v1/users/${userId}`,
  });

  return {
    statusCode: fetchUserResponse.statusCode,
    user: fetchUserResponse.json().user as User,
  };
}

async function fetchUserBets(app: FastifyInstance, userId: number) {
  const fetchUserBetsResponse = await app.inject({
    method: "GET",
    url: `/api/v1/users/${userId}/bets`,
  });

  return {
    statusCode: fetchUserBetsResponse.statusCode,
    bets: fetchUserBetsResponse.json().bets as Bet[],
  };
}

export {
  checkBet,
  createUser,
  fetchUserBets,
  fetchUserById,
  makeBet,
  mockBTCPrice,
};

import { prisma } from "../utils/prisma";

type PingPayload = {
  ok: true;
  service: string;
  timestamp: string;
  database: {
    connected: boolean;
  };
};

export async function getPingPayload(): Promise<PingPayload> {
  let connected = true;

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    connected = false;
  }

  return {
    ok: true,
    service: "numora-api",
    timestamp: new Date().toISOString(),
    database: {
      connected
    }
  };
}

type PingPayload = {
  ok: true;
  service: string;
  timestamp: string;
};

export function getPingPayload(): PingPayload {
  return {
    ok: true,
    service: "numora-api",
    timestamp: new Date().toISOString()
  };
}

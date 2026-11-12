// Upstash Redis REST 호출. Vercel Marketplace 연동이 넣어주는 환경변수 이름 두 가지를 모두 받는다.
const URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

const KEY = "balancegame:v1";
const IDS = ["r1", "r2", "r3", "p1", "p2", "p3", "m1", "m2", "m3", "e1", "e2", "e3", "b1", "b2", "b3"];

async function call(path, body) {
  if (!URL || !TOKEN) throw new Error("redis-not-configured");
  const r = await fetch(URL.replace(/\/$/, "") + path, {
    method: "POST",
    headers: { Authorization: "Bearer " + TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error("redis-" + r.status);
  return r.json();
}

module.exports = { KEY, IDS, call, configured: () => Boolean(URL && TOKEN) };

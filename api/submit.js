const { KEY, IDS, call, configured } = require("./_redis");

// POST /api/submit  body: { answers: { r1: "a", r2: "b", ... } } — 15문항을 모두 답한 경우만 집계한다.
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = null; } }
  const answers = body && body.answers;
  const valid = answers && typeof answers === "object" &&
    Object.keys(answers).length === IDS.length &&
    IDS.every(id => answers[id] === "a" || answers[id] === "b");
  if (!valid) return res.status(400).json({ ok: false });
  if (!configured()) return res.status(200).json({ ok: false });
  try {
    await call("/pipeline", IDS.map(id => ["HINCRBY", KEY, id + ":" + answers[id], 1]));
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(200).json({ ok: false });
  }
};

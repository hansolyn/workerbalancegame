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
    // 유형 코드도 서버에서 계산해 함께 센다(관계·실행·보상·성과 순, 3문항 중 a가 2개 이상이면 앞 글자).
    const code = [["r", "W", "S"], ["p", "P", "F"], ["m", "M", "T"], ["e", "R", "E"]].map(([k, x, y]) =>
      [1, 2, 3].filter(n => answers[k + n] === "a").length >= 2 ? x : y).join("");
    const cmds = IDS.map(id => ["HINCRBY", KEY, id + ":" + answers[id], 1]);
    cmds.push(["HINCRBY", KEY, "t:" + code, 1]);
    await call("/pipeline", cmds);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(200).json({ ok: false });
  }
};

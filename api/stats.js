const { KEY, call, configured } = require("./_redis");

// GET /api/stats → { counts: { "r1:a": 12, "r1:b": 30, ... } }
module.exports = async (req, res) => {
  if (!configured()) return res.status(200).json({ counts: null });
  try {
    const { result } = await call("", ["HGETALL", KEY]);
    const counts = {};
    for (let i = 0; i + 1 < (result || []).length; i += 2) counts[result[i]] = Number(result[i + 1]) || 0;
    // CDN이 60초간 캐시해 Redis 호출 수를 줄인다.
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    res.status(200).json({ counts });
  } catch (e) {
    res.status(200).json({ counts: null });
  }
};

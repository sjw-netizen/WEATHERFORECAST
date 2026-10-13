// =============================================================
// Vercel 배포용 백엔드 (서버리스 함수)
// Vercel은 api 폴더의 파일을 자동으로 /api/... 주소로 연결함
// → 이 파일은 /api/weather?city=도시이름 요청을 처리
// =============================================================

const { getWeather } = require("../backend/weather");

module.exports = async (req, res) => {
  const city = (req.query.city || "").trim();
  const { status, body } = await getWeather(city);
  res.status(status).json(body);
};

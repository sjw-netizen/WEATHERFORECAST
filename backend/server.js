// =============================================================
// 날씨 앱 로컬 서버 (Node.js 기본 모듈만 사용, 별도 설치 불필요)
// - /api/weather?city=도시이름  → 외부 날씨 API를 호출해 결과를 돌려줌
// - 그 외 경로                  → frontend 폴더의 파일(HTML/CSS/JS)을 보여줌
// 날씨 조회 로직은 weather.js에 있음 (Vercel 배포용 api/weather.js도 같이 사용)
// =============================================================

const http = require("http");
const fs = require("fs");
const path = require("path");
const { getWeather } = require("./weather");

const PORT = process.env.PORT || 8000;
const FRONTEND_DIR = path.join(__dirname, "..", "frontend");

// 확장자별 Content-Type
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

// /api/weather 요청 처리
async function handleWeather(res, city) {
  const { status, body } = await getWeather(city);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    // index.html을 파일로 직접 열거나 Live Server로 열어도 요청할 수 있게 허용
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(body));
}

// 프론트엔드 파일 보내기
function serveStaticFile(res, pathname) {
  const fileName = pathname === "/" ? "index.html" : pathname.slice(1);
  const filePath = path.join(FRONTEND_DIR, fileName);

  // frontend 폴더 밖의 파일은 접근하지 못하게 막기
  if (!filePath.startsWith(FRONTEND_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("파일을 찾을 수 없습니다.");
    }
    const type = MIME_TYPES[path.extname(filePath)] || "text/plain; charset=utf-8";
    res.writeHead(200, { "Content-Type": type });
    res.end(content);
  });
}

// 서버 만들기
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/api/weather") {
    handleWeather(res, url.searchParams.get("city")?.trim());
  } else {
    serveStaticFile(res, url.pathname);
  }
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`${PORT}번 포트를 이미 다른 프로그램이 사용 중이에요.`);
    console.error("다른 포트로 실행하려면: $env:PORT=8080; node backend/server.js");
  } else {
    console.error(err);
  }
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`날씨 앱 서버 실행 중: http://localhost:${PORT}`);
  console.log("종료하려면 Ctrl + C 를 누르세요.");
});

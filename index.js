const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// x-www-form-urlencoded 데이터 파싱
app.use(bodyParser.urlencoded({ extended: true }));

// 정적 파일 제공 (index.html 포함)
app.use(express.static(path.join(__dirname, "public")));

// notiUrl: "OK" 텍스트 반환
app.post("/api/notiUrl", (req, res) => {
  console.log("✅ /api/notiUrl 호출됨:", req.body);
  res.send("OK");
});

// cancelUrl & nextUrl: 요청 데이터 화면에 표시
const handleRequest = (req, res) => {
  console.log(`✅ ${req.path} 호출됨 (POST)`, req.body);

  let title = req.path === "/cancUrl" ? "결제 취소" : "결제 완료";

  let responseHtml = `
    <html>
    <head><title>URL Handler</title></head>
    <body>
      <h2>${title} (${method})</h2>
      <ul>
  `;

  Object.keys(req.body).forEach((key) => {
    responseHtml += `<li><strong>${key}:</strong> ${req.body[key]}</li>`;
  });

  responseHtml += `
      </ul>
    </body>
    </html>
  `;

  res.send(responseHtml);
};

// cancelUrl, nextUrl 처리
app.post("/api/cancUrl", handleRequest);
app.post("/api/nextUrl", handleRequest);

// "/" 경로로 접속하면 index.html 반환
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

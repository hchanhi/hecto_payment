const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// x-www-form-urlencoded 데이터를 파싱
app.use(bodyParser.urlencoded({ extended: true }));

// notiUrl: "OK" 텍스트 반환
app.all("/notiUrl", (req, res) => {
  console.log("✅ /notiUrl 호출됨:", req.method === "GET" ? req.query : req.body);
  res.send("OK");
});

// cancelUrl & nextUrl: 요청 데이터 화면에 표시
const handleRequest = (req, res) => {
  const method = req.method;
  const params = method === "GET" ? req.query : req.body;

  let responseHtml = `
    <html>
    <head><title>URL Handler</title></head>
    <body>
      <h2>${req.path} 호출됨 (${method})</h2>
      <ul>
  `;

  Object.keys(params).forEach((key) => {
    responseHtml += `<li><strong>${key}:</strong> ${params[key]}</li>`;
  });

  responseHtml += `
      </ul>
    </body>
    </html>
  `;

  res.send(responseHtml);
};

// cancelUrl, nextUrl 처리
app.all("/cancUrl", handleRequest);
app.all("/nextUrl", handleRequest);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

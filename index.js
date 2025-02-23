
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
  console.log(`✅ ${req.path} 호출됨 (POST)`);
  const method = req.method;
  let title = req.path === "/api/cancUrl" ? "결제 취소" : "결제 완료";

  let responseHtml = `
  <html>
  <head>
    <title>${title}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f9;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .container {
        background-color: #fff;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
      }
      h2 {
        color: #333;
      }
      ul {
        list-style-type: none;
        padding: 0;
      }
      li {
        padding: 8px;
        background-color: #f9f9f9;
        margin: 4px 0;
        border-radius: 4px;
      }
      strong {
        color: #333;
      }
    </style>
    <script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  </script>
  <script defer src="/_vercel/insights/script.js"></script>
  </head>
  <body>
    <div class="container">
      <h2>${title} (${method})</h2>
      <ul>
  `;

  Object.keys(req.body).forEach((key) => {
    responseHtml += `<li><strong>${key}:</strong> ${req.body[key]}</li>`;
  });

  responseHtml += `
      </ul>
    </div>
    <script>
      if (window.opener) {
      console.log("안녕")
        window.close();
      }
    </script>
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

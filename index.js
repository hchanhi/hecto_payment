
const express = require("express");
const bodyParser = require("body-parser");
const axios = require('axios');
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// x-www-form-urlencoded 데이터 파싱
app.use(bodyParser.urlencoded({ extended: true }));

const staticPath = path.join(__dirname, "public");
app.use(express.static(staticPath));

// notiUrl: "OK" 텍스트 반환
app.post("/api/notiUrl", (req, res) => {
  console.log("✅ /api/notiUrl 호출됨:", req.body);
  res.send("OK");
});

const handleRequest = (req, res) => {
  console.log(`✅ ${req.path} 호출됨 (POST)`);
  const queryParams = new URLSearchParams(req.body).toString();
  res.redirect(`/result.html?${queryParams}`);
};


// 클라이언트로부터 오는 POST 요청을 처리
app.post('/api/sendCancel', (req, res) => {
  const requestData = req.body.requestData;
  const hectorScriptUrl = req.body.hectorScriptUrl; // 클라이언트에서 보내는 목적지 URL
  console.log(requestData);
  
  axios
    .post(hectorScriptUrl, requestData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
    .then((response) => {
      console.log('응답:', response.data);
      res.status(200).json(response.data);
    })
    .catch((error) => {
      console.error('오류:', error.message);
      if (error.response) {
        console.error('응답 데이터:', error.response.data);
        res.status(error.response.status || 500).json({
          success: false,
          message: '요청 전송 중 오류가 발생했습니다.',
          error: error.response.data, // 목적지 서버의 에러 응답 포함
        });
      } else {
        res.status(500).json({
          success: false,
          message: '요청 전송 중 알 수 없는 오류가 발생했습니다.',
        });
      }
    });
});



// cancelUrl, nextUrl 처리
app.post("/api/cancUrl", handleRequest);
app.post("/api/nextUrl", handleRequest);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "payment.html"));
});

app.get("/cancel", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cancel.html"));
});

app.get("/direct", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "direct.html"));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

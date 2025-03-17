const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/sendCancel', (req, res) => {
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

module.exports = router;

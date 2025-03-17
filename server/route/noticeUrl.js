const express = require('express');
const router = express.Router();

router.post('/api/notiUrl', (req, res) => {
  console.log("✅ /api/notiUrl 호출됨:", req.body);
  res.send("OK");
});

module.exports = router;

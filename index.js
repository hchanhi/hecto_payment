const { app, port } = require('./server/serverConfig');
const path = require('path');
const notiUrlRouter = require('./server/routes/notiUrl');
const sendCancelRouter = require('./server/routes/sendCancel');
const handleRequest = require('./server/routes/handleRequest');
const errorHandler = require('./server/routes/errorHandler');

app.use('/api', notiUrlRouter);
app.use('/api', sendCancelRouter);

app.post("/api/cancUrl", handleRequest);
app.post("/api/nextUrl", handleRequest);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "payment.html"));
});

app.get("/cancel", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cancel.html"));
});

app.get("/direct", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "directPay.html"));
});

app.use(errorHandler); // 에러 핸들러는 모든 라우트 뒤에 위치해야 합니다.

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

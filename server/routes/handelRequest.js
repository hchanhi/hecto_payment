const handleRequest = (req, res) => {
  console.log(`✅ ${req.path} 호출됨 (POST)`);
  const queryParams = new URLSearchParams(req.body).toString();
  res.redirect(`/result.html?${queryParams}`);
};

module.exports = handleRequest;

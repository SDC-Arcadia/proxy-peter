const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 80;
// const PORT = 3999;

//middleware to redirect requests to root to productId of P001
app.use((req, res, next) => {
  if (req.url === '/') {
    res.redirect(301, req.url + '?productId=P001');
  }
  next();
});

app.use(express.static(path.resolve(__dirname, '../client')));

app.listen(PORT, () => console.log(`Proxy Server Listening on Port ${PORT}`));
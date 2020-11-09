const proxy = require('express-http-proxy');
const newrelic = require('newrelic');
const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 80;
const imageModule = process.env.IMAGE_URL;

//middleware to redirect requests to root to productId of 1
app.use((req, res, next) => {
  if (req.url === '/') {
    res.redirect(301, req.url + '?productId=1');
  }
  next();
});

// Picture Service Proxy Here (Port 3001)
app.use('/photos', proxy(imageModule, {
  proxyReqPathResolver: function proxyReq(req) {
    const parts = req.url.split('/');
    const productId = parts[1];
    const pictureId = parts[2];

    console.log(parts);

    if (productId === undefined || productId === 0) {
      return `${imageModule}/photos/1`;
    } else if (pictureId === undefined) {
      return `${imageModule}/photos/${productId}`;
    }
    return `${imageModule}/photos/${productId}/${pictureId}`;
  },
}));

app.use(express.static(path.resolve(__dirname, '../client')));

app.listen(PORT, () => console.log(`Proxy Server Listening on Port ${PORT}`));

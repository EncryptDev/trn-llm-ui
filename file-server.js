// file-server.js
const express = require('express');
const path = require('path');

const app = express();
const port = 4000;

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.listen(port, () => {
  console.log(`🟢 Upload server running at http://localhost:${port}/uploads`);
});

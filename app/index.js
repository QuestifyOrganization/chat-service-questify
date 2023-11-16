const express = require('express');
const app = express();

const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Bem-vindo ao seu servidor Express' });
});

app.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is now listening on http://${host}:${port}`);
});

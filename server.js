// server.js
import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Sert tous les fichiers statiques générés dans /dist
app.use(express.static(path.resolve('dist')));

// Pour toute route, renvoyer index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.resolve('dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

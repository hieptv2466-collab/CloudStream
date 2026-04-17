import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Endpoint for Movie Data
  app.get('/api/movies', async (req, res) => {
    const sheetId = req.query.id || '1VayeOn2LK8aUOJvAFguh48LLf0y7xv11y0FeQMcKuNE';
    try {
      const response = await fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`);
      const text = await response.text();
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonString = text.substring(jsonStart, jsonEnd);
      const data = JSON.parse(jsonString);

      const rows = data.table.rows;
      const movies = rows.map((row: any) => {
        const cells = row.c;
        return {
          name: cells[0]?.v || '',
          url: cells[1]?.v || '',
          poster: cells[2]?.v || '',
          episode: String(cells[3]?.v || '')
        };
      }).filter((m: any) => m.name && m.name !== 'Name');

      res.json(movies);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch spreadsheet data' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

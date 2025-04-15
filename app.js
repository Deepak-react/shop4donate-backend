import express, { json } from "express";
import routes from './routes/routes.js';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(json()); // to parse JSON request bodies
app.use('/api', routes); // mount routes under /api

app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});

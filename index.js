import 'dotenv/config.js';
import { app } from './src/app.cjs';

app.listen(process.env.PORT, () =>
  console.log(`listening on ${process.env.PORT}`),
);

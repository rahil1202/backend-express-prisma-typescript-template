import express, { type Express, type Request, type Response } from 'express';

import { connectToDatabase } from './configs/db.ts';
import { envConfig } from './configs/env.ts';
import { errorHandler } from './middlewares/errorHandler.ts';
import { applyMiddleware } from './middlewares/index.ts';
import { notFound } from './middlewares/notFound.ts';
import auth from './routes/authRoute.ts';

const app: Express = express();

app.use(express.json({ limit: '1mb' }));

const initializeApp = async () => {
  try {
    await connectToDatabase();

    applyMiddleware(app);

    const PORT = envConfig.PORT || 5000;
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error initializing app:', error);
    process.exit(1);
  }
};

initializeApp();

// Routes
app.use('/api/v1/auth', auth);

app.get('/', (_req: Request, res: Response) => {
  res.send('Phew-Phew,  API is running! 🚀');
});

app.use(notFound);
app.use(errorHandler);

export default app;

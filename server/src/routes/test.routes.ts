import { Express, Request, Response } from 'express';
import { env, isProduction } from '../config/env';
import { resetDatabase } from '../utils/resetDatabase';

/**
 * Registers test-support-only routes. These are disabled in production and,
 * when enabled, still require a shared secret header so they can't be hit
 * accidentally. Intended to be called from Cucumber/Selenium test hooks to
 * reset the database to a clean state before each scenario.
 */
export function registerTestRoutes(app: Express): void {
  if (isProduction) {
    return;
  }

  app.post('/api/test/reset', async (req: Request, res: Response) => {
    const providedSecret = req.header('x-test-reset-secret');
    if (!env.testResetSecret || providedSecret !== env.testResetSecret) {
      res.status(403).json({ message: 'Invalid or missing test reset secret' });
      return;
    }

    await resetDatabase();
    res.status(204).send();
  });
}

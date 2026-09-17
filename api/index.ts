import type { Request, Response } from 'express';
import app from '../server';

export default function handler(req: Request, res: Response) {
  const routedPath = req.query.path;
  const path = Array.isArray(routedPath) ? routedPath.join('/') : String(routedPath || '');
  req.url = `/api/${path}`;
  return app(req, res);
}

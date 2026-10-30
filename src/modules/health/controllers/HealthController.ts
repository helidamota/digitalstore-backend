import { Request, Response } from 'express';

class HealthController {
  public index(req: Request, res: Response): Response {
    return res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'DigitalStore API',
    });
  }
}

export default new HealthController();

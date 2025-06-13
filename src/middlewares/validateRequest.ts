/* eslint-disable security/detect-object-injection */
import type { Request, Response, NextFunction } from 'express';
import { ZodError, type ZodObject, type ZodRawShape } from 'zod';

type AnyZodObject = ZodObject<ZodRawShape>;

type ValidationTarget = 'body' | 'query' | 'params' | 'headers' | 'cookies';

type ZodSchemaGroup = Partial<Record<ValidationTarget, AnyZodObject>>;

export const validateRequest = (schemas: ZodSchemaGroup) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      for (const key of Object.keys(schemas) as ValidationTarget[]) {
        const schema = schemas[key];
        if (schema) {
          const result = schema.safeParse(req[key]);
          if (!result.success) {
            res.status(400).json({
              success: false,
              message: `Validation failed in ${key}`,
              errors: result.error.errors.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
              })),
            });
            return;
          }
          req[key] = result.data;
        }
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: err.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
        return;
      }
      next(err);
    }
  };
};

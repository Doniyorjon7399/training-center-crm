import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  private readonly excludeFields = [
    'password',
    'passwordHash',
    'salt',
    'resetToken',
    'refreshToken',
    'apiKey',
    'secret',
    'privateKey',
    'accessToken',
    '__v',
    'deletedAt',
  ];

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        const cleanedData = this.cleanData(data);

        const result = {
          success: true,
          statusCode: response.statusCode,
          timestamp: new Date().toISOString(),
          path: request.url,
          method: request.method,
          data: cleanedData,
        };

        if (
          !cleanedData ||
          (Array.isArray(cleanedData) && cleanedData.length === 0)
        ) {
          result.data = null;
          result['message'] = 'No data found';
        }

        if (this.isPaginatedData(cleanedData)) {
          return {
            ...result,
            pagination: {
              total: cleanedData.total || 0,
              page: cleanedData.page || 1,
              limit: cleanedData.limit || 10,
              totalPages: Math.ceil(
                (cleanedData.total || 0) / (cleanedData.limit || 10),
              ),
            },
            data: cleanedData.data || cleanedData.items,
          };
        }

        return result;
      }),
    );
  }

  private cleanData(data: any): any {
    if (!data) return data;

    if (Array.isArray(data)) {
      return data.map((item) => this.cleanObject(item));
    }

    if (typeof data === 'object') {
      return this.cleanObject(data);
    }

    return data;
  }

  private cleanObject(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;

    const cleaned: any = {};

    for (const [key, value] of Object.entries(obj)) {
      if (this.excludeFields.includes(key)) {
        continue;
      }

      if (Array.isArray(value)) {
        cleaned[key] = value.map((item) =>
          typeof item === 'object' ? this.cleanObject(item) : item,
        );
      } else if (
        value &&
        typeof value === 'object' &&
        value.constructor === Object
      ) {
        cleaned[key] = this.cleanObject(value);
      } else {
        cleaned[key] = value;
      }
    }

    return cleaned;
  }

  private isPaginatedData(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      (data.hasOwnProperty('total') ||
        data.hasOwnProperty('page') ||
        data.hasOwnProperty('limit') ||
        data.hasOwnProperty('items') ||
        data.hasOwnProperty('data'))
    );
  }
}

@Injectable()
export class AdvancedTransformInterceptor implements NestInterceptor {
  constructor(
    private readonly config: {
      excludeFields?: string[];
      includeMetadata?: boolean;
      includePagination?: boolean;
      transformKeys?: boolean;
    } = {},
  ) {}

  private readonly defaultExcludeFields = [
    'password',
    'passwordHash',
    'salt',
    'resetToken',
    'refreshToken',
    'apiKey',
    'secret',
    'privateKey',
    'accessToken',
    '__v',
    'deletedAt',
  ];

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const startTime = Date.now();

    return next.handle().pipe(
      map((data) => {
        const excludeFields =
          this.config.excludeFields || this.defaultExcludeFields;
        const cleanedData = this.cleanData(data, excludeFields);

        const result: any = {
          success: true,
          data: cleanedData,
        };

        if (this.config.includeMetadata !== false) {
          result.meta = {
            statusCode: response.statusCode,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            processingTime: `${Date.now() - startTime}ms`,
            version: 'v1',
          };
        }

        if (
          this.config.includePagination !== false &&
          this.isPaginatedData(cleanedData)
        ) {
          result.pagination = this.extractPagination(cleanedData);
          result.data =
            cleanedData.data || cleanedData.items || cleanedData.results;
        }

        return result;
      }),
    );
  }

  private cleanData(data: any, excludeFields: string[]): any {
    if (!data) return data;

    if (Array.isArray(data)) {
      return data.map((item) => this.cleanObject(item, excludeFields));
    }

    if (typeof data === 'object') {
      return this.cleanObject(data, excludeFields);
    }

    return data;
  }

  private cleanObject(obj: any, excludeFields: string[]): any {
    if (!obj || typeof obj !== 'object') return obj;

    const cleaned: any = {};

    for (const [key, value] of Object.entries(obj)) {
      if (
        excludeFields.some((field) =>
          key.toLowerCase().includes(field.toLowerCase()),
        )
      ) {
        continue;
      }

      let processedKey = key;

      if (this.config.transformKeys) {
        processedKey = this.camelToSnake(key);
      }

      if (Array.isArray(value)) {
        cleaned[processedKey] = value.map((item) =>
          typeof item === 'object'
            ? this.cleanObject(item, excludeFields)
            : item,
        );
      } else if (
        value &&
        typeof value === 'object' &&
        value.constructor === Object
      ) {
        if (value instanceof Date) {
          cleaned[processedKey] = value;
        } else {
          cleaned[processedKey] = this.cleanObject(value, excludeFields);
        }
      } else {
        cleaned[processedKey] = value;
      }
    }

    return cleaned;
  }

  private isPaginatedData(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      (data.hasOwnProperty('total') ||
        data.hasOwnProperty('page') ||
        data.hasOwnProperty('limit') ||
        data.hasOwnProperty('items') ||
        data.hasOwnProperty('data') ||
        data.hasOwnProperty('results'))
    );
  }

  private extractPagination(data: any) {
    const total = data.total || data.totalCount || 0;
    const page = data.page || data.currentPage || 1;
    const limit = data.limit || data.pageSize || data.size || 10;

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    };
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}

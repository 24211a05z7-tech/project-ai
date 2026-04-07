import { PaginationOptions, PaginatedResult } from '../types';
import { Request } from 'express';

export function getPaginationOptions(query: Request['query']): PaginationOptions {
  const page = Math.max(1, parseInt(String(query.page || '1'), 10));
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit || '10'), 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildPaginatedResult<T>(
  data: T[],
  total: number,
  options: PaginationOptions
): PaginatedResult<T> {
  return {
    data,
    total,
    page: options.page,
    limit: options.limit,
    totalPages: Math.ceil(total / options.limit),
  };
}

export function getSortOptions(query: Request['query']): Record<string, 1 | -1> {
  const sortBy = String(query.sortBy || 'createdAt');
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  return { [sortBy]: sortOrder };
}

export function isDateInPast(date: Date): boolean {
  return date < new Date();
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function successResponse<T>(data: T, message?: string) {
  return { success: true, message, data };
}

export function errorResponse(error: string, message?: string) {
  return { success: false, error, message: message || error };
}

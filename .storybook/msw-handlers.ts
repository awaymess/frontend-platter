import { http, HttpResponse } from 'msw';

const mockDate = '2026-05-28T09:00:00.000Z';

export const mswHandlers = {
  api: [
    http.get('/api/backend/storybook/health', () =>
      HttpResponse.json({
        data: {
          service: 'frontend-platter',
          status: 'ok',
          version: '1.0.0',
        },
        success: true,
        message: 'Health check success',
        messageCode: 'SB_OK',
        dateNow: mockDate,
      })
    ),
    http.get('/api/backend/storybook/failure', () =>
      HttpResponse.json(
        {
          data: null,
          success: false,
          message: 'Mock API failure',
          messageCode: 'SB_FAIL',
          dateNow: mockDate,
        },
        { status: 500 }
      )
    ),
  ],
};

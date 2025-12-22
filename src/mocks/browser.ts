/**
 * 브라우저 환경용 MSW 설정
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);





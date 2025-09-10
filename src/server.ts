import { implement } from '@orpc/server';
import { routes } from './routes/index.ts';

export function createMailServer() {
	return implement(routes);
}

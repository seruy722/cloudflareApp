import { Prisma } from '@prisma/client';
import { LuciaError } from 'lucia';
import { ValiError, flatten } from 'valibot';
export const func = (error: Error) => {
	if (error instanceof ValiError) {
		const flattenErrors = flatten(error);
		return Object.assign({}, flattenErrors.nested);
	} else if (error instanceof LuciaError) {
		return { LuciaError: ['LuciaError'] };
	} else if (error instanceof Prisma.PrismaClientKnownRequestError) {
		return { email: ['Email is already exists!'] };
	}
};

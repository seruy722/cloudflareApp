import type { PageServerLoad, Actions } from './$types';
import { auth } from '$lib/server/lucia';
import { redirect, fail } from '@sveltejs/kit';
import { getRouterPath } from '$lib/settings';
import { ValiError, flatten, parse } from 'valibot';
import { LuciaError } from 'lucia';
import type { errorInputType } from '$lib/types/error-input-types';
import { schema } from '$lib/schemas/auth-schema';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	console.log('session', session);
	if (session) {
		throw redirect(302, getRouterPath('main'));
	}
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = Object.fromEntries(await request.formData()) as Record<string, string>;

		try {
			const { email, password } = parse(schema, formData);
			const key = await auth.useKey('email', email, password);

			const session = await auth.createSession({
				userId: key.userId,
				attributes: {
					createdAt: new Date()
				}
			});

			locals.auth.setSession(session);
		} catch (error) {
			if (error instanceof ValiError) {
				const flattenErrors = flatten(error);
				return fail(400, {
					errors: Object.assign({}, flattenErrors.nested)
				});
			} else if (error instanceof LuciaError) {
				const stringifyError = JSON.stringify(error);
				const parseError = JSON.parse(stringifyError);
				const needError: errorInputType = {};

				if (parseError.message === 'AUTH_INVALID_KEY_ID') {
					needError.email = ['Email does not exists!'];
				} else if (parseError.message === 'AUTH_INVALID_PASSWORD') {
					needError.password = ['Incorrect password or login!'];
					needError.email = ['Incorrect password or login!'];
				}
				return fail(400, {
					errors: needError
				});
			} else {
				return fail(400, {
					errors: { email: ['PrismaClientKnownRequestError'] }
				});
			}
		}

		throw redirect(302, getRouterPath('main'));
	}
};

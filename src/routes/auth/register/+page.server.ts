import type { PageServerLoad, Actions } from './$types';
import { auth } from '$lib/server/lucia';
import { redirect, fail } from '@sveltejs/kit';
import { getRouterPath } from '$lib/settings';
import { schema } from '$lib/schemas/auth-schema';
import { parse, ValiError, flatten } from 'valibot';
import { LuciaError } from 'lucia';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	console.log('session', session);
	if (session) {
		throw redirect(302, getRouterPath('main'));
	}
};

// const schema = object({
// 	email: string([email(), maxLength(191)]),
// 	username: optional(string([maxLength(191)])),
// 	password: string([minLength(6), maxLength(191)])
// });

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = Object.fromEntries(await request.formData()) as Record<string, string>;

		try {
			const { email, password, username } = parse(schema, formData);
			const user = await auth.createUser({
				key: {
					providerId: 'email',
					providerUserId: email,
					password
				},
				attributes: {
					username,
					email
				}
			});
			const session = await auth.createSession({
				userId: user.userId,
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
				return fail(400, {
					errors: error
				});
			} else {
				return fail(400, {
					errors: { email: ['Email is already exists!'] }
				});
			}
		}

		throw redirect(302, getRouterPath('main'));
	}
};

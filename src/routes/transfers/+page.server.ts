import type { PageServerLoad, Actions } from './$types';
import { parse, ValiError, flatten } from 'valibot';
import { transferSchema, transferRecipientSchema } from '$lib/schemas/transfers-schema';
import { fail, redirect } from '@sveltejs/kit';
import { LuciaError } from 'lucia';
import { client } from '$lib/prisma-servive';
import { getRouterPath } from '$lib/settings';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(302, getRouterPath('main'));
	}
	const transfers = await client.transfers.findMany({
		include: {
			user: {
				select: {
					username: true
				}
			},
			clientCode: true,
			recipient: true
		}
	});
	return { transfers };
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const formData = Object.fromEntries(await request.formData()) as Record<string, string>;
		console.log('create', formData);
		try {
			const resParse = parse(transferSchema, formData);
			console.log('resParse', resParse);
			const session = await locals.auth.validate();
			console.log('session', session);

			const result = await client.transfers.create({
				data: {
					userId: session.user.userId,
					...resParse
				}
			});
			return result;
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
			}
		}

		return formData;
	},
	createRecipient: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData()) as Record<string, string>;
		console.log('createRecipient', formData);

		try {
			const resParse = parse(transferRecipientSchema, formData);
			console.log('resParse', resParse);

			const result = await client.transferRecipient.create({
				data: resParse
			});
			console.log('result', result);
			return result;
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
			}
			return fail(400, {
				errors: { name: ['Name is already exist!'] }
			});
		}
	}
};

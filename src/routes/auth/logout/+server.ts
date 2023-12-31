import { auth } from '$lib/server/lucia';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getRouterPath } from '$lib/settings';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(302, getRouterPath('main'));
	}

	await auth.invalidateSession(session.sessionId);
	locals.auth.setSession(null);

	throw redirect(302, getRouterPath('main'));
};

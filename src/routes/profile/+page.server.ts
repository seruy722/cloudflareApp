import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getRouterPath } from '$lib/settings';
import { auth } from '$lib/server/lucia';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (!session) {
		throw redirect(302, getRouterPath('main'));
	} else {
		const user = await auth.getUser(session.user.userId);
		console.log('user', user);
		return { user };
	}
};

import type { LayoutServerLoad } from './$types';
import { auth } from '$lib/server/lucia';
import { client } from '$lib/prisma-servive';

export const load = (async ({ locals }) => {
	// const userCl = await client.user.findFirst({
	// 	where: {
	// 		id: 'cv6g5y8g55lm492'
	// 	},
	// 	select: {
	// 		role: {
	// 			select: {
	// 				permissions: {
	// 					select: {
	// 						permission: {
	// 							include: {
	// 								object: true
	// 							}
	// 						}
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// });
	const clients = await client.user.findFirst({
		where: {
			id: 'cv6g5y8g55lm492'
		},
		include: {
			transfers: true
		}
	});
	const session = await locals.auth.validate();

	if (session) {
		const user = await auth.getUser(session.user.userId);
		console.log('user', user);
		return { user, asd: clients };
	}
	return { user: null, asd: clients };
}) satisfies LayoutServerLoad;

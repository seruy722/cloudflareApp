import type { RequestHandler } from './$types';
import { client } from '$lib/prisma-servive';
import { json } from '@sveltejs/kit';
import type { TransferRecipient } from '@prisma/client';

const func = (array: TransferRecipient[], field: keyof TransferRecipient) =>
	array.map((item: TransferRecipient) => ({ id: item.id, title: item[field] }));

export const GET: RequestHandler = async () => {
	const recipients = await client.transferRecipient.findMany();
	return json(func(recipients, 'name'));
};

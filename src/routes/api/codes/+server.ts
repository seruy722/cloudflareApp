import type { RequestHandler } from './$types';
import { client } from '$lib/prisma-servive';
import { json } from '@sveltejs/kit';
import type { ClientCode } from '@prisma/client';

const func = (array: ClientCode[], field: keyof ClientCode) =>
	array.map((item: ClientCode) => ({ id: item.id, title: item[field] }));

export const GET: RequestHandler = async () => {
	const codes = await client.clientCode.findMany();
	return json(func(codes, 'code'));
};

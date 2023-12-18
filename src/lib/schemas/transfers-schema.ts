import {
	string,
	object,
	optional,
	maxLength,
	enum_,
	number,
	transform,
	toTrimmed,
	minLength,
	minValue,
	maxValue,
	date
} from 'valibot';
import { TransferMethod, TransferStatus } from '@prisma/client';

const transferSchema = object({
	clientCodeId: transform(string(), (input) => Number(input), number([minValue(1)])),
	transferRecipientId: transform(string(), (input) => Number(input), number([minValue(1)])),
	sum: transform(
		string([toTrimmed()]),
		(input) => Number(input),
		number([minValue(1), maxValue(1000000)])
	),
	commission: optional(
		transform(
			string([toTrimmed()]),
			(input) => Number(input),
			number([minValue(0), maxValue(1000)])
		)
	),
	method: enum_(TransferMethod),
	status: enum_(TransferStatus),
	dateIssued: optional(
		transform(string(), (input) => new Date(input), date([minValue(new Date())]))
	),
	notation: optional(string([toTrimmed(), maxLength(191)]))
});

const transferRecipientSchema = object({
	name: string([minLength(1), maxLength(191)]),
	phone: string([minLength(10), maxLength(191)])
});

export { transferSchema, transferRecipientSchema };

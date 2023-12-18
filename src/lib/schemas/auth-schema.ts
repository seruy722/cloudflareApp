import { string, email, object, minLength, optional, maxLength } from 'valibot';
const schema = object({
	email: string([email(), maxLength(191)]),
	username: optional(string([maxLength(191)])),
	password: string([minLength(6), maxLength(191)])
});

export { schema };

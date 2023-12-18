export type errorInputAuthType = {
	password?: string[];
	username?: string[];
	email?: string[];
};

export type errorInputRecipientType = {
	name?: string[];
	phone?: string[];
};

export type errorInputAddTransferDialogType = {
	transferRecipientId?: string[];
	clientCodeId?: string[];
	sum?: string[];
	commission?: string[];
	method?: string[];
	status?: string[];
	notation?: string[];
	dateIssued?: string[];
};

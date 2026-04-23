const endpoints = (params?: string | number, params2?: string | number) => {
	const envURL =
		process.env.STEALTH_ENDPOINT || process.env.NEXT_PUBLIC_STEALTH_ENDPOINT

	if (!envURL) throw new Error("Missing env variables")

	const user = {
		register: `${envURL}/register`,
		profile: `${envURL}/profile/info`,
		activate: `${envURL}/activate?key=${params}`,
		navMenu: `${envURL}/profile`,
	}

	const auth = {
		login: `${envURL}/authenticate`,
		logout: `${envURL}/logout`,
		"forgot-password": `${envURL}/account/reset-password/init`,
		"reset-password": `${envURL}/account/reset-password/finish`,
		"change-password": `${envURL}/account/change-password`,
	}

	const credit = {
		requestnewcredit: `${envURL}/credit-lines`,
		getcredithistory: `${envURL}/credit-lines?${params}`,
		"credit-type": `${envURL}/credit-line-types`,
		"initiate-repay": `${envURL}/repayments/initiate`,
		"finish-repay": `${envURL}/repayments/paid`,
	}

	const banks = {
		list: `${envURL}/payments/get-banks`,
		verify: `${envURL}/payments/name-inquiry?accountNumber=${params}&bankCode=${params2}`,
	}

	const account = {
		"edit-profile": `${envURL}/account`,
		"upgrade-account": `${envURL}/businesses`,
	}

	return {
		user,
		auth,
		account,
		credit,
		banks,
	}
}

export default endpoints

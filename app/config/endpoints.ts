const endpoints = (params?: string | number) => {
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
	}

	const credit = {
		requestnewcredit: `${envURL}/credit-lines`,
		getcredithistory: `${envURL}/credit-lines`,
		"credit-type": `${envURL}/credit-line-types`,
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
	}
}

export default endpoints

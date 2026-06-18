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
		"get-admin-credit": `${envURL}/credit-lines/admin?${params}`,
		"update-credit-status": `${envURL}/credit-lines/${params}/status`,
		"credit-overview": `${envURL}/admin/credit-lines/stats`,
	}

	const businesses = {
		list: `${envURL}/businesses?${params}`,
		"business-details": `${envURL}/businesses/${params}`,
		"business-stats": `${envURL}/admin/businesses/stats`,
		"update-business-status": `${envURL}/businesses/${params}/status`,
		"business-directors": `${envURL}/businesses/${params}/directors`,
		"business-directors-details": `${envURL}/businesses/${params}/directors/${params2}`,
		"update-business-directors": `${envURL}/businesses/${params}/directors/${params2}/status`,
		"business-documents": `${envURL}/documents?${params}`,
		"business-documents-stats": `${envURL}/admin/documents/stats`,
		"update-business-document": `${envURL}/documents/${params}/status`,
		"business-overview": `${envURL}/admin/businesses/${params}/overview`,
		"view-document": `${envURL}/documents/${params}`,
	}

	const transactions = {
		"view-transactions": `${envURL}/admin/transactions?${params}&sort=date,desc`,
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
		businesses,
		transactions,
	}
}

export default endpoints

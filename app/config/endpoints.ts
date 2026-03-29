const endpoints = (params?: string | number) => {
  const env = process.env.NODE_ENV;
  const local =
    process.env.STEALTH_ENDPOINT_DEV ||
    process.env.NEXT_PUBLIC_STEALTH_ENDPOINT_DEV;
  const prod =
    process.env.STEALTH_ENDPOINT_PROD ||
    process.env.NEXT_PUBLIC_STEALTH_ENDPOINT_PROD;

  if (!local || !prod) throw new Error("Missing env variables");

  const baseUrl = env === "development" ? local : prod;

  const user = {
    register: `${baseUrl}/register`,
    profile: `${baseUrl}/profile/info`,
    activate: `${baseUrl}/activate?key=${params}`,
  };

  const auth = {
    login: `${baseUrl}/authenticate`,
    logout: `${baseUrl}/logout`,
    "change-password": `${baseUrl}/account/change-password`,
  };

  const credit = {
    requestnewcredit: `${baseUrl}/creditline`,
    getcredithistory: `${baseUrl}/creditlines`,
  };

  const account = {
    "edit-profile": `${baseUrl}/account`,
  };

  return {
    user,
    auth,
    account,
    credit,
  };
};

export default endpoints;

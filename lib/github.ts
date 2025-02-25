interface IGitEmailData {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: true;
}

export async function getAccessToken(code: string, url: string) {
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();
  const accessTokenUrl = `${url}?${accessTokenParams}`;
  const accessTokenResponse = await fetch(accessTokenUrl, {
    method: "POST",
    headers: { Accept: "application/json" },
  });

  const { error, access_token } = await accessTokenResponse.json();
  if (error) {
    return new Response(null, {
      status: 400,
    });
  }
  return access_token;
}

export async function getGithubProfile(access_token: string, url: string) {
  const userProfileResponse = await fetch(url, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });
  const gitProfile = await userProfileResponse.json();
  return gitProfile;
}

export async function getUserEmail(access_token: string, url: string) {
  const userEmailResponse = await fetch(url, {
    headers: { Authorization: `Bearer ${access_token}` },
    cache: "no-cache",
  });

  const emails = await userEmailResponse.json();
  console.log(emails);
  const emailData = emails.find(
    (email: IGitEmailData) => email.primary === true && email.verified === true
  );

  return emailData;
}

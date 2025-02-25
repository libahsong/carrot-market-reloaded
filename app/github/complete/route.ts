import db from "@/lib/db";
import { getAccessToken, getGithubProfile, getUserEmail } from "@/lib/github";
import { loginSession } from "@/lib/session";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return new Response(null, {
      status: 400,
    });
  }
  const tokenUrl = "https://github.com/login/oauth/access_token";
  const userUrl = "https://api.github.com/user";
  const emailUrl = "https://api.github.com/user/emails";

  const access_token = await getAccessToken(code, tokenUrl);

  const { id, avatar_url, login } = await getGithubProfile(
    access_token,
    userUrl
  );

  const emailData = await getUserEmail(access_token, emailUrl);

  const gitUser = await db.user.findUnique({
    where: { github_id: id + "" },
    select: { id: true, username: true },
  });
  if (gitUser) {
    await loginSession(gitUser);
  }

  const user = await db.user.findUnique({
    where: { username: login },
    select: { id: true, username: true },
  });

  const newUser = await db.user.create({
    data: {
      username: user?.username ? login + id : login,
      github_id: id + "",
      avatar: avatar_url,
      email: emailData.email,
    },
    select: { id: true },
  });

  await loginSession(newUser);
}

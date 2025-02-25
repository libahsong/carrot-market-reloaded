import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface SessionContent {
  id?: number;
}

export default function getSession() {
  return getIronSession<SessionContent>(cookies(), {
    cookieName: "delecious-karrot",
    password: process.env.COOKIE_PASSWORD!,
  });
}

interface UserId {
  id: number;
}

export async function loginSession(user: UserId) {
  const session = await getSession();
  session.id = user.id;
  await session.save();
  return redirect("/profile");
}

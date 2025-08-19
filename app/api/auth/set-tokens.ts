import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { accessToken, refreshToken } = req.body;

    res.setHeader("Set-Cookie", [
      cookie.serialize("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 1800,
        path: "/",
      }),
      cookie.serialize("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 86400,
        path: "/",
      }),
    ]);

    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
};

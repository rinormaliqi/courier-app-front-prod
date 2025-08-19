import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Set-Cookie", [
    cookie.serialize("access_token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    }),
    cookie.serialize("refresh_token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    }),
  ]);

  res.status(200).json({ success: true });
};

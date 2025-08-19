import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = cookie.parse(req.headers.cookie || "");
  const accessToken = cookies.access_token;

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const response = await fetch("http://localhost:8080/auth/user-info", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) throw new Error("Failed to fetch user info");

    const userData = await response.json();

    // Map to your user interface
    const user = {
      id: userData.sub,
      name: userData.name || userData.preferred_username,
      email: userData.email,
      roles: userData.resource_access?.courier?.roles || [],
    };

    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
    console.log(error);
  }
};

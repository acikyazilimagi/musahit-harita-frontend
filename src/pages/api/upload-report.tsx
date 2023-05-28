import type { NextApiRequest, NextApiResponse } from "next";
import { S3 } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (!req.body || typeof req.body !== "object") {
    res.status(400).json({ error: "Invalid or missing body" });
    return;
  }

  const base64 = req.body.data as string;
  if (!base64) {
    res.status(400).json({ error: "Invalid or missing data" });
    return;
  }

  const parts = base64.split(",");
  const extension = parts[0].split("/")[1]?.split(";")[0];
  if (!extension) {
    res.status(400).json({ error: "No image type detected?" });
    return;
  }

  const data = parts[1];

  const s3 = new S3({
    region: process.env.NEXT_S3_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_S3_SECRET_ACCESS_KEY!,
    },
  });

  try {
    await s3
      .upload({
        Bucket: process.env.NEXT_S3_BUCKET || "",
        Key: `tutanak/secim.gonullu.io/${Date.now()}_${uuidv4()}.${extension}`,
        Body: Buffer.from(data, "base64"),
      })
      .promise();
    res.status(200).json({ msg: "File uploaded successfully" });
  } catch (err) {
    console.error(`Could not upload report`, err);
    res.status(500).json({ error: `Could not upload report` });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};

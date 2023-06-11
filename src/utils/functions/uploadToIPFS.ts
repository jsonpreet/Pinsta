import { S3 } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import {
  EVER_ENDPOINT,
  EVER_REGION,
  PINSTA_API_URL,
  NEXT_PUBLIC_EVER_BUCKET_NAME,
} from "../constants";
import type { IPFSUploadResult, PinstaAttachment } from "../custom-types";

export const everland = async (
  file: File,
  onProgress?: (percentage: number) => void
) => {
  try {
    const token = await axios.post(`${PINSTA_API_URL}/sts/token`, {
      fileSize: file.size,
    });
    const client = new S3({
      endpoint: EVER_ENDPOINT,
      region: EVER_REGION,
      credentials: {
        accessKeyId: token.data?.accessKeyId,
        secretAccessKey: token.data?.secretAccessKey,
        sessionToken: token.data?.sessionToken,
      },
      maxAttempts: 3,
    });
    const fileKey = uuidv4();
    const params = {
      Bucket: NEXT_PUBLIC_EVER_BUCKET_NAME,
      Key: fileKey,
      Body: file,
      ContentType: file.type,
    };
    const task = new Upload({
      client,
      queueSize: 3,
      params,
    });
    task.on("httpUploadProgress", (e) => {
      const loaded = e.loaded ?? 0;
      const total = e.total ?? 0;
      const progress = (loaded / total) * 100;
      onProgress?.(Math.round(progress));
    });
    await task.done();
    const result = await client.headObject(params);
    const metadata = result.Metadata;
    return {
      hash: metadata?.["ipfs-hash"],
      url: `ipfs://${metadata?.["ipfs-hash"]}`,
      type: file.type,
    };
  } catch (error) {
    console.log("[Error IPFS3 Media Upload]", error);
    return {
      url: "",
      type: file.type,
    };
  }
};

export const uploadFilesToIPFS = async (
  data: any
): Promise<PinstaAttachment[]> => {
  try {
    const files = Array.from(data);
    const attachments = await Promise.all(
      files.map(async (_: any, i: number) => {
        const file = data.item(i);
        const { url, type } = await everland(file);
        return {
          item: url,
          type: type,
          altTag: "",
        };
      })
    );

    return attachments;
  } catch {
    return [];
  }
};

export const uploadToIPFS = async (
  file: File,
  onProgress?: (percentage: number) => void
): Promise<IPFSUploadResult> => {
  const { hash, url, type } = await everland(file, onProgress);
  return { hash, url, type };
};

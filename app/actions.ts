'use server'

import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function generateImage(formData: FormData) {
  const file = formData.get("image") as File;
  if (!file) throw new Error("No image provided");

  const arrayBuffer = await file.arrayBuffer();
  const base64Data = Buffer.from(arrayBuffer).toString("base64");
  const dataUri = `data:${file.type};base64,${base64Data}`;

  console.log("🚀 Starting Image Generation (Nano Banana Pro)...");

  try {
    const output = await replicate.run(
      "google/nano-banana-pro",
      {
        input: {
          // ⚠️ 已更新為你的指定 Prompt
          prompt: "a CNY greeting photo of this person, in 9:16 ratio, do not include any text / 中文字 in the image. Do not temple in the image. Person should not hold fruit. 注意人物輪廓細節。",
          image_input: [dataUri],
          negative_prompt: "text, watermark, ugly, distorted, low quality, snake, zodiac, fruit, temple, religious symbols",
          resolution: "2K",
          aspect_ratio: "9:16",
          output_format: "png",
          safety_filter_level: "block_only_high"
        }
      }
    );

    return Array.isArray(output) ? output[0] : String(output);

  } catch (error) {
    console.error("❌ Image Generation Failed:", error);
    throw new Error("Failed to generate image.");
  }
}

export async function generateVideo(imageUrl: string) {
  console.log("🚀 Starting Video Generation (Veo)...");
  try {
    const output = await replicate.run(
      "google/veo-3.1-fast",
      {
        input: {
          image: imageUrl,
          prompt: "Slow cinematic camera pan, festive atmosphere, glowing lights, 4k resolution, smooth motion",
          duration: 4, 
          resolution: "720p", 
          aspect_ratio: "9:16",
          generate_audio: false
        }
      }
    );
    return String(output);
  } catch (error) {
    console.error("❌ Video Generation Failed:", error);
    throw new Error("Failed to generate video.");
  }
}

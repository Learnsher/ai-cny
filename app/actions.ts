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
          prompt: "a CNY greeting photo of this person, in 9:16 ratio. 光線柔和均勻, 營造專業時尚雜誌感。臉部呈現模特兒人物特徵, 輪廓立體自然加入自信的神情與眼神張力成品風格乾淨俐落，細節清晰, 樣貌輪廓需至少99%似模特兒。Do not add or remove eyeglasses of the person. Do not include any text / 中文字 / temple in the image. 半身照或近身照。",
          image_input: [dataUri],
          negative_prompt: "text, watermark, ugly, distorted, low quality, snake, zodiac, fruit, temple, religious symbols",
          resolution: "1K",
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
          prompt: "a CNY greeting video of this person, slow cinematic camera, festive atmosphere, 4k resolution, smooth motion",
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

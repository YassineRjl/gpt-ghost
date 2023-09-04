import fetch from "node-fetch";
import { GhostBlogPostType, OpenAIResponse, PromptType } from "./types";
const Converter = require("@tryghost/html-to-mobiledoc");

export const splitBySeparator = (content: string, separator: string) =>
  content.split(separator).map((item) => item.trim());

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const slug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

const htmlToMobiledoc = (html: string): string =>
  JSON.stringify(Converter.toMobiledoc(html));

export const formatBlogPost = ({
  title,
  post,
}: {
  title: string;
  post: string;
}): GhostBlogPostType["db"][number]["data"]["posts"][number] => {
  const date = new Date();
  return {
    title: title,
    slug: slug(title),
    mobiledoc: htmlToMobiledoc(post),
    type: "post",
    status: "published",
    locale: null,
    visibility: "public",
    email_recipient_filter: "all",
    created_at: date.toISOString(),
    updated_at: date.toISOString(),
    published_at: date.toISOString(),
  };
};

const fetchWithRetries = async (
  url: string,
  options: any,
  retryCount = 0
): Promise<any> => {
  const { ...remainingOptions } = options;
  const sleepForSeconds = 3000;
  const maxRetries = 401;
  try {
    const response = await fetch(url, remainingOptions);
    const chatGptData = (await response.json()) as OpenAIResponse;

    console.log("openai response ", chatGptData);
    if (
      (chatGptData.choices.length === undefined ||
        chatGptData.choices.length === 0) &&
      retryCount < maxRetries
    ) {
      console.log(
        `retry ${retryCount}/${maxRetries}. Error: ${chatGptData.error?.message}`
      );
      await sleep(sleepForSeconds);
      return await fetchWithRetries(url, options, retryCount + 1);
    }
    return chatGptData;
  } catch (error: any) {
    // if the retryCount has not been exceeded, call again
    console.log(`retry ${retryCount}/${maxRetries}. Error: ${error?.message}`);
    await sleep(sleepForSeconds);
    if (retryCount < maxRetries) {
      return await fetchWithRetries(url, options, retryCount + 1);
    }
    // max retries exceeded
    throw error;
  }
};

export const getChatgptOutput = async (
  prompt: PromptType,
  model: "4" | "3-16k"
): Promise<string> => {
  const modelMap = {
    "4": "gpt-4",
    "3-16k": "gpt-3.5-turbo-16k",
    "3": "gpt-3.5-turbo",
    "4-0314": "gpt-4-0314",
  };

  const data: OpenAIResponse = await fetchWithRetries(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.OPENAI_API_KEY,
      },
      body: JSON.stringify({
        model: modelMap[model],
        messages: prompt.messages,
        ...prompt.config,
      }),
    }
  );

  return data.choices[0].message.content;
};

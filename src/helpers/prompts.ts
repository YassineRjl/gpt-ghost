import { BACKTICKS } from "./constants";
import { PromptType } from "./types";

// generate long tail keywords from a single idea
export const getLongtailKeywordsPrompt = (input: string): PromptType => ({
  messages: [
    {
      role: "system",
      content: `Do not number the keywords.
Separate every long-tail keyword with this separator: ##`,
    },
    {
      role: "user",
      content: `Goal: Generate a list of 5 long-tail keywords related to: ${input}

Output: `,
    },
  ],
  config: {
    temperature: 0,
    max_tokens: 250,
    top_p: 0,
    frequency_penalty: 0,
    presence_penalty: 0,
  },
});

// generate an outline from the long tail keyword
export const getOutlinePrompt = (input: string): PromptType => ({
  messages: [
    {
      role: "system",
      content: `Generate an article outline that covers the topic given to you by the user in great detail.

Act as an expert. 

Include frameworks, stories, research, statistics.

Write an outline for exactly 10 detailed sections. Every section has at least 4 subsections.

No Roman numbers, use imperial numbers for main ideas and subideas: 1, 2, 3, 4, 5, 6, 7, 8, 9.

Ideas are on the topic and are catchy and straight to the point.`,
    },
    {
      role: "user",
      content: `Topic: ${input}

Output: `,
    },
  ],
  config: {
    temperature: 0,
    max_tokens: 1000,
    top_p: 0,
    frequency_penalty: 0,
    presence_penalty: 0,
  },
});

// generate an HTML blog post
export const getBlogPostPrompt = (input: string): PromptType => ({
  messages: [
    {
      role: "system",
      content: `You are now an expert who articulates ideas in more eloquent, easy to understand detail. Your job is to expand the outline given to you by the user into paragraphs. 

Instructions:
Write in 2nd voice.
Add lists, quotes, examples, and statistics.
Simple language.
Blend together the subpoints and link together the paragraphs using logical connectors.
Format as HTML.
Start with <section>.`,
    },
    {
      role: "system",
      content: `Outline: ${BACKTICKS}${input}${BACKTICKS}
      
      Output:`,
    },
  ],
  config: {
    temperature: 0,
    max_tokens: 5000,
    top_p: 0,
    frequency_penalty: 0,
    presence_penalty: 0,
  },
});

// generate title from the blog post
export const getTitlePrompt = (input: string): PromptType => ({
  messages: [
    // {
    //   role: "system",
    //   content: ``,
    // },
    {
      role: "system",
      content: `Article: ${BACKTICKS}${input}${BACKTICKS}
      
      Catchy title:`,
    },
  ],
  config: {
    temperature: 0,
    max_tokens: 100,
    top_p: 0,
    frequency_penalty: 0,
    presence_penalty: 0,
  },
});

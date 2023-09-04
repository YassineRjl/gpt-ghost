import { parse, stringify } from "csv";
import { readFileSync, writeFileSync } from "fs";
import { LOCAL_POSTS_PATH, SEPARATOR } from "./helpers/constants";
import {
  getBlogPostPrompt,
  getLongtailKeywordsPrompt,
  getOutlinePrompt,
  getTitlePrompt,
} from "./helpers/prompts";
import { LocalBlogPostType } from "./helpers/types";
import { getChatgptOutput, splitBySeparator } from "./helpers/utils";

export const generateLongTailKeywords = async (ideas: string[]) =>
  new Promise(async (resolve, reject) => {
    const data = [] as Pick<LocalBlogPostType, "idea" | "long_tail_keyword">[];
    // for every idea generate X long tail keywords
    for (const idea of ideas) {
      // generate 10 long tail keywords
      const longTailKeywords: string = await getChatgptOutput(
        getLongtailKeywordsPrompt(idea),
        "4"
      );
      //Split them
      for (const keyword of splitBySeparator(longTailKeywords, SEPARATOR)) {
        // Then store every long tail keyword with its respective user-input idea
        data.push({ idea, long_tail_keyword: keyword });
      }
    }
    // At the end save back to the csv file.
    stringify(data, { header: true }, (err, output) => {
      if (err) reject(err);
      writeFileSync(LOCAL_POSTS_PATH, output);
      resolve(output);
    });
  });

export const generateOutlines = async () =>
  new Promise(async (resolve, reject) => {
    const csv = readFileSync(LOCAL_POSTS_PATH, "utf-8");
    parse(
      csv,
      { columns: true },
      async (
        err,
        records: Pick<LocalBlogPostType, "long_tail_keyword" | "outline">[]
      ) => {
        if (err) throw err;
        // Define your batch size here
        const batchSize = 10;
        for (let i = 0; i < records.length; i += batchSize) {
          const batch = records.slice(i, i + batchSize);
          await Promise.all(
            batch.map(async (record) => {
              const outline: string = await getChatgptOutput(
                getOutlinePrompt(record.long_tail_keyword),
                "4"
              );
              record.outline = outline;
            })
          );
        }

        stringify(records, { header: true }, (err, output) => {
          if (err) reject(err);
          writeFileSync(LOCAL_POSTS_PATH, output);
          resolve(output);
        });
      }
    );
  });

export const generateBlogPosts = async () =>
  new Promise(async (resolve, reject) => {
    const csv = readFileSync(LOCAL_POSTS_PATH, "utf-8");
    parse(
      csv,
      { columns: true },
      async (
        err,
        records: Pick<LocalBlogPostType, "blog_post" | "outline">[]
      ) => {
        if (err) throw err;
        const batchSize = 10;
        for (let i = 0; i < records.length; i += batchSize) {
          const batch = records.slice(i, i + batchSize);
          await Promise.all(
            batch.map(async (record) => {
              const blogPost: string = await getChatgptOutput(
                getBlogPostPrompt(record.outline),
                "3-16k"
              );
              record.blog_post = blogPost;
            })
          );
        }
        stringify(records, { header: true }, (err, output) => {
          if (err) reject(err);
          writeFileSync(LOCAL_POSTS_PATH, output);
          resolve(output);
        });
      }
    );
  });

export const generateBlogPostsTitles = async () =>
  new Promise(async (resolve, reject) => {
    const csv = readFileSync(LOCAL_POSTS_PATH, "utf-8");
    parse(
      csv,
      { columns: true },
      async (
        err,
        records: Pick<LocalBlogPostType, "title" | "blog_post">[]
      ) => {
        if (err) throw err;
        const batchSize = 10;
        for (let i = 0; i < records.length; i += batchSize) {
          const batch = records.slice(i, i + batchSize);
          await Promise.all(
            batch.map(async (record) => {
              const blogPost: string = await getChatgptOutput(
                getTitlePrompt(record.blog_post),
                "3-16k"
              );
              record.title = blogPost;
            })
          );
        }
        stringify(records, { header: true }, (err, output) => {
          if (err) reject(err);
          writeFileSync(LOCAL_POSTS_PATH, output);
          resolve(output);
        });
      }
    );
  });

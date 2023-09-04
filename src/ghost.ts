import { parse } from "csv";
import fs, { readFileSync } from "fs";
import { GHOST_FILE_PATH, LOCAL_POSTS_PATH } from "./helpers/constants";
import { LocalBlogPostType } from "./helpers/types";
import { formatBlogPost } from "./helpers/utils";

export const prepareBlogPosts = async () => {
  const csv = readFileSync(LOCAL_POSTS_PATH, "utf-8");

  const blogPosts = await new Promise((resolve, reject) => {
    parse(csv, { columns: true }, (err, records: LocalBlogPostType[]) => {
      if (err) reject(err);
      resolve({
        db: [
          {
            meta: {
              exported_on: Date.now(),
              version: "5.34.1",
            },
            data: {
              posts: records.map((record) =>
                formatBlogPost({
                  title: record.title,
                  post: record.blog_post,
                })
              ),
            },
          },
        ],
      });
    });
  });

  fs.writeFileSync(GHOST_FILE_PATH, JSON.stringify(blogPosts));
};

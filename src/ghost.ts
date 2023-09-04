import { parse } from "csv";
import fs, { readFileSync } from "fs";
import { RESULT_PATH } from "./helpers/constants";
import { LocalBlogPostType } from "./helpers/types";
import { formatBlogPost } from "./helpers/utils";

export const prepareBlogPosts = async () => {
  const csv = readFileSync(RESULT_PATH, "utf-8");

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

  fs.writeFileSync("./src/ghost_blog_posts.json", JSON.stringify(blogPosts));
};

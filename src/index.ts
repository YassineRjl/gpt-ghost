import "dotenv/config";
import {
  generateBlogPosts,
  generateBlogPostsTitles,
  generateLongTailKeywords,
  generateOutline,
} from "./blog";
import { prepareBlogPosts } from "./ghost";

const keywords = ["ChatGPT in Finance"];

const writeBlogPosts = async () => {
  console.log("Generating long tail keywords...");
  await generateLongTailKeywords(keywords);
  console.log("Generating outlines...");
  await generateOutline();
  console.log("Generating blog posts...");
  await generateBlogPosts();
  console.log("Generating blog posts titles...");
  await generateBlogPostsTitles();
  console.log("Done!");
};

const deployBlogPosts = async () => {
  await prepareBlogPosts();
  console.log(`Your blog posts are ready, you can upload the file to ghost!
Please check this tutorial for more info: https://ghost.org/help/the-importer/#import-from-csv`);
};

(async () => {
  await writeBlogPosts();
  await deployBlogPosts();
})();

export type OpenAIResponse = {
  choices: { message: { content: string } }[];
  error?: {
    message: string;
  };
};

export type PromptType = {
  messages?: {
    content: string;
    role: "system" | "user";
  }[];
  config?: {
    temperature: number;
    max_tokens: number;
    top_p: number;
    frequency_penalty: number;
    presence_penalty: number;
  };
};

export type LocalBlogPostType = {
  idea: string;
  long_tail_keyword: string;
  outline: string;
  blog_post: string;
  title: string;
};

export type GhostBlogPostType = {
  db: {
    meta: {
      exported_on: number;
      version: string;
    };
    data: {
      posts: {
        title: string;
        slug: string;
        mobiledoc: string;
        type: string;
        status: string;
        locale: null;
        visibility: string;
        feature_image?: string;
        email_recipient_filter: string;
        created_at: string;
        updated_at: string;
        published_at: string;
      }[];
    };
  }[];
};

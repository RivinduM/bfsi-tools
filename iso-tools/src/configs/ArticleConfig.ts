export enum ArticleType {
  article = "Article",
  blog = "Blog",
  ebook = "Ebook",
}

export interface IArticle {
  title: string;
  link: string;
  type?: ArticleType;
}

export const articles: IArticle[] = [
  {
    title:
      "Steps to Achieving Successful APIM in Banking",
    link: "https://wso2.com/blogs/thesource/steps-to-achieving-successful-apim-in-banking/",
    type: ArticleType.blog,
  },
  {
    title: "Understanding the Current Moment in Banking APIs",
    link: "https://wso2.com/blogs/thesource/understanding-the-current-moment-in-banking-apis/",
    type: ArticleType.blog,
  },
  {
    title: "Accelerating Banking Innovation with Speed and Agility",
    link: "https://wso2.com/blogs/thesource/accelerating-banking-innovation-with-speed-and-agility/",
    type: ArticleType.blog,
  },
  {
    title: "The Need to Change in the Banking World",
    link: "https://wso2.com/blogs/thesource/the-need-to-change-in-the-banking-world/",
     type: ArticleType.blog,
  },
  {
    title: "One Simple Way to Make Your Banking APIs Profitable",
    link: "https://wso2.com/blogs/thesource/one-simple-way-to-make-your-banking-apis-profitable/",
     type: ArticleType.blog,
  },
  {
    title: "Five Banking API Use Cases Helping Banks Meet The Digital Adoption Boom",
    link: "https://wso2.com/ebook/5-banking-api-use-cases/",
     type: ArticleType.ebook,
  },
];

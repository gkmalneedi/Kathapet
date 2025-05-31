import { generateMoreArticles } from "./generate-articles";

generateMoreArticles()
  .then(() => {
    console.log("Article generation completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
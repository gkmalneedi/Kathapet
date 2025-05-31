import { addMissingCategoryContent } from "./add-missing-categories";

addMissingCategoryContent()
  .then(() => {
    console.log("Missing category content generation completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
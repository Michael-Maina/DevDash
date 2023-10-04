import filesController  from "./FilesController.js";

async function main() {
  try {
    await filesController.formatConverter('/home/murags/Dennis/DevDash/server/articles/markdown/intro_to_terminal.md');
    console.log('Test successful');
  } catch (error) {
    console.error(error);
  }
}

main();

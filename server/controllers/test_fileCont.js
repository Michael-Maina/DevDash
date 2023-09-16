const filesController = require("./FilesController");

async function main() {
  try {
    await filesController.formatConverter('./server/articles/markdown/intro_to_command_line.md');
    console.log('Test successful');
  } catch (error) {
    console.error(error);
  }
}

main();

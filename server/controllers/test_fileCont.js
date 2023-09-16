const filesController = require('./FilesController');

try {
  filesController.formatConverter('./test.md')

  console.log('Test successful');
} catch(error){
  console.error(error);
}

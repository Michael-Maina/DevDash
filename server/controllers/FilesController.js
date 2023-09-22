import createDOMPurify from 'dompurify';
import *  as fs from 'fs/promises';
import { JSDOM } from 'jsdom';
import { marked } from 'marked';
import db_client from '../utils/db.js';


class FilesController {
  async formatConverter(filePath) {
    /**
     * format_converter - reads a Markdown file and converts it to HTML
     *                  - the parsed HTML is sanitized then saved to the database/file
     * @filePath - path to Markdown file
     * Return - writes an HTML file in articles/html
     */
    try {
      // Read the Markdown file
      const md_data = (await fs.readFile(filePath)).toString();

      // Parse the Markdown into HTML
      const parsed_html = marked.parse(md_data);

      // Create DOM before sanitizing parsed HTML
      const window = new JSDOM('').window;
      const DOMPurify = createDOMPurify(window);

      // Sanitize parsed HTML and save it to file
      const clean_html = DOMPurify.sanitize(parsed_html);

      await fs.writeFile('test.html', clean_html);
      console.log('Test.html file created successfully');
      return;

    } catch(error) {
      // Handle error
      console.error(`Error while reading file: ${error}`)
    }
  }

  // static async get_html(title) {
  //   /**
  //    *
  //    */
  // }
}

const filesController = new FilesController();

module.exports = filesController;

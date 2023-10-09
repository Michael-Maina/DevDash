import db_client from '../utils/db.js';
import fs from 'fs/promises';
import { marked } from 'marked';
import cheerio from 'cheerio'; // Import cheerio

class FilesController {
  async formatConverter(filePath) {
    try {
      // Read the Markdown file
      const md_data = (await fs.readFile(filePath)).toString();

      // Parse the Markdown into HTML
      const parsed_html = marked.parse(md_data);

      // Load the HTML template
      const templatePath = '/home/twowheeledlad/alx-specialization/DevDash/frontend/tutorial.html'; // Update the path as needed
      const templateHtml = (await fs.readFile(templatePath)).toString();

      // Load the template HTML into cheerio
      const $ = cheerio.load(templateHtml);

      // Find the content div and insert the parsed HTML
      $('.content').html(parsed_html);

      // Get the modified HTML
      const modifiedHtml = $.html();

      // Write the modified HTML to a new file
      await fs.writeFile('/home/twowheeledlad/alx-specialization/DevDash/frontend/content_page.html', modifiedHtml);
      return;
    } catch (error) {
      // Handle error
      console.error(`Error while reading file: ${error}`);
    }
  }
  // static async get_html(title) {
  //   /**
  //    *
  //    */
  // }
}

const filesController = new FilesController();

export default filesController;

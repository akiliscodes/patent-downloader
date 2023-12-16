import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import cliProgress = require('cli-progress');

async function fetchFiles(urls: string[], outputDirectory: string): Promise<void> {
  // Ensure the output directory exists
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }
  // Initialize progress bar
  const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  progressBar.start(urls.length, 0);

  try {
    const downloadPromises = urls.map(async (url, index) => {
      const fileName = path.basename(url);
      const outputPath = path.join(outputDirectory, fileName);
      await fetchFile(url, outputPath);
      progressBar.increment();
    });

    await Promise.all(downloadPromises);
  } finally {
    // Stop the progress bar
    progressBar.stop();
  }
}

async function fetchFile(url: string, outputPath: string): Promise<void> {
  try {
    const response = await axios.get(url, { responseType: 'stream' });

    // Get total content length for the progress bar
    const totalLength = response.headers['content-length'];
    let downloadedLength = 0;

    // Initialize progress bar for individual file
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progressBar.start(Number(totalLength), 0);

    const writer = fs.createWriteStream(outputPath);

    response.data.on('data', (chunk:any) => {
      downloadedLength += chunk.length;
      progressBar.update(downloadedLength);
    });

    response.data.pipe(writer);

    return new Promise<void>((resolve, reject) => {
      writer.on('finish', () => {
        progressBar.stop();
        resolve();
      });

      writer.on('error', (err) => {
        progressBar.stop();
        reject(err);
      });
    });
  } catch (error:any) {
    throw new Error(`Error downloading file: ${error.message}`);
  }
}

export { fetchFiles };

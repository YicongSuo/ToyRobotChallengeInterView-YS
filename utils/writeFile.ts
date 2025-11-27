// Liberary
import { promises as fs } from 'fs';

/**
 * write report into file
 * @param content - content to write
 * @param filePath - default route ./result.txt
 */
 export const appendToFile = async(content: string, filePath: string = './result.txt'): Promise<void>=> {
  try {
    await fs.appendFile(filePath, content + '\n', 'utf8');
    console.log('✅ result has been added into the file');
  } catch (error) {
    console.error('❌ fail to write:', error);
    throw error;
  }
}
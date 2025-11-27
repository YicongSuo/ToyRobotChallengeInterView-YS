// Liberary
import { promises as fs } from 'fs';

/**
 * 追加内容到文件
 * @param content - 要写入的内容
 * @param filePath - 文件路径,默认为 result.txt
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
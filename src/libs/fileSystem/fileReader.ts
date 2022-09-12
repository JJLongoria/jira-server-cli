/* eslint-disable unicorn/filename-case */
/* eslint-disable max-depth */
/* eslint-disable complexity */
import { Stats } from 'node:fs';
import { FileFilters } from '../types';
import { StrUtils } from '../utils/strUtils';
import { FileChecker } from './fileChecker';
import fs = require('fs');
import path = require('path');

/**
 * Class to read files, documents and folders from file system
 */
export const FileReader = {

    /**
     * Method to read a file synchronously
     * @param {string} filePath file to read
     *
     * @returns {string} Return the file content
     */
    readFileSync(filePath: string): string {
        return fs.readFileSync(filePath, 'utf8');
    },

    // eslint-disable-next-line valid-jsdoc
    /**
     * Method to read a file asynchronously
     * @param {string} filePath file to read
     * @param {Function} callback callback function to call when read operation finish. Use it to get the file content
     */
    readFile(filePath: string, callback: (err?: Error | any, data?: string | Buffer) => void): void {
        fs.readFile(filePath, 'utf8', callback);
    },

    /**
     * Method to read an entire directory to get the files and subfolders
     * @param {string} folderPath folder to read
     * @param {FileFilters} [filters] filters to apply
     *
     * @returns {Array<string>} Return an array with the file paths
     */
    readDirSync(folderPath: string, filters?: FileFilters): string[] {
        const folderContent = fs.readdirSync(folderPath);
        if (filters) {
            const result = [];
            for (const contentPath of folderContent) {
                const fullPath = folderPath + '/' + contentPath;
                if (filters.onlyFolders && FileChecker.isDirectory(fullPath)) {
                    result.push((filters && filters.absolutePath) ? fullPath : contentPath);
                } else if (filters.onlyFiles) {
                    if (FileChecker.isFile(fullPath)) {
                        if (filters.extensions && filters.extensions.length > 0) {
                            if (filters.extensions.includes(path.extname((filters && filters.absolutePath) ? fullPath : contentPath))) {
                                result.push((filters && filters.absolutePath) ? fullPath : contentPath);
                            }
                        } else {
                            result.push((filters && filters.absolutePath) ? fullPath : contentPath);
                        }
                    }
                } else if (filters.extensions && filters.extensions.length > 0) {
                    if (filters.extensions.includes(path.extname((filters && filters.absolutePath) ? fullPath : contentPath))) {
                        result.push((filters && filters.absolutePath) ? fullPath : contentPath);
                    }
                } else {
                    result.push((filters && filters.absolutePath) ? fullPath : contentPath);
                }
            }

            return result;
        }

        return folderContent;
    },

    /**
     * Method to read all files from a folder (including files from subfolders)
     * @param {string} folderPath folder to read
     * @param {string[]} [filters] filters to apply
     *
     * @returns {Promise<string[]>} Return a Promise with an array with all file paths
     */
    getAllFiles(folderPath: string, filters?: string[]): Promise<string[]> {
        return new Promise<string[]>(function (resolve, rejected) {
            let results: string[] = [];
            fs.readdir(folderPath, (err: any, list: string[]) => {
                if (err) {
                    rejected(err);
                    return;
                }

                let pending = list.length;
                if (!pending) {
                    resolve(results);
                }

                for (let file of list) {
                    file = path.resolve(folderPath, file);
                    fs.stat(file, async function (_err: any, stat: Stats) {
                        if (stat && stat.isDirectory()) {
                            const res = await FileReader.getAllFiles(file, filters);
                            // eslint-disable-next-line unicorn/prefer-spread
                            results = results.concat(res);
                            if (!--pending) {
                                resolve(results);
                            }
                        } else {
                            if (filters && filters.length > 0) {
                                if (filters.includes(path.extname(file))) {
                                    results.push(StrUtils.replace(file, '\\', '/'));
                                }
                            } else {
                                results.push(StrUtils.replace(file, '\\', '/'));
                            }

                            if (!--pending) {
                                resolve(results);
                            }
                        }
                    });
                }
            });
        });
    },
};

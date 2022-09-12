/* eslint-disable unicorn/filename-case */
/* eslint-disable unicorn/import-style */
/* eslint-disable unicorn/prefer-node-protocol */
import { StrUtils } from './strUtils';
import * as path from 'path';
import * as os from 'os';

/**
 * Class with Utils methods for handle paths
 */
export const PathUtils = {
    /**
     * Method to get the file name from a path
     * @param {string} filePath path to process
     * @param {string} [extension] file extension to remove
     *
     * @returns {string} Returns the file name
     */
    getBasename(filePath: string, extension?: string): string {
        return path.basename(filePath, extension);
    },

    /**
     * Method to get an absolute path from a file or folder path and replace \\ characters with /
     * @param {string} filePath path to process
     *
     * @returns {string} Returns the absolute file path
     */
    getAbsolutePath(filePath: string): string {
        return StrUtils.replace(path.resolve(filePath), '\\', '/');
    },

    /**
     * Method to get the directory name from a path
     * @param {string} filePath path to process
     *
     * @returns {string} Return the folder name
     */
    getDirname(filePath: string): string {
        return StrUtils.replace(path.dirname(filePath), '\\', '/');
    },

    /**
     * Method to remove a file extension from file path
     * @param {string} file file to process
     *
     * @returns {string} Returns the path without extension file
     */
    removeFileExtension(file: string): string {
        return file.split('.').slice(0, -1).join('.');
    },

    getFileExtension(file: string): string {
        return path.extname(file);
    },

    homeDir(): string {
        return os.homedir();
    },
};

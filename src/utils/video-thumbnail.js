'use strict';
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

/**
 * Generate a thumbnail from a video file
 * @param {string} videoPath - Path to the video file
 * @param {object} options - Options for thumbnail generation
 * @returns {Promise<string>} - Path to the generated thumbnail file
 */
const generateThumbnail = (videoPath, options = {}) => {
    return new Promise((resolve, reject) => {
        // Set default options
        const defaultOptions = {
            folder: path.dirname(videoPath),
            filename: `thumbnail-${Date.now()}.jpg`,
            timePercentage: 20, // Default to 20% into the video
            size: '300x?', // Default width of 300 pixels, auto height
            quality: 80 // JPEG quality
        };

        // Merge with user options
        const config = { ...defaultOptions, ...options };

        // Create full output path
        const outputPath = path.join(config.folder, config.filename);

        ffmpeg(videoPath)
            .on('error', (err) => {
                console.error('Failed to generate thumbnail:', err);
                reject(err);
            })
            .on('end', () => {
                resolve(outputPath);
            })
            .screenshots({
                timestamps: [`${config.timePercentage}%`],
                filename: config.filename,
                folder: config.folder,
                size: config.size
            });
    });
};

module.exports = {
    generateThumbnail
}; 
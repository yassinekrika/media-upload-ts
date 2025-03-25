# Media Upload API with Express and TypeScript

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)

A RESTful API for uploading, managing, and serving media files (images and videos) built with Express and TypeScript.

## Features

- 📁 File upload with validation (images & videos)
- 🔍 Get file metadata by ID
- 🌐 Direct file access via URL
- 🗑️ Delete files by ID
- 🔄 Automatic UUID filename generation
- 🛡️ MIME type verification
- ⚡ 100MB file size limit (configurable)

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- TypeScript 5.x

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/media-upload-api.git
cd media-upload-api

# Install dependencies
npm install

# Run th project
npm run dev

# Build the project
npm run build
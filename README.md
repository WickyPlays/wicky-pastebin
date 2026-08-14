# WickyPastebin

A modern, lightweight pastebin application template built with Bun, Hono, and Prisma. Use this to share code snippets, text, and notes with syntax highlighting and a clean interface.
This project serves as the bare minimum implementation of a real pastebin application. Shape whatever you like with this.

## Features

- **Syntax Highlighting** - Powered by highlight.js for 190+ languages
- **Multiple Database Support** - SQLite (via libsql) or PostgreSQL
- **Clean Interface** - Minimalist design with EJS templates
- **Fast Performance** - Built on Hono for optimal speed
- **Hot Reload** - Development server with hot reload
- **Rate Limiting** - Prevent abuse with rate limiting

## Installation

### Prerequisites

- [Bun](https://bun.sh/) - JavaScript runtime and package manager

### Setup

1. Clone the repository:
```sh
git clone https://github.com/WickyPlays/wicky-pastebin.git
cd wicky-pastebin
```

2. Install dependencies:
```sh
bun install
```

3. Configure your database in `prisma.config.ts` (SQLite by default)

4. Run Prisma migrations:
```sh
bunx prisma migrate dev
```

## Usage

### Development

Start the development server with hot reload:
```sh
bun run dev
```

This starts both the server and CSS watcher. Open http://localhost:3000 in your browser.

### Production

Build the CSS:
```sh
bun run build:css
```

Start the production server:
```sh
bun run dev:server
```

### Docker

Build the Docker image:
```sh
docker build -t wicky-pastebin https://github.com/WickyPlays/wicky-pastebin.git
```

Then, run the container:
```sh
docker run -p 3030:3030 wicky-pastebin
```

## How to Use

1. **Create a Paste** - Enter your code or text in the editor
2. **Select Language** - Choose the programming language for syntax highlighting
3. **Save** - Click save to generate a unique URL
4. **Share** - Share the URL with others to view your paste
5. **Settings** - Configure editor preferences via the settings dialog

## Contributing

Contributions are always welcome! Please follow these steps:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

Thank you to the following technologies for making this project possible:

- The [Bun](https://bun.sh/) team for the amazing runtime
- [Hono](https://hono.dev/) for the excellent web framework
- [Prisma](https://www.prisma.io/) for the modern ORM
- [highlight.js](https://highlightjs.org/) for syntax highlighting
- The open-source community for inspiration and tools

Special thanks to all contributors and users who help improve this project.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

# GPT GHOST

This is a Node.js project that generates two output files: a CSV file containing blog post data and a JSON file that can be uploaded to Ghost.org.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and Yarn installed on your local machine. If you don't have them installed, you can install them from:

- [Node.js](https://nodejs.org/en/download/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/)

### Installation

1. Clone the repository

```bash
git clone https://github.com/YassineRjl/gpt-ghost.git
```

2. Navigate into the project directory

```bash
cd gpt-ghost
```

3. Install the project dependencies

```bash
yarn
```

4. Create an environment file based on the example provided (.env.example)

```bash
cp .env.example .env
```

5. Open the .env file and replace the placeholder values with your actual values.

6. Start the project

```bash
yarn dev
```

## Usage

After running the project, two files will be generated in the root directory of the project:

1. `blog_posts.csv`: This file contains the blog post data in CSV format.
2. `ghost_blog_posts.json`: This file contains the blog post data in JSON format that can be uploaded to Ghost.org.

## Contributing

Please note that this project is not currently being maintained. You're welcome to fork it and make any changes you need.

## License

[MIT](https://choosealicense.com/licenses/mit/)

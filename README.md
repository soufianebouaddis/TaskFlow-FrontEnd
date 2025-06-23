# TaskFlow Frontend

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## Production Build & Docker

This project includes a production-ready multi-stage Dockerfile that:
- Builds the app with Node.js
- Serves the static files with nginx
- Uses a non-root user for security
- Does **not** include node_modules in the final image
- Handles SPA routing with a custom nginx.conf

### Build the Docker Image

```bash
docker build -t taskflow-frontend .
```

### Run the Docker Container

```bash
docker run -d -p 8080:80 --name taskflow-frontend taskflow-frontend
```

- The app will be available at [http://localhost:8080](http://localhost:8080)

### Customization
- The nginx.conf file is set up for SPA routing (all 404s go to index.html).
- You can adjust the port mapping (`-p 8080:80`) as needed.

### Stopping and Removing the Container

```bash
docker stop taskflow-frontend
docker rm taskflow-frontend
```

---

For any issues or questions, please open an issue or contact the maintainer.

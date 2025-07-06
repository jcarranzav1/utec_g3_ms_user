// esbuild.config.js
const path = require("path");
const copyStatic = require("esbuild-copy-static-files");

module.exports = (serverless) => ({
  plugins: [
    copyStatic({
      // Carpeta fuente dentro de node_modules
      src: path.resolve(
        __dirname,
        "node_modules/@fastify/swagger-ui/static"
      ),
      // Destino donde serverless-esbuild deja el build
      dest: path.resolve(
        __dirname,
        ".esbuild/.build/src/handlers/static"
      ),
      recursive: true,
    }),

    copyStatic({
      src: path.resolve(__dirname, "users.swagger.yaml"),
      dest: path.resolve(__dirname, ".esbuild/.build/src/users.swagger.yaml"),
    }),

    copyStatic({
      src: path.resolve(__dirname, "kpis.swagger.yaml"),
      dest: path.resolve(__dirname, ".esbuild/.build/src/kpis.swagger.yaml"),
    }),
  ],
});

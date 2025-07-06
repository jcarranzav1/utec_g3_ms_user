const path = require("path");
const copyStatic = require("esbuild-copy-static-files");

module.exports = (serverless) => ({
  plugins: [
    copyStatic({
      src: path.resolve(
        __dirname,
        "node_modules/@fastify/swagger-ui/static"
      ),
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

    copyStatic({
      src: path.resolve(__dirname, "orders.swagger.yaml"),
      dest: path.resolve(__dirname, ".esbuild/.build/src/orders.swagger.yaml"),
    }),
  ],
});

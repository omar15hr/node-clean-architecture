import { envs } from "./config/envs";
import { Server } from "./presentation";
import { AppRoutes } from "./presentation/routes";

(() => {
  main();
})();

async function main() {
  new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  }).start();
}
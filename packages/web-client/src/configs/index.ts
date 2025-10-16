import routes from "./routes";

interface Config {
  routes: typeof routes;
}

const config: Config = {
  routes,
};

export default config;

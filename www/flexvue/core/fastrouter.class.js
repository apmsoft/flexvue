var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    function adopt(value) {return value instanceof P ? value : new P(function (resolve) {resolve(value);});}
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {try {step(generator.next(value));} catch (e) {reject(e);}}
      function rejected(value) {try {step(generator["throw"](value));} catch (e) {reject(e);}}
      function step(result) {result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);}
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  export default class FastRouter {
    constructor(routes) {
      this.routerAddresses = {};
      this.dispatch = {};
      this.extractRoutes(routes);
    }
    extractRoutes(routes, parentRoute = '') {
      for (const route in routes) {
        if (typeof routes[route] === 'object') {
          this.routerAddresses[parentRoute + route] = {};
          this.extractRoutes(routes[route], parentRoute + route);
        } else
        {
          this.routerAddresses[parentRoute + route] = routes[route];
        }
      }
    }
    addRoute(route, method) {
      const mymodule_path = this.routerAddresses[route];
      if (mymodule_path) {
        this.dispatch[route] = method;
        // Log.d('addRoute',this.dispatch);
      }
    }
    listen(route_1) {
      return __awaiter(this, arguments, void 0, function* (route, params = {}) {
        const mymodule_path = this.routerAddresses[route];
        // Log.d('findRoute',mymodule_path);
        if (mymodule_path) {
          try {
            const module = yield import(mymodule_path);
            const activity = new module.ComponentActivity();
            const method = this.dispatch[route];
            // Log.d('findRoute', method);
            if (typeof activity[method] === 'function') {
              Log.d('findRoute', 'function ok');
              activity[method](params);
            } else
            {
              Log.e(`Method '${method}' not found in module '${mymodule_path}'`);
            }
          }
          catch (error) {
            Log.e("Error loading module:", error);
          }
        }
      });
    }
  }
import App from '../src/index';

let server;

const app = new App();
app.start();
server = app.app;

export default server;

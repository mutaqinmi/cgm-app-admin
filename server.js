import { createServer } from 'http';
import { parse } from 'url';
import next from 'next'

const port = 3000;
const app = next({
    dev: false,
})
const handle = app.getRequestHandler();

app.prepare().then(() => {
    createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(port);

    console.log(`Server is running at port ${port}`);
})

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import fallback from 'express-history-api-fallback';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';

import router from './routes';
import { connect } from './typeorm';

connect().then(() => {
    console.log('DB is connected');
},err=>{
    console.log(err);
});

const app = express();

app.disable('etag');
app.disable('x-powered-by');

app.use(helmet());

app.use(cors());

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(express.static(`${__dirname}/public`));
const root = `${__dirname}/public`;

app.use('/api', router);
app.use(fallback('index.html', { root }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;

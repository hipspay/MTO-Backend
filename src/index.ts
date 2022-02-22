import app from './app';

const PORT = process.env.PORT || 8080;

process.on('uncaughtException', async (err) => {
    process.exit(1);
});

app.listen(PORT, () => {
    console.log(`Online Node server is online.`);
    console.log(`PORT: ${PORT}`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
});

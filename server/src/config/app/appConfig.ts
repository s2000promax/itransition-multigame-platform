export default () => ({
    port: parseInt(process.env.VERCEL_PORT, 10) || 8002,
});

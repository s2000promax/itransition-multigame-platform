export default () => ({
    port: parseInt(process.env.VERCEL_PORT, 10) || 3011,
    prod_origin: process.env.VERCEL_PROD_ORIGIN,
    dev_origin: process.env.VERCEL_DEV_ORIGIN,
});

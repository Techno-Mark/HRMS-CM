/** @type {import('next').NextConfig} */
const nextConfig = {
  // output:'export',
  env: {
    app_url: process.env.app_url,
    apidev_url: process.env.apidev_url,
  },
};

export default nextConfig;

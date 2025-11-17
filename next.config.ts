/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 100],
    domains: ["myserver.com", "flagsapi.com"],
  },
};

module.exports = nextConfig;

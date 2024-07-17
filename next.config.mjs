/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https", // Uploadthing CDN
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "*githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*gstatic.com",
      },
      {
        protocol: "https",
        hostname: "*discordapp.com",
      },
    ],
  },
}

export default nextConfig

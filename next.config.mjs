/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // Uploadthing CDN
        hostname: "utfs.io",
      },
    ],
  },
}

export default nextConfig

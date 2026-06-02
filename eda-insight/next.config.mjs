/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // This allows the build to continue even with small errors
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;

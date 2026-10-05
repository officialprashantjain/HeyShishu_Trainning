/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Strict Mode to prevent double useEffect execution in development.
  // React Strict Mode mounts → unmounts → remounts every component, which causes
  // AgoraProvider to join the channel TWICE, creating duplicate participant video tiles.
  reactStrictMode: false,
  allowedDevOrigins: ["10.63.207.254", "192.168.29.54", "192.168.29.82"],
};

export default nextConfig;

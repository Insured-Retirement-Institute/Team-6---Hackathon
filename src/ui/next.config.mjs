/** @type {import('next').NextConfig} */
const nextConfig = {

  //output: "export", // uncomment for building statically
  reactCompiler: true,
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },

};

export default nextConfig;

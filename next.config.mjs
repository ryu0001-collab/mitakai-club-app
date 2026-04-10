const nextConfig = {
  async headers() {
    return [
      {
        source: '/scan',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'camera=*',
          },
        ],
      },
    ];
  },
};
export default nextConfig;

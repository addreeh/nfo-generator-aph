import type { NextConfig } from "next";

// Error: Invalid src prop (https://s4.anilist.co/file/anilistcdn/character/medium/b5-RxGEMJZLW4cy.png) on `next/image`, hostname "s4.anilist.co" is not configured under images in your `next.config.js`
// See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's4.anilist.co',
        pathname: '/file/anilistcdn/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'artworks.thetvdb.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'assets.fanart.tv',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.tvmaze.com',
        pathname: '/uploads/images/**',
      }
    ],
  },
};

export default nextConfig;

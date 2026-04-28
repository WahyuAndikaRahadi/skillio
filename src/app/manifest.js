export default function manifest() {
  return {
    name: 'Skillio',
    short_name: 'Skillio',
    description: 'Platform Belajar Berbasis AI untuk Transformasi Karier 30 Hari',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2b6ea6',
    icons: [
      {
        src: '/images/favicon.png',
        sizes: 'any',
        type: 'image/png',
      },
      {
        src: '/images/skillio-logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/images/skillio-logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}

const repo='raviatlas'
/** @type {import('next').NextConfig} */
const nextConfig={
  output:'export',
  basePath: process.env.NODE_ENV==='production' ? '/'+repo : '',
  assetPrefix: process.env.NODE_ENV==='production' ? '/'+repo+'/' : '',
  images:{unoptimized:true},
  trailingSlash:true
}
export default nextConfig
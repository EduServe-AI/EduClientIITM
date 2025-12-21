import NextTopLoader from 'nextjs-toploader'

export default function TopLoader() {
  return (
    <>
      <NextTopLoader
        color="#000000"
        initialPosition={0.08}
        crawlSpeed={200}
        height={4}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
      />
    </>
  )
}

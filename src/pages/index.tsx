import Head from 'next/head'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <Head>
        <title>Pinsta</title>
        <meta name="description" content="Pinsta Web3 Pinterest on LensProtocol" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='w-full h-screen items-center justify-center flex flex-col'>
        <Image src="/logo.png" alt="Pinsta Logo" width={400} height={400} />
      </div>
    </>
  )
}

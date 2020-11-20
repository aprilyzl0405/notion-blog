import React from 'react'
import Header from '../../components/header'
import Link from 'next/link'
import { algos, getAlgoLink } from '../../lib/algo-helpers'

const Algo = () => {
  return (
    <>
      <Header titlePre="Algorithm" />
      <div className="layout">
        <div className="algoPreview">
          {Object.keys(algos).map(slug => (
            <div className="md:flex m-2" key={slug}>
              <div className="md:flex-shrink-0">
                <img
                  className="md:h-32 rounded-lg md:w-56 object-cover"
                  src={
                    process.env.NODE_ENV === 'production'
                      ? algos[slug]['img']
                      : '/skyandroad.jpg'
                  }
                  alt={algos[slug]['alt']}
                />
              </div>
              <div className="mt-4 md:mt-0 md:ml-6">
                <Link href="/algo/[slug]" as={getAlgoLink(slug)}>
                  <div className="uppercase tracking-wide text-sm text-indigo-600 font-bold hover:underline cursor-pointer">
                    {algos[slug]['name']}
                  </div>
                </Link>
                <p className="mt-2 text-gray-600">{algos[slug]['desc']}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Algo

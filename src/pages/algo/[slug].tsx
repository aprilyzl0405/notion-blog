import React, { Component } from 'react'
import Header from '../../components/header'
import { algos, getAlgoLink } from '../../lib/algo-helpers'
import algoStyles from '../../styles/algo.module.css'
import { MineSweeper } from '../../components/algos'

export async function getStaticProps({ params: { slug }, preview }) {
  return {
    props: {
      preview: preview || false,
      slug,
    },
    revalidate: 10,
  }
}

// Return our list of blog posts to prerender
export async function getStaticPaths() {
  return {
    paths: Object.keys(algos).map(slug => getAlgoLink(slug)),
    fallback: true,
  }
}

const RenderAlgo = ({ slug, preview }) => {
  const AlgoComponent =
    algos[slug] && (algos[slug]['comp'] as React.FunctionComponent)

  return (
    <>
      <Header titlePre={slug} />
      <div className={`${algoStyles.algo} border`}>
        {AlgoComponent ? <AlgoComponent /> : <h1>Undefined Component</h1>}
      </div>
    </>
  )
}

export default RenderAlgo

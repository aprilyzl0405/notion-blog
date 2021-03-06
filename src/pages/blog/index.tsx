import Link from 'next/link'
import Header from '../../components/header'

import {
  getBlogLink,
  getDateStr,
  postIsPublished,
} from '../../lib/blog-helpers'
import { textBlock } from '../../lib/notion/renderers'
import getNotionUsers from '../../lib/notion/getNotionUsers'
import getBlogIndex from '../../lib/notion/getBlogIndex'

export async function getStaticProps({ preview }) {
  const postsTable = await getBlogIndex()

  const authorsToGet: Set<string> = new Set()
  const posts: any[] = Object.keys(postsTable)
    .map(slug => {
      const post = postsTable[slug]
      // remove draft posts in production
      if (!preview && !postIsPublished(post)) {
        return null
      }
      post.Authors = post.Authors || []
      for (const author of post.Authors) {
        authorsToGet.add(author)
      }
      return post
    })
    .filter(Boolean)

  const { users } = await getNotionUsers([...authorsToGet])

  posts.map(post => {
    post.Authors = post.Authors.map(id => users[id].full_name)
  })

  return {
    props: {
      preview: preview || false,
      posts,
    },
    revalidate: 10,
  }
}

const Blog = ({ posts = [], preview }) => {
  return (
    <>
      <Header titlePre="Blog" />
      {preview && (
        <div className="previewAlertContainer">
          <div className="previewAlert">
            <b>Note:</b>
            {` `}Viewing in preview mode{' '}
            <Link href={`/api/clear-preview`}>
              <button className="escapePreview">Exit Preview</button>
            </Link>
          </div>
        </div>
      )}
      <div className="layout blogIndex">
        {posts.length === 0 && (
          <p className="noPosts">There are no posts yet</p>
        )}
        {posts.map(post => {
          return (
            <div className="postPreview" key={post.Slug}>
              <h3 className="title">
                <Link href="/blog/[slug]" as={getBlogLink(post.Slug)}>
                  <div className="titleContainer">
                    {!post.Published && (
                      <span className="draftBadge">Draft</span>
                    )}
                    <a>{post.Page}</a>
                  </div>
                </Link>
              </h3>
              {/* {post.Authors.length > 0 && (
                <small className="authors">By: {post.Authors.join(' ')}</small>
              )} */}
              {post.Date && (
                <small className="posted">
                  Posted: {getDateStr(post.Date)}
                </small>
              )}
              <p>
                {(!post.preview || post.preview.length === 0) &&
                  'No preview available'}
                {(post.preview || []).map((block, idx) =>
                  textBlock(block, true, `${post.Slug}${idx}`)
                )}
              </p>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Blog

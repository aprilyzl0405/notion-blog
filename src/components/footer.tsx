import ExtLink from './ext-link'

const Footer = () => (
  <>
    <footer>
      {/* <span>Deploy your own!</span>
      <ExtLink href="https://vercel.com/import/git?s=https://github.com/ijjk/notion-blog/tree/master&env=NOTION_TOKEN,BLOG_INDEX_ID&envDescription=Required+env+values+for+deploying&envLink=https://github.com/ijjk/notion-blog%23getting-blog-index-and-token">
        <img
          src="https://vercel.com/button"
          height={46}
          width={132}
          alt="deploy to Vercel button"
        />
      </ExtLink>
      <span>
        or{' '}
        <ExtLink href="https://github.com/ijjk/notion-blog">
          view source
        </ExtLink>
      </span> */}
      <ExtLink href="http://beian.miit.gov.cn/">
        <span className="text-xs">粤ICP备18064138号</span>
      </ExtLink>
    </footer>
  </>
)

export default Footer

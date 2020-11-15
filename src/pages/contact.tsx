import Header from '../components/header'
import ExtLink from '../components/ext-link'

import Link from 'next/link'

import GitHub from '../components/svgs/github'
import Twitter from '../components/svgs/twitter'
import Envelope from '../components/svgs/envelope'
import Weibo from '../components/svgs/weibo'

const contacts = [
  {
    Comp: Weibo,
    alt: 'Weibo icon',
    link: 'https://weibo.com/2306221832/profile',
  },
  {
    Comp: Twitter,
    alt: 'twitter icon',
    link: 'https://twitter.com/April541976208',
  },
  {
    Comp: GitHub,
    alt: 'github icon',
    link: 'https://github.com/solirpa?tab=repositories',
  },
  {
    Comp: Envelope,
    alt: 'envelope icon',
    link: 'mailto:aprilyzl0405@gmail.com?subject=Notion Blog',
  },
]

const Contact = () => (
  <>
    <Header titlePre="Contact" />
    <div className="layout">
      <div className={`avatar cursor-pointer`}>
        <Link href="/blog/resume">
          <img src="/avatar.png" alt="avatar with letters JJ" height={60} />
        </Link>
      </div>

      <h1 style={{ marginTop: 0 }}>Contact</h1>

      <div className="name">Solirpa - Fishing Engineer</div>

      <div className="links">
        {contacts.map(({ Comp, link, alt }) => {
          return (
            <ExtLink key={link} href={link} aria-label={alt}>
              <Comp height={32} />
            </ExtLink>
          )
        })}
      </div>
    </div>
  </>
)

export default Contact

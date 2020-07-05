import Header from '../components/header'
import ExtLink from '../components/ext-link'

import sharedStyles from '../styles/shared.module.css'
import contactStyles from '../styles/contact.module.css'

import GitHub from '../components/svgs/github'
import Twitter from '../components/svgs/twitter'
import Envelope from '../components/svgs/envelope'

const contacts = [
  {
    Comp: Twitter,
    alt: 'twitter icon',
    link: 'https://twitter.com/April541976208',
  },
  {
    Comp: GitHub,
    alt: 'github icon',
    link: 'https://github.com/aprilyzl0405?tab=repositories',
  },
  {
    Comp: Envelope,
    alt: 'envelope icon',
    link: 'mailto:aprilyzl0405@gmail.com?subject=Notion Blog',
  },
]

export default () => (
  <>
    <Header titlePre="Contact" />
    <div className={sharedStyles.layout}>
      <div className={contactStyles.avatar}>
        <img src="/avatar.png" alt="avatar with letters JJ" height={60} />
      </div>

      <h1 style={{ marginTop: 0 }}>Contact</h1>

      <div className={contactStyles.name}>
        April5 - Fishing Engineer -{' '}
        <ExtLink href="https://www.notion.so/Resume-1483e5daeaad4f0999468f9aafc8f085">
          My Resume
        </ExtLink>
      </div>

      <div className={contactStyles.links}>
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

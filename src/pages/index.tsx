import Header from '../components/header'
import sharedStyles from '../styles/shared.module.css'

const Blog = () => (
  <>
    <Header titlePre="Home" />
    <div className={sharedStyles.layout}>
      <img
        src={
          process.env.NODE_ENV === 'production'
            ? 'https://static.april-zhh.cn/website/bg/skyandroad.jpg'
            : '/street.png'
        }
        height="250"
        width="700"
        alt="Home"
      />
      <h1>April5's Fairyland</h1>
      <h2>踌躇满志磨洋工, 混吃等死一条鱼</h2>
    </div>
  </>
)

export default Blog

import * as algoComponents from '../components/algos/'

export const algos = {
  MineSweeper: {
    name: '扫雷（Minesweeper）',
    desc: `一款大众类的益智小游戏，游戏目标是根据点击格子出现的数字找出所有非雷格子，同时避免踩雷，踩到一个雷即全盘皆输。
    涉及随机洗牌算法，floodfill 算法。`,
    img: 'https://static.april-zhh.cn/algo/minesweeper.jpg',
    alt: 'minesweeper',
    comp: algoComponents.MineSweeper,
  },
  Maze: {
    name: '迷宫（Maze）',
    desc: `一种充满复杂通道，很难找到从其内部到达入口或从入口到达中心的道路。涉及 dfs 和 bfs 算法。`,
    img: 'https://static.april-zhh.cn/algo/maze.png',
    alt: 'maze',
    comp: algoComponents.Maze,
  },
  Fractal: {
    name: '分形图（Fractal）',
    desc: `数学家研究分形，是力图以数学方法，模拟自然界存在的、及科学研究中出现的那些看似无规律的各种现象。`,
    img: 'https://static.april-zhh.cn/algo/fib.png',
    alt: 'fractal',
    comp: algoComponents.Fractal,
  },
}

export const getAlgoLink = (slug: string) => {
  return `/algo/${slug}`
}

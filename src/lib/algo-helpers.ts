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
    desc: `指的是充满复杂通道，很难找到从其内部到达入口或从入口到达中心的道路。`,
    img: 'https://static.april-zhh.cn/algo/maze.png',
    alt: 'maze',
    comp: algoComponents.Maze,
  },
}

export const getAlgoLink = (slug: string) => {
  return `/algo/${slug}`
}

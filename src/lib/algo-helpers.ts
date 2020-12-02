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
  BinarySearchTree: {
    name: '二叉搜索树',
    desc: `二叉搜索树是一种既有链表的快速插入与删除操作的特点，又有数组快速查找的优势的经典数据结构。`,
    img: 'https://static.april-zhh.cn/algo/binary-search-tree.png',
    alt: 'bstree',
    comp: algoComponents.BinarySearchTree,
  },
  AVLTree: {
    name: 'AVL 树',
    desc: `AVL 树中任何节点的两个子树的高度最大差别为1，所以也被称为高度平衡树。增加和删除可能需要通过一次或多次树旋转来重新平衡这个树。`,
    img: 'https://static.april-zhh.cn/algo/avl-tree.png',
    alt: 'avltree',
    comp: algoComponents.AVLTree,
  },
  RBTree: {
    name: '红黑树',
    desc: `红黑树是一种特化的AVL树（平衡二叉树），都是在进行插入和删除操作时通过特定操作保持二叉查找树的平衡，从而获得较高的查找性能。`,
    img: 'https://static.april-zhh.cn/algo/rb-tree.png',
    alt: 'rbtree',
    comp: algoComponents.RBTree,
  },
  Tree23: {
    name: '2-3树',
    desc: `2-3树是最简单的B-树（或-树）结构，其每个非叶节点都有两个或三个子女，而且所有叶都在统一层上。2-3树不是二叉树，其节点可拥有3个孩子。`,
    img: 'https://static.april-zhh.cn/algo/tree23.png',
    alt: 'tree23',
    comp: algoComponents.Tree23,
  },
  SegmentTree: {
    name: '线段树',
    desc: `线段树是一种二叉搜索树，与区间树相似，它将一个区间划分成一些单元区间，每个单元区间对应线段树中的一个叶结点。`,
    img: 'https://static.april-zhh.cn/algo/segment-tree.png',
    alt: 'segment-tree',
    comp: algoComponents.SegmentTree,
  },
  Trie: {
    name: '单词查找树（Trie）',
    desc: `Trie树，是一种树形结构，是一种哈希树的变种。优点是：利用字符串的公共前缀来减少查询时间，最大限度地减少无谓的字符串比较，查询效率比哈希树高。`,
    img: 'https://static.april-zhh.cn/algo/trie.png',
    alt: 'trie',
    comp: algoComponents.Trie,
  },
  Heap: {
    name: '二叉堆',
    desc: `二叉堆分为最大堆和最小堆。最大堆：父结点的键值总是大于或等于任何一个子节点的键值；最小堆：父结点的键值总是小于或等于任何一个子节点的键值。`,
    img: 'https://static.april-zhh.cn/algo/trie.png',
    alt: 'heap',
    comp: algoComponents.Heap,
  },
  Sort: {
    name: '排序算法',
    desc:
      '排序算法，就是使一串记录按照其中的某个或某些关键字的大小，使得记录按照要求递增或递减的排列的方法。',
    img: 'https://static.april-zhh.cn/algo/sort.png',
    alt: 'sort',
    comp: algoComponents.Sort,
  },
}

export const getAlgoLink = (slug: string) => {
  return `/algo/${slug}`
}

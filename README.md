# 表格展示

[English](./README_en_US.md)

思源笔记插件，Query View 类，仿 Remnote 的 Table View 功能，在表格中展示笔记数据。

> ❗ 表格展示不是数据库，表格所展示的数据直接来源于你的笔记，并且禁止在表格中编辑内容。

## 基本概念

- 概念
  - 一般表示一个对象，如`三国演义`
  - 展示在表格左侧第 1 列
  - 一般为列表项块、标题块
  - 概念标识（概念所在块确定方式）
    - 指定标签所在块，如含有`#书籍#`的块
    - 直接搜索选择指定块
- 属性
  - 如`作者`，`出版社`等
  - 展示在概念所在行
  - 属性名展示在表头
  - 渲染效果与笔记内一致，支持列表、超级块等容器块，但属性标识需放在首行
  - 属性标识
    - 指定标签所在块，如含有`#作者#`的块
    - 概念标签的子标签所在块，如含有`#书籍/作者#`的块
    - 含有指定分隔符号所在块，如以`作者：：`开头的块
  - ⚠️ 支持多级表头，如`概念1/属性1/子属性2`，但是并不推荐这么做，因为非叶子节点（如`概念1/属性1`）所属内容将不会在表格中渲染
  - ⚠️ 属性所在块应为`概念`所在块的后代块
  - ⚠️ 不在代码块、数学公式块等非段落块搜寻属性标识，请作为容器块的子块
  - ⚠️ 层级从上向下搜寻，每个单元格仅显示第一个找到的块


- 附加条件
  - 仅在单元格中显示带有某标签的块(v0.2.3)
    - 有些时候，属性内容太长，可以通过此标签进行筛选，如`概要`
    - ⚠️仅显示第一个找到的块
    - ⚠️仅在子块中搜索，不在后代块中搜索

## 使用方法

1. 选择查找`概念`所在块的方式
2. `下一步`，选择查找`属性`所在块的方式
   ⚠️ 属性所在块只在`概念`所在块的后代块中查找
3. `下一步`，设置附加条件
4. `生成`，稍后将在下方展示查询结果

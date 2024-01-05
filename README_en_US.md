# Table View

[中文版](./README.md)

Siyuan Note Plug-in, similar to Remnote's Table View , uses tags to display note data in a table

- Each row represents all the 'attributes' of a 'concept'
- Support notes organized in the form of titles, lists, superblocks, etc

> ❗Table View is not a database, the data displayed in the table comes directly from your notes, and it is forbidden to edit the content in the table

## How to use

1. Tag blocks with labels:
   - Use the 'Category' tag on the 'Concept' block, e.g. the 'Book' tag on the title of 'Romance of the Three Kingdoms'
   - In the 'Descendant Block' of 'Concept', use subtags to mark the 'Attributes' block, e.g. use the 'Book/Author' tag in the 'Luo Guanzhong' block, and the 'Luo Guanzhong' block should be in the 'Romance of the Three Kingdoms' sub-block (no hierarchy)
2. Click 'Table Display' in the top bar to open a new tab
3. Enter the label you just marked in the input box, such as 'Books', note that direct input will not trigger any action, you need to click the 'Books' tab in the pop-up autocomplete list
4. Wait for a while, and you will find the following table with the following content:
   |name|author|
   |---|---|
   |Romance of the Three Kingdoms|Luo Guanzhong|

## Workflow

Understanding the workflow of the plugin may help to achieve the desired results

1. The plugin will pull all the tags during initialization, and then they will be reused as long as the window is not closed
2. After selecting a tag (Tag 1), the plugin does the following:
   1. Find all the sub-tags, i.e. the tags that start with 'Tag 1', and use them as headers
   2. Find all the blocks that contain 'Label 1' and fill in their 'content' in the 'Name' column
   3. Find all the descendant blocks of the block found in the previous step
      - In the case of a paragraph block, all descendant blocks of its parent block will be found, which means that if the paragraph block is in a superblock, list item block, quote block, all descendant blocks of the superblock, list item block, quote block will be found
   4. Look for subtags in the content of the descendant block
      - Use the block closest to the block level with 'Tag 1' (meaning that superblocks, list item blocks, quote blocks are preferred over their subparagraph blocks)
   5. Put the block found in the previous step into the corresponding cell
3. All cells are rendered using the CiSource Editor except for the 'Name' column cell, which means that all its sub-blocks will be rendered

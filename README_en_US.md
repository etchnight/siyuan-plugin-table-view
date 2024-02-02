# Table View

[中文版](./README.md)

Siyuan Note Plugin, Query View like Plugin, imitates the Table View function of Remnote, and displays note data in a table.

> ❗ Table View is not a database, the data displayed in the table comes directly from your notes, and it is forbidden to edit the content in the table.

## Basic Concepts

- conception
  - Generally denotes an object, e.g. `Romance of the Three Kingdoms`
  - Appears in column 1 on the left side of the table
  - Generally, it is a list item block or a title block
  - Concept identity (how the block in which the concept is located)
    - Specify the block where the tag is located, such as a block containing `#Book#`
    - Directly search and selected block
- attribute

  - e.g. `Author`, `Publisher`, etc
  - Display in the row of the concept
  - ⚠️ The block in which the attribute is located should be the descendant block of the block in which the `concept` is located
  - Attribute names are displayed in the header of the table, which supports multi-level headers, such as `Concept 1/Attribute 1/Sub Attribute 2`, ⚠️ but this is not recommended because the content belonging to non-leaf nodes (e.g. `Concept 1/Attribute 1`) will not be rendered in the table
  - The rendering effect is the same as in the note, and container blocks such as lists and superblocks are supported, but the attribute identifier needs to be placed in the first line
  - Do not search for attribute identifiers in non-paragraph ❗ blocks such as code blocks and math formula blocks, and use them as subblocks of container blocks
  - Attribute identification
    - Specify the block where the tag is located, e.g. the block containing `#Author#`
    - The block where the subtag of the concept tag is located, e.g. the block containing `#Book/Author#`
    - Blocks containing the specified delimiter, such as those that start with `Author::`

- Additional conditions
  - only show blocks with a certain label in a cell (v0.2.3)
    - Sometimes, the property content is too long and can be filtered by this tag, such as 'Summary'
    - ⚠️ Only the first found block is displayed
    - ⚠️ Search only in sub-blocks, not in descendant blocks

## How to use

1. Choose how you want to find the block where the `concept` is located
2. `Next`, choose how you want to find the block where `Properties` is located
   ⚠️ The block in which the attribute is located is only found in the descendant block of the block where the `concept` is located
3. 'Next' and set the additional conditions
4. `Generate`, the results of the query will be displayed below

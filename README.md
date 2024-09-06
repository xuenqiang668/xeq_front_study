# xeq_front_study

xeq_front_study

1. 使用 Git 子模块
如果您想在当前仓库中引用另一个仓库，可以使用 Git 子模块：

```sh
git submodule add <repository-url> <path-to-submodule>
```

2. 初始化和更新子模块
添加子模块后，您可以使用以下命令初始化和更新子模块：
```sh
git submodule init
git submodule update
```

3. 同步子模块配置： 如果您已更改 .gitmodules 文件，您需要运行以下命令来同步配置：

```sh
git submodule sync
```

4. 初始化和更新子模块： 之后，您可以再次运行 git submodule init，然后使用以下命令更新子模块：
```sh
git submodule update --recursive
```

添加子模块

# Parent Repository

这是一个主仓库，包含了一个子模块。

## 如何克隆包含子模块的项目

克隆项目时，请使用以下命令：

```sh
git clone --recurse-submodules https://github.com/xuenqiang668/xeq_front_study.git
```

## 或者，如果你已经克隆了仓库，但没有包含子模块，可以使用以下命令：

```sh
cd parent-repo
git submodule update --init --recursive
```



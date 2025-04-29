# CIA 终端模拟器项目文档

## 项目概述

CIA 终端模拟器是一款基于网页的文字冒险游戏，玩家扮演一名 CIA 特工，通过使用复古的计算机终端界面获取信息、解读文件和完成任务。游戏采用经典的 80 年代 CRT 显示器界面风格，充满复古氛围和冷战时期的特工元素。

游戏使用纯 HTML、CSS 和 JavaScript 构建，按照 MVC 架构设计，方便维护和扩展。所有游戏内容将被打包在单一 HTML 文件中，JavaScript 代码则托管在云端。

## 项目结构

```
/cia-terminal
├── index.html  # 主页面（包含所有HTML和CSS）
│
└── js/  # JavaScript代码目录
    ├── core/  # 核心功能模块
    │   ├── EventBus.js        # 事件发布/订阅系统
    │   ├── StorageManager.js  # 本地存储管理
    │   ├── Constants.js       # 应用常量
    │   └── Config.js          # 应用配置
    │
    ├── models/  # 数据模型
    │   ├── UserModel.js       # 用户数据和认证
    │   ├── SystemModel.js     # 系统状态
    │   ├── MissionModel.js    # 任务和游戏进度
    │   └── TerminalModel.js   # 终端状态和命令
    │
    ├── views/  # 视图层
    │   ├── TerminalView.js    # 终端显示
    │   ├── ApplicationView.js # 应用窗口显示
    │   ├── UserInterfaceView.js # UI通用元素
    │   ├── MailView.js        # 邮件界面
    │   └── FileView.js        # 文件浏览器
    │
    ├── controllers/  # 控制器
    │   ├── NavigationController.js # 焦点和导航
    │   ├── TerminalController.js   # 终端输入和命令
    │   ├── ApplicationController.js # 应用程序控制
    │   ├── MailController.js       # 邮件程序
    │   └── FileController.js       # 文件程序
    │
    ├── managers/  # 管理器
    │   ├── SaveManager.js     # 游戏存档管理
    │   └── EffectsManager.js  # 视觉和音效
    │
    └── app.js                 # 主应用入口
```

## 功能说明

1. 核心层（core/）
   - EventBus.js: 处理游戏内所有模块间的事件通信
   - StorageManager.js: 管理本地存储，保存游戏进度和用户配置
   - Constants.js: 定义游戏中使用的常量，如应用ID、命令等
   - Config.js: 存储应用配置，如调试模式、默认值等
2. 数据层（models/）
   - UserModel.js: 管理用户数据、认证和权限
   - SystemModel.js: 管理系统状态、当前屏幕和日期时间
   - MissionModel.js: 处理任务数据和游戏进度
   - TerminalModel.js: 管理终端状态和命令处理
3. 视图层（views/）
   - TerminalView.js: 处理终端界面的显示和交互
   - ApplicationView.js: 管理应用程序窗口的显示
   - UserInterfaceView.js: 处理通用UI元素，如时钟、状态栏
   - MailView.js: 处理邮件系统界面
   - FileView.js: 处理文件浏览器界面
4. 控制层（controllers/）
   - NavigationController.js: 管理焦点和键盘导航
   - TerminalController.js: 处理终端命令输入和执行
   - ApplicationController.js: 协调应用程序启动和关闭
   - MailController.js: 管理邮件应用程序逻辑
   - FileController.js: 管理文件浏览器逻辑
5. 管理器（managers/）
   - SaveManager.js: 统一管理游戏存档数据
     - EmailDataModule: 处理邮件数据
     - FileDataModule: 处理文件系统数据
   - EffectsManager.js: 管理视觉和音效
6. 应用入口（app.js）
   - 初始化游戏系统
   - 订阅核心事件
   - 协调各模块启动

## 已实现功能详情

### 1. 基础系统

```
终端命令系统 [已完成]
- 支持关键命令：help, status, clear, exit, login, logout, list, run
- 命令历史记录和上下键导航
- 智能的命令解析和错误处理
- 命令执行权限验证
- 详细的命令帮助信息
导航系统 [已完成]
- 菜单和终端间的焦点切换
- 键盘导航（箭头键、Tab键、Enter键）
- 不同应用程序间的导航
- 系统和应用焦点模式切换
- 用户友好的状态提示
用户认证系统 [已完成]
- 用户登录和注销功能
- 用户配置文件保存
- 头像上传和管理
- 权限控制和访问验证
```

### 2. 应用程序模块

```
文件浏览器 [已完成]
- 目录和文件层次结构
- 文件内容查看
- 支持多种文件类型（TXT、DIR等）
- 键盘导航（上下箭头、Enter键、Backspace键）
- 文件详情显示
邮件系统 [已完成]
- 邮件列表和详情视图
- 未读/已读状态管理
- 邮件导航（上下箭头、左右箭头）
- 新邮件通知和未读计数
- 发件人、日期和主题显示
档案查询系统 [预留框架]
- 基础界面设计
- 搜索功能占位
解密工具 [预留框架]
- 基础界面设计
- 解密功能占位
```

### 3. 数据管理

```
存档系统 [已完成]
- 完整的游戏数据管理
- 邮件数据模块
- 文件系统数据模块
- 自动加载和保存
- 默认数据初始化
状态管理系统 [已完成]
- 系统状态更新和通知
- 应用程序状态管理
- 事件驱动的状态更新
```

## 开发进度

| 模块         | 完成度 | 说明                               |
| ------------ | ------ | ---------------------------------- |
| 核心系统     | 100%   | 事件总线、存储管理、常量系统已完成 |
| 用户认证     | 100%   | 登录、注销、用户配置已完成         |
| 终端命令     | 100%   | 所有基础命令已实现                 |
| 导航系统     | 100%   | 菜单和应用程序导航已完成           |
| 文件浏览器   | 100%   | 文件系统、目录导航、文件查看已完成 |
| 邮件系统     | 100%   | 邮件列表、详情、状态管理已完成     |
| 档案查询系统 | 20%    | 基础框架已建立，功能未实现         |
| 解密工具     | 20%    | 基础框架已建立，功能未实现         |
| 视觉效果     | 90%    | CRT效果、启动动画已完成            |
| 存档系统     | 100%   | 完整的数据保存和加载系统已实现     |

## 技术细节

### 事件机制

系统采用发布/订阅模式进行模块间通信，主要事件包括：

1. 用户相关事件：'user:login', 'user:logout', 'user:avatarChanged'
2. 系统事件：'system:screenChanged', 'system:timeUpdated', 'system:reboot'
3. 应用程序事件：'app:launch', 'app:close', 'app:activated'
4. 终端事件：'terminal:commandEntered'
5. 导航事件：'navigation:focusChanged', 'navigation:modeChanged'
6. 邮件事件：'mail:unreadChanged'
7. 数据事件：'saveData:loaded', 'saveData:changed'

### 模块耦合

- 所有模块间通过EventBus进行通信，降低直接依赖
- 视图层不直接操作数据，而是通过事件通知控制器
- 控制器负责协调模型和视图
- 模型层相对独立，专注于数据处理

### 依赖关系

- EventBus为核心依赖，几乎所有模块都依赖它进行通信
- SaveManager为数据层核心，管理所有游戏数据
- 应用模块（如MailView、FileView）依赖各自的控制器
- 所有视图模块依赖DOM元素

## 开发注意事项

1. 所有JavaScript模块通过HTML按特定顺序引入，确保依赖关系正确
2. 新功能开发应遵循事件驱动模式，通过EventBus进行通信
3. 视图更新应响应模型变化，而非直接操作数据
4. 新增应用程序需要在Constants.APPS中注册
5. 确保存档系统能正确处理新增数据结构

## 未来扩展

1. 通讯系统模块完善
2. 世界地图功能实现
3. 音乐播放器功能实现
4. 完整任务系统
5. 档案查询和解密工具功能实现
6. 多语言支持

## 兼容性要求

- 现代浏览器（Chrome、Firefox、Edge等）
- 支持localStorage API
- 支持现代JavaScript特性（ES6+）
- 建议使用1024x768或更高分辨率

## 安装和运行

由于游戏设计为单一HTML文件，只需在浏览器中打开index.html即可运行。JavaScript文件将从云端加载。

本地开发时，需要确保所有JavaScript文件按照index.html中定义的顺序引入。



## 文件的编写进度：

#### 入口文件

```
js/App.js
已完成功能：
- 应用初始化系统
- 事件订阅和处理机制
- 应用启动流程
- 用户登录状态管理
- 系统启动动画和效果

运行依赖：
1. 模型依赖：
   - UserModel.js
   - SystemModel.js
   - MissionModel.js
   - TerminalModel.js
2. 视图依赖：
   - TerminalView.js
   - ApplicationView.js
   - UserInterfaceView.js
3. 控制器依赖：
   - NavigationController.js
   - TerminalController.js
   - ApplicationController.js
   - MailController.js
   - FileController.js
4. 工具类依赖：
   - SaveManager.js
   - EffectsManager.js
   - EventBus.js

事件机制：
1. 订阅事件：
   - 'system:timeUpdated': 系统时间更新
   - 'user:login': 用户登录
   - 'user:logout': 用户登出
   - 'user:avatarChanged': 用户头像更改
   - 'system:reboot': 系统重启
   - 'system:bootComplete': 系统启动完成

技术细节：
- 模块化设计架构，严格的初始化顺序
- 基于事件驱动的模块间通信
- 应用启动序列包含视觉效果和动画
- 延时处理确保DOM和其他组件完全加载
- 启动时自动检查新邮件功能
- 错误捕获和日志记录机制
- 文件系统强制初始化保障
```

### 核心模块

```
js/core/EventBus.js
已完成功能：
- 事件订阅系统 (subscribe)
- 事件发布机制 (publish)
- 取消订阅功能 (unsubscribe)
- 模块间通信支持

运行依赖：
1. 核心依赖：
   - 无外部依赖

事件机制：
1. 工具特性：
   - 作为事件系统基础设施，不直接发布特定事件
   - 为其他模块提供事件发布/订阅功能

技术细节：
- 基于发布/订阅(Pub/Sub)设计模式
- 支持多个订阅者监听同一事件
- 事件数据传递机制
- 按需取消特定事件的订阅
- 事件回调函数隔离，确保模块间松耦合
```

```
js/core/StorageManager.js
已完成功能：
- 本地数据保存功能
- 本地数据读取功能
- 本地数据删除功能

运行依赖：
1. 核心依赖：
   - 浏览器localStorage API

事件机制：
无明确事件发布或订阅

技术细节：
- 使用浏览器localStorage API实现持久化存储
- 自动JSON序列化和反序列化
- 简洁的API设计，易于集成
- 错误处理与空值检查
```

```
js/core/Constants.js
已完成功能：
- 应用常量定义系统
- 存储键值常量（用户配置、游戏进度等）
- 应用类型常量（终端、文件浏览器、解密工具等）
- 命令常量（help、status、clear等）
- 终端头部信息生成功能
运行依赖：
1. 核心依赖：
   - SaveManager.js
   - EmailDataModule
技术细节：
- 集中式常量管理
- 动态终端头部信息生成
- 对系统关键值的规范化定义
```

```
js/core/Config.js
已完成功能：
- 应用全局配置系统
- 调试模式开关
- 默认日期设置（1982年系统时间）
- 时钟更新间隔设置
- 默认用户信息配置
技术细节：
- 全局配置集中管理
- 系统默认值设定
- 模拟时间系统配置
```

### 模型层

```
js/models/MissionModel.js
已完成功能：
- 任务初始化系统
- 任务加载功能
- 任务进度更新系统
  - 支持百分比计算
  - 防止进度超过100%
- 任务状态获取功能
运行依赖：
1. 核心依赖：
   - EventBus.js
   - UserModel.js（用户配置信息）
事件机制：
1. 发布事件：
   - 'mission:progressUpdated': 任务进度更新
技术细节：
- 任务状态和进度跟踪
- 任务进度百分比计算
- 用户信息集成显示
- 事件驱动的进度更新机制
```

```
js/models/SystemModel.js
已完成功能：
- 系统状态管理
- 屏幕切换功能
- 时钟/时间模拟系统
- 系统信息获取
- 系统重启功能

运行依赖：
1. 核心依赖：
   - EventBus.js
   - Constants.js
   - Config.js

事件机制：
1. 发布事件：
   - 'system:screenChanged': 屏幕切换
   - 'system:timeUpdated': 时间更新
   - 'system:reboot': 系统重启
   - 'system:bootComplete': 启动完成

技术细节：
- 可配置更新间隔的时间模拟
- 屏幕状态管理
- 事件驱动的系统更新架构
- 可配置的重启流程
```

```
js/models/TerminalModel.js
已完成功能：
- 命令历史记录系统
- 命令历史导航功能（上下浏览历史命令）
- 命令处理系统
  - 身份验证和访问控制
  - 基础命令集（help, status, clear, exit等）
  - 应用程序启动功能

运行依赖：
1. 核心依赖：
   - UserModel.js（身份验证功能）
   - Constants.js（命令常量定义）
   - Config.js（系统配置）
   - MissionModel.js（任务状态信息）

事件机制：
1. 返回特殊指令：
   - 'CLEAR_SCREEN': 清除终端显示
   - 'LAUNCH_APP:xxx': 启动特定应用程序

技术细节：
- 完整的命令历史管理和导航
- 基于登录状态的命令权限控制
- 灵活的命令解析和响应系统
- 模块化的应用程序启动机制
- 用户友好的错误处理和提示
```

```
js/models/UserModel.js
已完成功能：
- 用户认证系统（登录/登出）
- 用户档案管理
  - 用户名称存储和更新
  - 权限等级管理
  - 头像数据管理
- 用户数据持久化功能
- 认证状态检查

运行依赖：
1. 核心依赖：
   - Config.js（默认用户配置）
   - EventBus.js（事件发布）
   - StorageManager.js（数据存储）
   - Constants.js（存储键名常量）

事件机制：
1. 发布事件：
   - 'user:login': 用户登录时触发
   - 'user:logout': 用户登出时触发
   - 'user:avatarChanged': 用户头像更新时触发

技术细节：
- 基于事件驱动的用户状态更新
- 本地存储的用户数据持久化
- 安全的身份验证机制
- 用户头像数据处理与保存
```

### 视图层

```
js/views/ApplicationView.js
已完成功能：
- 应用程序窗口初始化系统
- 应用程序显示和隐藏功能
  - 支持终端特殊处理
  - 窗口切换管理
- 应用内容渲染系统
运行依赖：
1. 核心依赖：
   - EventBus.js
   - Constants.js
   - DOM元素:
     - 带有'close-btn'类的按钮
     - 带有'app-window'类的元素
     - id为'terminal'的元素
     - id为'user-input'的元素
事件机制：
1. 发布事件：
   - 'app:close': 关闭应用程序
技术细节：
- 基于事件驱动的窗口管理
- 动态内容渲染
- 应用程序显示状态管理
- 终端特殊处理逻辑
```

```
js/views/FileView.js
已完成功能：
- 文件浏览器视图管理系统
  - 列表视图和详情视图切换
  - 路径导航和显示
- 文件和目录导航功能
  - 目录浏览与层级切换
  - 父目录返回功能
  - 文件内容查看
- 完整的键盘导航支持
  - 箭头键选择文件
  - Enter打开文件/目录
  - Backspace/ESC返回上级目录
- 文件排序与分类系统
  - 目录优先排序
  - 按名称字母排序
  - 父目录特殊处理

运行依赖：
1. 核心依赖：
   - EventBus.js
   - SaveManager.FileDataModule
   - SystemModel
   - NavigationController
   - UserInterfaceView

2. DOM依赖：
   - #fileExplorer元素
   - #file-list-view和#file-detail-view容器
   - #file-list-container文件列表容器
   - #current-path路径显示元素
   - .file-back-btn返回按钮

事件机制：
1. 订阅事件：
   - 'app:launch': 应用启动
   - 'app:requestExit': 退出请求处理
   - 'navigation:modeChanged': 导航模式变化
   - 'app:activated': 应用激活

2. 发布事件：
   - 'app:close': 关闭应用

技术细节：
- 双视图模式（列表/详情）的状态管理
- 完整的文件层级导航系统
- 键盘事件处理与焦点管理
- 文件条目智能排序（目录优先）
- 空目录特殊处理机制
- 信息栏上下文提示更新
- 事件驱动的UI状态管理
```

```
js/views/MailView.js
已完成功能：
- 邮件列表与详情视图切换系统
- 邮件选择与导航功能
  - 支持键盘箭头键导航
  - 支持上一封/下一封邮件导航
  - 邮件项目高亮与滚动位置自动调整
- 邮件渲染与状态管理
  - 邮件列表按日期降序排序
  - 已读/未读状态管理与显示
  - 日期格式化处理
- 视图状态保持与管理机制

运行依赖：
1. 核心依赖：
   - EventBus.js
   - SaveManager.EmailDataModule
   - SystemModel
   - NavigationController
   - UserInterfaceView

事件机制：
1. 订阅事件：
   - 'app:launch': 应用启动
   - 'app:requestExit': 请求退出应用
   - 'navigation:modeChanged': 导航模式变化
   - 'app:activated': 应用被激活
2. 发布事件：
   - 'app:close': 关闭应用

技术细节：
- 双视图状态管理（列表/详情）
- 事件驱动的界面更新机制
- 完整的键盘导航与交互系统
- 自适应的列表选择与滚动管理
- 智能的返回和导航逻辑（详情视图返回列表，列表退出应用）
- 日期格式化处理（列表简略格式与详情完整格式）
```

```
js/views/TerminalView.js
已完成功能：
- 终端显示管理系统
- 命令输入与处理功能
  - 支持文本输入与实时显示
  - 自定义光标显示与定位
  - 命令历史记录
- 终端清屏功能
- 特殊命令处理
  - CLEAR_SCREEN 清屏指令
  - LAUNCH_APP 应用启动指令
- 终端焦点状态管理

运行依赖：
1. 核心依赖：
   - Constants.js（终端头部内容）
   - EventBus.js（事件通信）
2. DOM元素依赖：
   - #terminal 元素
   - #output 元素  
   - #user-input 元素
   - #command-text 元素
   - .cursor 元素
   - .prompt 元素

事件机制：
1. 发布事件：
   - 'app:launch': 启动应用程序
2. 监听事件：
   - input事件：用户输入更新
   - keydown事件：键盘按键处理
   - focus/blur事件：终端焦点状态管理
   - click事件：终端点击处理

技术细节：
- 基于DOM的终端视图管理
- 精确的光标位置计算与更新
- 动态文本测量实现精准光标定位
- 焦点状态CSS样式切换
- 命令解析与特殊指令处理
- 自适应窗口大小变化
```

```
js/views/UserInterfaceView.js
已完成功能：
- 用户界面初始化系统
- 时钟更新功能
  - 日期格式化
  - 时间格式化
- 用户档案更新系统
  - 头像切换功能
  - 用户名显示控制
  - 认证状态响应机制
- 信息栏更新功能
- 启动序列动画效果
- 头像上传交互

运行依赖：
1. DOM元素依赖：
   - 'clock' ID元素
   - 'user-avatar' 和 'user-name' ID元素
   - 'info-text' ID元素
   - 'terminal' ID元素
   - '.avatar-container' 类元素
   - 'avatar-upload' ID元素
2. 外部模块依赖：
   - UserModel模块

事件机制：
1. 监听事件：
   - 'click': 头像容器点击
   - 'change': 头像上传文件选择
2. DOM操作：
   - 添加/移除CSS类
   - 更新元素内容
   - 触发文件选择

技术细节：
- 完整的日期时间格式化机制
- FileReader API 实现头像预览
- 基于认证状态的条件式UI更新
- CSS类操作实现视觉效果
- 定时器控制的动画效果
- 异常捕获与错误处理
```

### 控制层

```
js/controllers/ApplicationController.js
已完成功能：
- 应用程序初始化系统
- 菜单交互管理
- 应用程序启动管理
  - 支持多种应用(终端、文件浏览器、邮件、音乐播放器等)
  - 包含权限验证机制
- 应用程序关闭控制
- 用户登录/登出处理
- 终端显示控制

运行依赖：
1. 核心依赖：
   - EventBus.js
   - UserModel.js
   - Constants.js
   - SystemModel.js
2. 视图依赖：
   - ApplicationView.js
   - TerminalView.js
   - MailView.js
3. 控制器依赖：
   - NavigationController.js
   - FileController.js
   - MailController.js

事件机制：
1. 订阅事件：
   - 'app:launch': 应用启动事件
   - 'app:close': 应用关闭事件
2. DOM事件：
   - 菜单项点击事件
   - 登出按钮点击事件

技术细节：
- 事件驱动的应用程序架构
- 完整的权限验证机制
- 特殊应用处理逻辑(终端、邮件、文件浏览器等)
- 焦点管理系统
- 应用状态管理
- 终端集成与输出控制
```

```
js/controllers/FileController.js
已完成功能：
- 文件浏览器初始化系统
- 文件视图管理功能
- 文件浏览器启动逻辑
  - 用户身份验证检查
  - 文件系统数据验证
  - 自动初始化默认文件
- 文件目录导航功能

运行依赖：
1. 核心依赖：
   - EventBus.js
   - FileView.js
   - SaveManager.js
   - UserModel.js
2. 界面依赖：
   - ApplicationView.js
   - TerminalView.js
   - ApplicationController.js
3. 系统依赖：
   - SystemModel.js
   - NavigationController.js

事件机制：
1. 订阅事件：
   - 'app:launch': 监听应用启动，处理文件浏览器程序启动

技术细节：
- 完整的文件浏览器启动流程
- 用户认证安全检查
- 文件系统数据自动检查与初始化
- 视图状态管理与重置
- 应用程序焦点与导航模式管理
- 目录加载与浏览功能
```

```
js/controllers/MailController.js
已完成功能：
- 邮件系统初始化
- 事件监听和订阅机制
- 邮件应用程序启动功能
  - 用户身份验证检查
  - 视图状态重置
  - 邮件列表渲染
- 未读邮件徽章更新系统
- 新邮件检查功能

运行依赖：
1. 核心依赖：
   - EventBus.js
   - MailView.js
   - UserModel.js
   - SaveManager.EmailDataModule
2. 界面依赖：
   - TerminalView.js
   - ApplicationController.js
   - ApplicationView.js
   - SystemModel.js
   - NavigationController.js
   - UserInterfaceView.js
   - Constants.js

事件机制：
1. 订阅事件：
   - 'app:launch': 监听应用启动事件
   - 'mail:unreadChanged': 监听未读邮件数量变化事件

技术细节：
- 基于事件驱动的邮件系统架构
- 完整的用户身份验证检查机制
- 视图状态管理和切换系统
- 未读邮件计数和徽章动态更新
- 应用导航和焦点控制整合
```

```
js/controllers/NavigationController.js
已完成功能：
- 焦点管理系统
  - 终端与菜单面板的焦点切换
  - 视觉反馈和光标显示控制
- 菜单导航系统
  - 上下箭头键导航
  - 菜单项高亮显示
  - 点击和键盘激活菜单选项
- 系统与应用模式切换
  - 'system'模式（终端/系统菜单）
  - 'app'模式（应用内部操作）
- 键盘快捷键支持
  - Tab键切换焦点区域
  - ESC键返回上一级
  - 方向键导航菜单
  - Enter键激活选择
运行依赖：
1. 核心依赖：
   - EventBus.js
   - UserInterfaceView.js
   - SystemModel.js
2. 可选依赖：
   - FileView（用于文件浏览器功能）
事件机制：
1. 发布事件：
   - 'navigation:modeChanged': 焦点模式改变(system/app)
   - 'navigation:focusChanged': 焦点区域改变(terminal/menu)
   - 'app:activated': 应用程序激活
   - 'app:requestExit': 请求退出应用
   - 'terminal:commandEntered': 终端命令输入
2. 监听事件：
   - DOM keydown: 键盘导航处理
   - 各元素的click事件: 鼠标导航处理
技术细节：
- 双模式焦点管理（系统/应用）
- 菜单选择状态的可视化反馈
- 智能焦点切换（基于用户交互）
- 状态栏信息动态更新
- 防止重复事件触发的保护机制
```

```
js/controllers/TerminalController.js
已完成功能：
- 终端输入控制系统
- 命令处理机制
- 命令历史导航功能
  - 支持上下箭头浏览历史命令
  - 自动填充历史命令
- 命令输出展示系统

运行依赖：
1. 核心依赖：
   - EventBus.js
   - TerminalModel.js
   - TerminalView.js
   - DOM元素: 'user-input'

事件机制：
1. 订阅事件：
   - 'terminal:commandEntered': 处理用户输入的命令
2. 可能触发事件：
   - 由TerminalModel或TerminalView在命令处理过程中触发的相关事件

技术细节：
- 事件驱动的命令处理架构
- 完整的命令历史导航功能
- 输入与输出的分离处理
- 自动滚动确保最新输出可见
```

### 管理器与工具

```
// js/utils/EffectsManager - 管理视觉和音效
只写了框架
```

```
js/utils/SaveManager.js
已完成功能：
- 高级游戏存档管理系统
- 模块化数据处理架构
  - 支持邮件系统管理
  - 支持文件系统管理
- 完整的数据生命周期控制
  - 初始化数据
  - 保存数据
  - 加载数据
  - 重置数据
- 邮件系统功能
  - 邮件创建、读取、标记已读和删除
  - 未读邮件统计和过滤
- 文件系统功能
  - 文件和目录的CRUD操作
  - 目录结构自动生成
  - 多级路径支持和管理
  - 按ID、类型和路径检索文件
运行依赖：
1. 核心依赖：
   - StorageManager.js
   - EventBus.js
事件机制：
1. 发布事件：
   - 'mail:unreadChanged': 未读邮件数量变化
技术细节：
- 使用本地存储实现持久化数据管理
- 模块化设计，数据类型隔离
- 前缀命名（'cia_save_'）确保存储空间隔离
- 自动目录路径生成机制
- 完整的文件系统层次结构支持
- 安全的数据初始化和默认值处理
```


































































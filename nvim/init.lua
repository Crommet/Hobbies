-- ==========================================================================
-- 1. ENABLE BYTE-COMPILATION (MAXIMUM STARTUP SPEED)
-- ==========================================================================
-- Neovim 0.9+ includes a built-in Lua loader. When enabled, it compiles your
-- Lua scripts into byte-code and caches them. Subsequent startups will read
-- the byte-code instead of parsing text, shaving off crucial milliseconds.
-- THIS MUST BE THE VERY FIRST THING IN YOUR CONFIG.
if vim.loader then vim.loader.enable() end


-- ==========================================================================
-- 2. CORE OPTIONS & PREFERENCES
-- ==========================================================================
-- We set the leader key first. If plugins load before this is set, their
-- keybindings might default to the wrong key (usually backslash).
vim.g.mapleader = " "
vim.g.maplocalleader = " "

-- Line Numbers
vim.opt.number = true             -- Show the absolute line number of the current line
vim.opt.relativenumber = true     -- Show relative numbers (makes jumping up/down much easier)

-- Tabs & Indentation
vim.opt.tabstop = 4               -- Number of spaces a <Tab> counts for
vim.opt.shiftwidth = 4            -- Number of spaces to use for each step of (auto)indent
vim.opt.expandtab = true          -- Convert tabs to spaces (highly recommended for most coding)

-- Search Settings
vim.opt.incsearch = true          -- Show search matches dynamically as you type
vim.opt.ignorecase = true         -- Ignore case when searching
vim.opt.smartcase = true          -- Automatically switch to case-sensitive if you type a capital letter

-- Quality of Life & UI
vim.opt.clipboard = "unnamedplus" -- Sync Neovim with your system clipboard (allows copy/pasting to other apps)
vim.opt.mouse = "a"               -- Enable mouse support (handy for scrolling and resizing splits)
vim.opt.cursorline = true         -- Highlight the line your cursor is currently on
vim.opt.termguicolors = true      -- Required for modern themes (like yours) to render hex colors correctly

-- ==========================================================================
-- SHIFT + ARROW KEYS (Modern Text Selection)
-- ==========================================================================
-- Normal mode: starts visual selection and moves
vim.keymap.set("n", "<S-Up>", "v<Up>", { desc = "Select up" })
vim.keymap.set("n", "<S-Down>", "v<Down>", { desc = "Select down" })
vim.keymap.set("n", "<S-Left>", "v<Left>", { desc = "Select left" })
vim.keymap.set("n", "<S-Right>", "v<Right>", { desc = "Select right" })

-- Visual mode: continues expanding the selection
vim.keymap.set("v", "<S-Up>", "<Up>", { desc = "Select up" })
vim.keymap.set("v", "<S-Down>", "<Down>", { desc = "Select down" })
vim.keymap.set("v", "<S-Left>", "<Left>", { desc = "Select left" })
vim.keymap.set("v", "<S-Right>", "<Right>", { desc = "Select right" })

-- Insert mode: exits insert mode, starts visual selection, and moves
vim.keymap.set("i", "<S-Up>", "<Esc>v<Up>", { desc = "Select up" })
vim.keymap.set("i", "<S-Down>", "<Esc>v<Down>", { desc = "Select down" })
vim.keymap.set("i", "<S-Left>", "<Esc>v<Left>", { desc = "Select left" })
vim.keymap.set("i", "<S-Right>", "<Esc>v<Right>", { desc = "Select right" })


-- ==========================================================================
-- 3. APPLY YOUR CUSTOM COLORSCHEME
-- ==========================================================================
-- We wrap your colorscheme in a local function. This is a performance trick:
-- it prevents all these highlight definitions from lingering in Neovim's 
-- global memory space after they have been executed.
local function load_vischeme()
  vim.cmd([[
    hi clear
    syntax reset
    let g:colors_name = "vischeme"
    set background=dark
    set t_Co=256

    hi Normal guifg=#9b5353 ctermbg=NONE guibg=#000000 gui=NONE
    hi DiffText guifg=#907e7e guibg=NONE
    hi ErrorMsg guifg=#907e7e guibg=NONE
    hi WarningMsg guifg=#907e7e guibg=NONE
    hi PreProc guifg=#907e7e guibg=NONE
    hi Exception guifg=#907e7e guibg=NONE
    hi Error guifg=#907e7e guibg=NONE
    hi DiffDelete guifg=#907e7e guibg=NONE
    hi GitGutterDelete guifg=#907e7e guibg=NONE
    hi GitGutterChangeDelete guifg=#907e7e guibg=NONE
    hi cssIdentifier guifg=#907e7e guibg=NONE
    hi cssImportant guifg=#907e7e guibg=NONE
    hi Type guifg=#907e7e guibg=NONE
    hi Identifier guifg=#907e7e guibg=NONE
    hi PMenuSel guifg=#d0021b guibg=NONE
    hi Constant guifg=#d0021b guibg=NONE
    hi Repeat guifg=#d0021b guibg=NONE
    hi DiffAdd guifg=#d0021b guibg=NONE
    hi GitGutterAdd guifg=#d0021b guibg=NONE
    hi cssIncludeKeyword guifg=#d0021b guibg=NONE
    hi Keyword guifg=#d0021b guibg=NONE
    hi IncSearch guifg=#90f3f5 guibg=NONE
    hi Title guifg=#90f3f5 guibg=NONE
    hi PreCondit guifg=#90f3f5 guibg=NONE
    hi Debug guifg=#90f3f5 guibg=NONE
    hi SpecialChar guifg=#90f3f5 guibg=NONE
    hi Conditional guifg=#90f3f5 guibg=NONE
    hi Todo guifg=#90f3f5 guibg=NONE
    hi Special guifg=#90f3f5 guibg=NONE
    hi Label guifg=#90f3f5 guibg=NONE
    hi Delimiter guifg=#90f3f5 guibg=NONE
    hi Number guifg=#90f3f5 guibg=NONE
    hi Define guifg=#90f3f5 guibg=NONE
    hi MoreMsg guifg=#90f3f5 guibg=NONE
    hi Tag guifg=#90f3f5 guibg=NONE
    hi String guifg=#90f3f5 guibg=NONE
    hi MatchParen guifg=#90f3f5 guibg=NONE
    hi Macro guifg=#90f3f5 guibg=NONE
    hi DiffChange guifg=#90f3f5 guibg=NONE
    hi GitGutterChange guifg=#90f3f5 guibg=NONE
    hi cssColor guifg=#90f3f5 guibg=NONE
    hi Function guifg=#6aa2ff guibg=NONE
    hi Directory guifg=#f66905 guibg=NONE
    hi markdownLinkText guifg=#f66905 guibg=NONE
    hi javaScriptBoolean guifg=#f66905 guibg=NONE
    hi Include guifg=#f66905 guibg=NONE
    hi Storage guifg=#f66905 guibg=NONE
    hi cssClassName guifg=#f66905 guibg=NONE
    hi cssClassNameDot guifg=#f66905 guibg=NONE
    hi Statement guifg=#fa8491 guibg=NONE
    hi Operator guifg=#fa8491 guibg=NONE
    hi cssAttr guifg=#fa8491 guibg=NONE
    hi Pmenu guifg=#9b5353 guibg=#454545
    hi Title guifg=#9b5353
    hi NonText guifg=#ffffff guibg=#000000
    hi Comment guifg=#ffffff gui=italic
    hi SpecialComment guifg=#ffffff gui=italic guibg=NONE
    hi TabLineFill gui=NONE guibg=#454545
    hi TabLine guifg=#160c0c guibg=#454545 gui=NONE
    hi StatusLine gui=bold guibg=#454545 guifg=#9b5353
    hi StatusLineNC gui=NONE guibg=#000000 guifg=#9b5353
    hi Search guibg=#ffffff guifg=#9b5353
    hi VertSplit gui=NONE guifg=#454545 guibg=NONE
    hi Visual gui=NONE guibg=#454545
  ]])
end
-- Execute the function to apply the theme immediately
load_vischeme()


-- ==========================================================================
-- 4. BOOTSTRAP PLUGIN MANAGER (lazy.nvim)
-- ==========================================================================
-- This block checks if lazy.nvim is installed on your machine. 
-- If it isn't, it automatically clones it from GitHub. This makes your 
-- configuration highly portable if you ever move to a new computer.
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    "git",
    "clone",
    "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    "--branch=stable",
    lazypath,
  })
end
-- Adds lazy.nvim to Neovim's "runtimepath" so it can be required below
vim.opt.rtp:prepend(lazypath)


-- ==========================================================================
-- 5. INITIALIZE PLUGINS & PERFORMANCE TWEAKS
-- ==========================================================================
-- This is where we call lazy.nvim to manage our plugins. 
require("lazy").setup({
    -- 1. OIL.NVIM (File System Editor)
    {
        "stevearc/oil.nvim",
        -- Optional dependencies, but highly recommended for file icons
        dependencies = { "nvim-tree/nvim-web-devicons" },
        config = function()
            require("oil").setup({
                -- This is true by default, but explicitly setting it ensures
                -- it completely hijacks Netrw and handles the :Ex command.
                default_file_explorer = true,
                -- Optional: Shows hidden files by default
                view_options = {
                    show_hidden = true,
                },
            })
            -- Map the minus key '-' to open Oil in the current file's directory.
            -- This is the community standard hotkey for Oil.
            vim.keymap.set("n", "-", "<CMD>Oil<CR>", { desc = "Open parent directory (Oil)" })
        end,
    },

    -- 2. MINI.FILES (Floating Column Navigator)
    {
        "echasnovski/mini.files",
        version = "*", -- mini.nvim plugins recommend tracking stable versions
        config = function()
            require("mini.files").setup({
                -- Default options are excellent. It will float in the center.
                windows = {
                    preview = true, -- Shows a preview of the file as you hover over it
                    width_focus = 30,
                    width_preview = 30,
                }
            })
            -- Map <leader>e to open mini.files.
            -- We use a small function so it opens exactly where your current file is,
            -- rather than always opening at the root of your project.
            vim.keymap.set("n", "<leader>e", function()
                -- Gets the path of the currently active buffer
                local current_file = vim.api.nvim_buf_get_name(0)
                require("mini.files").open(current_file, true)
            end, { desc = "Open mini.files (directory of current file)" })
        end,
    },
    -- 3. NVIM-CMP (Speed-Optimized Autocomplete Engine)
    {
        "hrsh7th/nvim-cmp",
        -- LAZY-LOADING MAGIC: Only load completion when entering Insert mode!
        -- Keeps your initial startup time at 0ms cost for this plugin.
        event = "InsertEnter",
        dependencies = {
            "L3MON4D3/LuaSnip",
            "saadparwaiz1/cmp_luasnip",
            "hrsh7th/cmp-buffer",
            "hrsh7th/cmp-path",
            "hrsh7th/cmp-nvim-lsp",
        },
        config = function()
            local cmp = require("cmp")
            local luasnip = require("luasnip")

            cmp.setup({
                snippet = {
                    expand = function(args)
                        luasnip.lsp_expand(args.body)
                    end,
                },
                mapping = cmp.mapping.preset.insert({
                    ["<C-b>"] = cmp.mapping.scroll_docs(-4),
                    ["<C-f>"] = cmp.mapping.scroll_docs(4),
                    ["<C-Space>"] = cmp.mapping.complete(),
                    ["<C-e>"] = cmp.mapping.abort(),
                    ["<CR>"] = cmp.mapping.confirm({ select = true }),
                    ["<Tab>"] = cmp.mapping(function(fallback)
                        if cmp.visible() then
                            cmp.select_next_item()
                        elseif luasnip.expand_or_jumpable() then
                            luasnip.expand_or_jump()
                        else
                            fallback()
                        end
                    end, { "i", "s" }),
                    ["<S-Tab>"] = cmp.mapping(function(fallback)
                        if cmp.visible() then
                            cmp.select_prev_item()
                        elseif luasnip.jumpable(-1) then
                            luasnip.jump(-1)
                        else
                            fallback()
                        end
                    end, { "i", "s" }),
                }),
                sources = cmp.config.sources({
                    { name = "nvim_lsp" },
                    { name = "luasnip" },
                    { name = "buffer", keyword_length = 3 }, -- Only trigger buffer words after 3 chars to save CPU
                    { name = "path" },
                }),
            })
        end,
    },
    -- 4. COMMENT.NVIM (Ctrl + / to comment text)
    {
        "numToStr/Comment.nvim",
        event = { "BufReadPre", "BufNewFile" }, -- Lazy-load for performance
        config = function()
            require("Comment").setup()

            -- Normal mode (comments out current line)
            -- We use remap = true so it triggers the plugin's built-in 'gcc' command
            vim.keymap.set("n", "<C-/>", "gcc", { remap = true, desc = "Toggle comment" })
            vim.keymap.set("n", "<C-_>", "gcc", { remap = true, desc = "Toggle comment (terminal fallback)" })

            -- Visual mode (comments out highlighted block)
            -- We use remap = true so it triggers the plugin's built-in 'gc' command
            vim.keymap.set("v", "<C-/>", "gc", { remap = true, desc = "Toggle comment block" })
            vim.keymap.set("v", "<C-_>", "gc", { remap = true, desc = "Toggle comment block (terminal fallback)" })
        end,
    }
})
--{
-- -- Here is where we beat standard distributions in speed.
--  performance = {
--    rtp = {
--      -- We disable built-in legacy Vim plugins that load by default.
--      -- You likely don't need zip/tar readers or the old netrw file explorer.
--      -- Skipping these saves valuable time during startup.
--    disabled_plugins = {
--        "gzip",
--        "matchit",
--        "tarPlugin",
--        "tohtml",
--        "tutor",
--        "zipPlugin",
--      },
--    },
--  },
--})

-- COMMENTS WRITTEN WITH THE HELP OF GEMINI PRO V3.1 --

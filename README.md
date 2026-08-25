# Hobbies Repository 🚀

Welcome to my **Hobbies** repository! This is a fun, experiment-driven sandbox where I build and explore various side projects, tools, and configurations. It's a space for learning, optimizing, and playing around with code.

---

## 📈 Investing (Wealth & Debt Strategy Engine)
**Directory:** `/Investing`

A personal finance dashboard designed to help visualize and optimize the balance between paying down debt and investing capital over a 5-year trajectory. 

**Features:**
- **Avalanche Method:** Automatically prioritizes high-interest debt based on custom thresholds.
- **Dynamic Cash Flow:** Sliders to balance income and allocation pool in real-time.
- **Macro Settings:** Configurable Debt vs. Invest Threshold, Expected Inflation (Real Purchasing Power), and Estimated Tax Rate.
- **Data Visualization:** Real-time 5-year net worth trajectory charts using Chart.js.
- **Persistence:** A lightweight Python backend (`app_server.py`) saves custom scenarios to a local JSON file.

**How to run:**
```bash
cd Investing
python app_server.py
```
Then visit `http://127.0.0.1:5000/`.

---

## 📝 Neovim Configuration
**Directory:** `/nvim`

My custom Neovim configuration (`init.lua`) tailored for a modern, fast, and ergonomic editing experience.

**Highlights:**
- **Performance:** Built-in Lua loader enabled for byte-compilation and maximum startup speed.
- **Modern Ergonomics:** Text selection using `Shift + Arrow keys` (bridging the gap between standard editors and Vim), relative line numbers, and smart casing.
- **Integration:** Seamless system clipboard sync (`unnamedplus`) and mouse support enabled out of the box.

**Installation:**
Link or copy the contents of the `/nvim` directory to your local Neovim config folder (e.g., `~/.config/nvim/` on Unix or `~/AppData/Local/nvim/` on Windows).

---
*Built with curiosity, code, and compound interest.*

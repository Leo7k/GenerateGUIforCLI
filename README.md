
[![ru](https://img.shields.io/badge/lang-ru-green.svg)](/README.ru.md)
[![en](https://img.shields.io/badge/lang-en-green.svg)](/README.md)

# GenerateGUIforCLI

A lightweight tool to **generate user-friendly GUIs** for command-line applications (CLI) using JSON-based configurations. Perfect for users who prefer graphical interfaces over terminal commands.

---

## Features
- **Convert CLI arguments into intuitive GUI forms** (checkboxes, dropdowns, file pickers).
- **JSON-driven configuration** — describe CLI parameters once, reuse forever.
- **Run applications directly** from the GUI (NW.js/HTA only).

---

## Quick Start

### 1. Installation
Download and unzip a copy of [the entire repository](https://codeload.github.com/Leo7k/GenerateGUIforCLI/zip/refs/heads/main).

### 2. Running the Tool
Choose one of these methods:
| Method       | Requirements              | Launch Command          |
|--------------|---------------------------|-------------------------|
| **NW.js**    | [Install NW.js](https://nwjs.io/) | `nw C:\Path\to\app` where 'C:\Path\to\app' is a directory where GenerateGUIforCLI is located.|
| **HTA**      | Windows only              | Double-click `generateGUIforCLI.hta` |
| **Browser**  | Any modern browser        | Open `generateGUIforCLI.html` (limited functionality) |

---

## How to Use
### Step 1: Prepare a JSON Configuration
Create a JSON file describing your CLI app’s arguments. Follow the [JSON Schema](generateGUIforCLI_schema_2019-09.json) **or** use a pre-made configuration from a trusted source (e.g., community repositories or official tool documentation).

### Step 2: Load the JSON File
1. Open the tool (NW.js/HTA/browser).
2. Click **"Path to CLI arguments description"** and select your JSON file.
3. The GUI will auto-generate input fields based on the JSON.

### Step 3: Generate and Execute
1. Fill in the GUI fields.
2. Click **"Generate Command Line"** to preview the CLI command.
3. *(NW.js/HTA only)*:  
   - Specify the executable path.  
   - Click **"Execute"** to run the CLI app with your parameters.
- **⚠️ Security Note**: Before executing, **always verify the generated command** in the text field. Proceed only if you:  
     - Understand **exactly** what the command does.  
     - Confirm it matches your intent (e.g., no unexpected file deletions or risky operations).  

---

### JSON Editors
Use these tools to create/edit JSON configurations:
- [JSON Editor Online](https://json-editor.github.io/json-editor/)
- [VS Code with JSON Schema](https://code.visualstudio.com/docs/languages/json#_json-schemas-and-settings)

---

## FAQ
### Where do I get CLI argument descriptions?
You can obtain CLI argument details through:
1. **Built-in help** (run in terminal):  
   ```bash
   your_app --help    # Most Unix tools
   your_app /?       # Common on Windows
   ```
2. **Official documentation**:  
   Check the application’s:  
   - Official website
   - Source repository (e.g., GitHub `README.md` or `man` pages)  

### Why can’t I execute apps in the browser?
Browsers are designed to display web pages, not to execute arbitrary executable files like .exe. Use **NW.js** or **HTA** for full functionality.

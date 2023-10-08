# Introduction

Emacs is a powerful and highly customizable text editor that can be used directly within your terminal. This tutorial will introduce you to the basics of using Emacs in a terminal environment, from opening files to basic text editing and saving.

## Prerequisites

Before we begin, make sure you have Emacs installed on your system. You can typically install it using your system's package manager. For example, on Ubuntu, you can run:

```bash
sudo apt-get install emacs
```

## Launching Emacs

To start using Emacs, open your terminal and run the following command:

```bash
emacs
```

This will launch Emacs in your terminal window.

## Basic Navigation and Editing

### Key Concepts

- Emacs uses key combinations for various actions. Most of these key combinations involve holding down the `Ctrl` (`C`) or `Meta` (`M`) key (often represented by `Alt`) and pressing another key. For example, `C-x` means press and hold the `Ctrl` key, then press `x`.

- To exit Emacs, press `C-x C-c`.

### Opening and Creating Files

1. Open an existing file by pressing `C-x C-f` and then enter the file path. If the file doesn't exist, Emacs will create a new one.

2. Save the current file with `C-x C-s`.

3. Save the file with a different name using `C-x C-w`.

### Basic Text Editing

- Move the cursor:
  - `C-p` - Move cursor up (previous line).
  - `C-n` - Move cursor down (next line).
  - `C-b` - Move cursor left (back).
  - `C-f` - Move cursor right (forward).

- Cut, copy, and paste:
  - `C-k` - Cut (kill) text from the cursor position to the end of the line.
  - `M-w` - Copy (kill-ring save) text.
  - `C-y` - Paste (yank) the most recently killed text.

- Undo and redo:
  - `C-/` or `C-x u` - Undo.
  - `M-/` - Redo (only works in some versions of Emacs).

### Exiting Emacs

To exit Emacs, press `C-x C-c`. If you have unsaved changes, Emacs will ask if you want to save them before quitting.

## Customization

Emacs is highly customizable. You can create and modify configuration files to tailor it to your preferences. The main configuration file is usually located at `~/.emacs` or `~/.emacs.d/init.el`.

## Conclusion

This tutorial covers the basics of using Emacs as a terminal text editor. With practice, you can become proficient in Emacs and take advantage of its advanced features and extensive customization options.
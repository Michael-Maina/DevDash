# A Brief Introduction to Terminal Text Editors

The terminal is like a backstage pass to your computer's inner workings. It's where you communicate with your machine using text commands. While it might sound a bit intimidating at first, especially if you're new to it, don't worry – we're here to guide you through the process.

## Why Use the Terminal?

If you're into web development or any kind of programming, you'll often find yourself needing the terminal. You'll hear folks talk about CLI tools (Command Line Interface tools), which are simply software you interact with using text commands.

The terminal is like the control center for these tools, and it's your gateway to a world of powerful functionality.

## What Can You Do with the Terminal?

A lot! From running development servers to managing files and folders, the terminal is your trusty sidekick. Many essential tools come pre-installed on your system, while others can be easily added from package registries, which are like app stores for command line tools.

## Is the Terminal User-Friendly?

Well, not exactly. Unlike the graphical user interfaces (GUIs) you're used to, the terminal lacks those pretty buttons and icons. It might look a bit unfriendly when you first open it, but don't let that scare you away. With some guidance and practice, you'll find it surprisingly efficient.

## A Glimpse into Terminal History

The terminal has been around since the 1950s-60s, and the early versions were nothing like what we have today. Thankfully, it has evolved a lot since then. It's a constant presence in computing, from powerful servers to tiny devices like the Raspberry Pi Zero, and even on your mobile phone.

## Why Embrace the Terminal?

The terminal gives you direct access to your computer's core functions and file system. This makes it incredibly useful for tasks that require precision and speed. Imagine renaming hundreds of files in an instant, something that would take ages using a graphical file explorer.

In addition to its power, the terminal is a hub for automation. You can write scripts and commands to make your computer do repetitive tasks for you.

So, even though it might seem a bit intimidating at first, the terminal is here to stay, and it's a valuable skill to have in your tech toolkit. Embrace it, and you'll unlock a world of possibilities!

## Getting Started with Basic Terminal Commands

Let's dive right into the world of terminal commands! The command line is like a Swiss Army knife for your computer, and it's capable of performing various tasks right out of the box. Here are some fundamental commands and the tasks they handle:

### File System Navigation and Operations

1. **cd** - Change Directory: Move around your computer's file system.
2. **pwd** - Print Working Directory: Display the full(absolute) path to the directory you're currently in.
3. **mkdir** - Make Directory: Create new directories.
4. **touch** - Create Files: Make new files and modify their properties.
5. **cp** - Copy: Duplicate files or directories.
6. **mv** - Move: Relocate files or directories.
7. **rm** - Remove: Delete files or directories.
8. **grep** - Search Text: Hunt for text within larger bodies of text.
9. **less, cat** - File Viewing: Display the contents of a file page by page.

Now, let's roll up our sleeves and start using some of these tools in the command line. But before we go any further, open your terminal program!

## Project

We'll work with the following file structure to illustrate how to use some of the commands above.

```
- home/
  - user/
    - project0/
    - project1/
    - project2/
      - sub_project2/
      - hello_terminal
```
Any word ending with a forward slash (/) means that is a directory/folder, the rest are files. 

## Navigating Your System

When you step into the world of the command line, one of the first things you'll need to do is navigate to the right directory to get things done. Typically, your terminal program starts you off in your "home" directory, but you'll often want to go elsewhere.

Meet the **cd** command. It stands for Change Directory and is not just a program; it's a built-in command that comes with your operating system. You can't accidentally delete it, which is a relief!

To change your current directory, simply type `cd` followed by the directory you want to enter. If it's a directory within your home directory, you can use `cd downloads` as an example. Let's take your first step in this journey by opening your terminal!

Type this into the terminal pane on the right:

```
$ cd home
```

To check what directory you're in, type:

```
$ pwd
```

To create a new directory for our project, type:

```
$ mkdir project0
```

To confirm if the command worked, type to list all the directories present:

```
$ ls
```

To be even more precise, combine ls with grep to search for a specific file or directory:

```
$ ls | grep project0
```

The vertical symbol, **|** is known as pipe. It is used to combine commands, where the output of the left most command is used as input for the command on the right.

You can easily combine all the commands above on one line if you so wished by using a semi colon to separate them. Like so:

```
$ cd home; mkdir project0; ls | grep project0
```

The semi colon tells the shell program that the command is independent and should run it as if it were on its own line like we did above. The rest are executed in a similar fashion.

There are other ways to combine commands in more complex, interesting ways that we'll get to explore later.

Here's our file system tree again:

```
- home/
  - user/
    - project0/
    - project1/
    - project2/
      - sub_project2/
      - hello_terminal
```

We can proceed to create the other directories, **project1** and **project2**. **Project2** however has another directory, sub directory if you will, inside it.

There are two ways to create sub_project2. Either:

```$ 
$ mkdir project1
$ mkdir project2
$ cd project2
$ mkdir sub_project2
```

or

```
$ mkdir -p project1 project2/sub_project2
```

Commands allow us to give them more instructions on how they should perform their functions. The `-p` is a flag. We are using it to instruct the `mkdir` command to create **sub_project2** inside **project2**, and if **project2** doesn't exist, to create it as well.

## Creating Files

Let's now change our current working directory to the **project2** directory we've just created:

```
$ cd project2
```

To create a new file, we use the touch command:

```
$ touch hello_terminal
```

This creates our file inside our directory. This can also be achieved without changing directories, like so:

```
$ touch project2/hello_terminal
```

Here we are passing the path to the file, that is, where the file is to be located in our file system. Given the path to a file or directory, one can navigat$ e the file system in a quicker and more convenient way.

There are two ways to define the path of a file or directory: absolute and relative.

### 1. Absolute Path

This method lists all the directories and sub-directories inside which a target file or directory is, with the target being last.

```
$ cd /home/user/project0/
```

Here we are following the directories and sub-directories that precede **project0**. This always useful when you're familiar with your file system and need to access a directory or file when you're working deep inside another directory.

### 2. Relative Path

This method uses special characters to shorten how much we type into the terminal. These special characters are:

  - Tilde (~) - used to refer to the home directory
  - Period (.) - used to refer to the current working directory(cwd)
  - Double period (..) - used to refer to the parent of the cwd
  - Hyphen (-) - used to the previous cwd

A relative path to a target file or directory might look like this:

If you are deep in your file system and want to change into a directory in the home directory, use this:
```
$ cd ~/project0     # An alternative cd ${HOME}/project0 which we'll cover later
```
$ 
If you want to go back to the parent of your cwd:
```
$ cd ..
```

If you want to go back to the parent to the parent of your cwd:
```
$ cd ../..
```

If you change into a directory and want to go back to where you were previously quickly, use:
```
$ cd -
```

The period is used with commands like `cp` and `mv` to copy/move files from other directories to the cwd. Let's explore these two commands alongside the use of the period.

We have our **hello_terminal** in **project2**. Let's copy it into **project0**:
```
$ cd ~/project0

$ cp ~/project2/hello_terminal .  #Copies hello_terminal into cwd
$ mv ~/project2/hello_terminal .  #Moves hello_terminal into cwd
```
The period here is referring to our cwd, **project0**. List the files to check if we were successful.

`cp -v` lets you know what the command is doing. The `-v` means *verbose* and a lot of commands that typically don't have any output have this flag.

To learn more about how a command can be used and the flags that accompany it, refer to the manual page that is accessible via the `man` command.

The example below will open the man(ual) page of the `cp` command.
```
$ man cp      # cp --help A shorter alternative that you can explore
```

## Deleting Files and Directories
We have looked at how to create files and directories, how to navigate them but not how to remove them.

`rm` is used to delete both files and directories.

For files:
```
$ rm hello_terminal
```

For directories:
```$ 
$ rm -r project0
```

Be careful when using the `rm` command since it is irreversible. A good practice involves always using it with the `-i` flag that interactively asks the user to confirm if they are sure about the operation. Like so:
```
$ rm -i hello_terminal

$ rm -r -i project0     # rm -ri project0 also works
```

## Summary
That brings us to the end of our brief tour of the terminal/command line. Next up we'll be looking in more detail at terminal editors. Yes, you can edit files directly within your terminal without ever needing to touch your mouse or touchpad.
# Writing Your First Bash Shell Script

In this tutorial, you will learn how to write a basic Bash shell script step by step. We'll create a simple script that automates the process of adding and committing files to a Git repository. Before we start, make sure you have your preferred terminal editor open.

### **Step 1:** Open your preferred terminal editor.

Before we begin writing the script, ensure that you have your terminal editor of choice open and ready to go.

### **Step 2:** Create a New Bash Script File

In your terminal editor, create a new file for your Bash script. You can name it something like `git_commit.sh`. Make sure to include the shebang line at the beginning to indicate that this is a Bash script:

```bash
#!/usr/bin/env bash
```

The shebang line tells the system to use the Bash interpreter to execute the script.

### **Step 3:** Initialize the Commit

Now, let's start writing the script. The first line is responsible for displaying an initialization message. Add the following line to your script:

```bash
echo "Initializing commit"
```

This line will simply print "Initializing commit" to the terminal when the script is executed.

### **Step 4:** Declare an Array

Next, we declare an array named `files` to store the file names that will be passed to the script. Add the following line:

```bash
declare -a files
```

This line creates an empty array called `files`.

### **Step 5:** Add Command Line Arguments to the Array

We will add all the positional parameters (arguments) passed to the script to our `files` array. Add this line:

```bash
files=("$@")
```

The `"$@"` notation represents all the command line arguments passed to the script.

### **Step 6:** Calculate the Number of Files

Now, let's calculate the number of files to pass to the `git add` command. We subtract 1 from the total number of arguments because the first argument is the commit message. Add this line:

```bash
size="$(($# - 1))"
```

This line calculates the size of the `files` array.

### **Step 7:** Add Files to Git

We're now ready to add the specified files to Git using the `git add` command. Add this line:

```bash
git add "${files[@]:1:size}"
```

This line uses array slicing to pass the desired files to the `git add` command.

### **Step 8:** Display a Message

Depending on whether the second argument is a dot (`.`), we'll display different messages. If it's a dot, we'll assume you want to add all files. If not, we'll list the files being added. Add these lines:

```bash
if [[ "$2" == "." ]]; then
    echo "Adding all files"
else
    echo "Adding files: ${files[@]:1:size}"
fi
```

This section uses conditional logic (`if`) to check if the second argument is a dot and then displays an appropriate message.

### **Step 9:** Commit Changes

We'll now commit the changes using the `git commit` command. Add this line:

```bash
git commit -m "$1"
```

This line commits the changes with the commit message provided as the first argument when running the script.

### **Step 10:** Push to the Git Repository

Lastly, let's push the committed changes to the Git repository. Add this line:

```bash
git push origin "$(git symbolic-ref --short HEAD)"
```

This line pushes the changes to the remote Git repository, using the current branch name as the reference.

### **Step 11:** Save and Close

Save your script file and close your terminal editor.

Congratulations! You've created a basic Bash shell script that automates the process of adding and committing files to a Git repository. To use the script, simply run it in your terminal with the appropriate commit message and file names as arguments.

Happy scripting!
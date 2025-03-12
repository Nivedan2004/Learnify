const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  

    export const courseOutlineAIModel = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "Generate a study material for Python for Exam and level of difficulty  will be EASY with summary of course, List of chapters along with summary for each chapter, Topic list in each chapter, All results in JSON format"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\n  \"course_title\": \"Introduction to Python Programming (Easy Level)\",\n  \"course_summary\": \"This course provides a gentle introduction to Python programming, covering fundamental concepts and practical skills for beginners.  It focuses on core language features, basic data structures, and simple program design. The goal is to equip learners with the ability to write and understand basic Python scripts.\",\n  \"chapters\": [\n    {\n      \"chapter_number\": 1,\n      \"chapter_title\": \"Getting Started with Python\",\n      \"chapter_summary\": \"This chapter introduces Python, its uses, and how to set up your development environment. It covers installing Python and running your first simple program.\",\n      \"topics\": [\n        {\"topic\": \"What is Python?\", \"description\": \"Overview of the Python programming language and its applications.\"},\n        {\"topic\": \"Installing Python\", \"description\": \"Step-by-step guide to installing Python on Windows, macOS, or Linux.\"},\n        {\"topic\": \"The Python Interpreter\", \"description\": \"Using the Python interpreter for interactive coding.\"},\n        {\"topic\": \"Your First Program: 'Hello, World!'\", \"description\": \"Writing and running a simple Python program.\"},\n        {\"topic\": \"Using a Text Editor or IDE\", \"description\": \"Introduction to text editors and integrated development environments (IDEs) for writing Python code.\"}\n      ]\n    },\n    {\n      \"chapter_number\": 2,\n      \"chapter_title\": \"Data Types and Variables\",\n      \"chapter_summary\": \"This chapter explores Python's basic data types (numbers, strings, booleans) and how to store values in variables.\",\n      \"topics\": [\n        {\"topic\": \"Data Types: Integers, Floats, Strings, Booleans\", \"description\": \"Understanding the different data types and their characteristics.\"},\n        {\"topic\": \"Variables: Declaring and Assigning Values\", \"description\": \"Creating and using variables to store data.\"},\n        {\"topic\": \"Variable Naming Conventions\", \"description\": \"Rules and best practices for naming variables.\"},\n        {\"topic\": \"Basic Input and Output\", \"description\": \"Using the `input()` and `print()` functions for interacting with the user.\"},\n        {\"topic\": \"Comments in Python\", \"description\": \"Adding comments to your code for documentation.\"}\n      ]\n    },\n    {\n      \"chapter_number\": 3,\n      \"chapter_title\": \"Operators\",\n      \"chapter_summary\": \"This chapter covers the various operators available in Python, including arithmetic, comparison, and logical operators.\",\n      \"topics\": [\n        {\"topic\": \"Arithmetic Operators (+, -, *, /, %, //, **)\", \"description\": \"Performing mathematical operations in Python.\"},\n        {\"topic\": \"Comparison Operators (==, !=, >, <, >=, <=)\", \"description\": \"Comparing values and returning boolean results.\"},\n        {\"topic\": \"Logical Operators (and, or, not)\", \"description\": \"Combining boolean expressions.\"},\n        {\"topic\": \"Assignment Operators (=, +=, -=, *=, /=)\", \"description\": \"Assigning values to variables using different operators.\"},\n        {\"topic\": \"Operator Precedence\", \"description\": \"Understanding the order in which operators are evaluated.\"}\n      ]\n    },\n    {\n      \"chapter_number\": 4,\n      \"chapter_title\": \"Control Flow: Conditional Statements\",\n      \"chapter_summary\": \"This chapter introduces conditional statements (`if`, `elif`, `else`) to control the flow of execution in your programs based on certain conditions.\",\n      \"topics\": [\n        {\"topic\": \"The `if` Statement\", \"description\": \"Executing code blocks based on a condition.\"},\n        {\"topic\": \"The `else` Statement\", \"description\": \"Executing code blocks when the `if` condition is false.\"},\n        {\"topic\": \"The `elif` Statement\", \"description\": \"Checking multiple conditions in a sequence.\"},\n        {\"topic\": \"Nested `if` Statements\", \"description\": \"Using `if` statements inside other `if` statements.\"},\n        {\"topic\": \"Boolean Expressions and Truthiness\", \"description\": \"Understanding boolean logic and truthy/falsy values.\"}\n      ]\n    },\n    {\n      \"chapter_number\": 5,\n      \"chapter_title\": \"Control Flow: Loops\",\n      \"chapter_summary\": \"This chapter covers the use of `for` and `while` loops to repeat code blocks multiple times.\",\n      \"topics\": [\n        {\"topic\": \"The `for` Loop\", \"description\": \"Iterating over sequences (e.g., strings, lists).\"},\n        {\"topic\": \"The `while` Loop\", \"description\": \"Repeating a code block as long as a condition is true.\"},\n        {\"topic\": \"The `break` Statement\", \"description\": \"Exiting a loop prematurely.\"},\n        {\"topic\": \"The `continue` Statement\", \"description\": \"Skipping to the next iteration of a loop.\"},\n        {\"topic\": \"Looping with `range()`\", \"description\": \"Generating sequences of numbers for looping.\"}\n      ]\n    },\n    {\n      \"chapter_number\": 6,\n      \"chapter_title\": \"Lists\",\n      \"chapter_summary\": \"This chapter introduces lists, a fundamental data structure for storing collections of items.\",\n      \"topics\": [\n        {\"topic\": \"Creating Lists\", \"description\": \"Defining lists with square brackets and comma-separated elements.\"},\n        {\"topic\": \"Accessing List Elements (Indexing)\", \"description\": \"Retrieving elements from a list using their index.\"},\n        {\"topic\": \"Slicing Lists\", \"description\": \"Creating sub-lists from a list using slicing.\"},\n        {\"topic\": \"List Methods (append, insert, remove, pop, len)\", \"description\": \"Common methods for modifying and inspecting lists.\"},\n        {\"topic\": \"Looping Through Lists\", \"description\": \"Iterating over list elements using `for` loops.\"}\n      ]\n    },\n    {\n      \"chapter_number\": 7,\n      \"chapter_title\": \"Functions\",\n      \"chapter_summary\": \"This chapter explains how to define and call functions in Python, promoting code reusability and modularity.\",\n      \"topics\": [\n        {\"topic\": \"Defining Functions (def keyword)\", \"description\": \"Creating reusable blocks of code with the `def` keyword.\"},\n        {\"topic\": \"Calling Functions\", \"description\": \"Executing functions by their name.\"},\n        {\"topic\": \"Arguments and Parameters\", \"description\": \"Passing data to functions using arguments and parameters.\"},\n        {\"topic\": \"Return Values\", \"description\": \"Returning data from functions using the `return` statement.\"},\n        {\"topic\": \"Scope of Variables (Local vs. Global)\", \"description\": \"Understanding the scope of variables defined inside and outside functions.\"}\n      ]\n    }\n  ]\n}\n```"},
          ],
        },
      ],
    });
  
   // const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
   // console.log(result.response.text());
  
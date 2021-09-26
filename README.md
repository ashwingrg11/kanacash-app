
## Documentation

This documentation might not be the best but hope it will guide and help you through the project how it is manged and structured. Each folder contain README.md file where you can get more details about the file and folder structure and how it is working with other files to bring app alive.

## Project Structure

``sh
machnet/``
|-- src/
    |-- assets/
    |-- components/
    |-- hooks/
    |-- navigation/
    |-- Screens/
    |-- services/
    |-- store/
    |-- utils/

Each of these directories have special types of files and logics:

## Test file

The _tests_ folder contains all of my tests. The structure matches the structure of the src folder. So its easier to find tests. I prefer to keep my tests separate to my source code.

## Source Code

android: All the specific native code for Android. You will only need to edit this if you need to write Android specific code in Java/Kotlin or edit the way your application is built.
ios: Same as above except for IOS.

## src

Most of the code related to this project exists within the src/ folder. This is where we do MAGIC 🚀 👊

**assets/**\
The assets folder contains images, relevant files and svg files.

**components/**\
Components typically will be used by multiple views. The components folder contains a collection of UI Stateless components. Shouldnt store state. Most components in this directory will be function-based components. Stuff like buttons, inputs, labels and all presentational components goes here. This components can also accept functions as props and dispatch events, but no state should be held inside.\
Each component has a test file to help us maintain them because they used widely in the project.

**constants/**\
Used to store common types.

**screens/**\
In this folder all the screen 🖥  are managed. Each screen 🖥 have its own folder with the entry point of index.js and will also may contain `container folder` (UseCase applied). READ MORE on insider screen folder

**services/**\
Most of the time, a service used to manage API integrations. So, it is separated from logic in the component.\
Service is not a react component. It is simply a javascript function to manage API integration based on the type of data/configurations and returns axios instance.

**store/**\
Inside it, there are actions and reducers subfolder to manage redux states.\
Mostly, the actions and reducers will be called in the screen components so they usually named based on screen that use them. Action creators and redux thunk will handle the asynchronous http requests.

**utils/**\
The utils folder is just a place to locate some utility functions that used repeatedly in the project. Files in the utils folder should only contain some functions like validation, date formatting, string conversion, etc.

Test file

Snapshots

Button.test.js
DatePicker.test.js
Header.test.js
Icon.test.js
Image.test.js
Loader.test.js
Logo.test.js
Modal.test.js
PickerModal.test.js
Text.test.js
TextInput.test.js

ToDos

- Verify the name of folders and files
- refactor Components - change class component into function component, user PropTypes to define the props
- make the entry point for the components index.js where all components are used.
- make separate folder for each components

Clean up the files
use ESLINT + PRETTIFY

Iterate - Do more changes

# What is this?
GenerateGUIforCLI - a simple tool that allows you to easiy build GUI on top of CLI applications.

# How to run?
Download the entire repository zip archive and unpack it in any folder. There are three possible ways to run:

 1. Open generateGUIforCLI.html in a browser. If this method is used, functionality will be limited - launching the application from the
    graphical interface will be impossible, and you will need to manually copy command line arguments.
 2. Open generateGUIforCLI.html using [NW.js](https://nwjs.io/)
 3. Run generateGUIforCLI.hta (available only for Windows)

# How to use?
You need to load a JSON file containing the description of command line arguments for a specific application. After doing this, corresponding input fields will appear where you can specify the necessary launch parameters for the console application. Once the parameters are filled in, press the "Generate Command Line" button - a list of command line arguments that correspond to the selected graphical interface parameters will be displayed in the text field.
If you initiate GenerateGUIforCLI outside of a web browser, you have the option to run the intended application right from the GUI. To do this, click the "Execute" button.

# Where to get a JSON file with command line argument descriptions?
If you don't have a JSON file with command line argument descriptions for your specific application, you need to
1. get textual description of command line arguments (usually available through the 'help' or '/?' commands)
2. create your own JSON file with command line arguments description according to [JSON Schema](https://github.com/Leo7k/GenerateGUIforCLI/blob/main/generateGUIforCLI_schema_2019-09.json). An example of a correct description of command line arguments in the required format can be found in the file `example.json`. You may use [JSON Editor](https://json-editor.github.io/json-editor/) or another JSON Editor with GUI.

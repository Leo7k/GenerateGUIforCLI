var MAIN_FORM_ID = "main-form";
var GENERATE_CMDLINE_BUTTON_ID = "generate-command-line";
var EXECUTE_BUTTON_ID = "execute";
var CMDLINE_DESCRIPTOR_INPUT_ID = "cli-arguments-json";
var CMDLINE_RESULT_ID = "result";
var EXECUTABLE_FILE_INPUT_ID = "executable-name";
var WARNING_MSG_ID = "warning-msg";

function onPageLoad(event) {
	var cmdLineDescriptorFileInput = document.getElementById(CMDLINE_DESCRIPTOR_INPUT_ID);
	if (cmdLineDescriptorFileInput.addEventListener) {
		cmdLineDescriptorFileInput.addEventListener("change", loadCmdLineDescriptor, false);
	}
	else {
		cmdLineDescriptorFileInput.attachEvent("onchange", loadCmdLineDescriptor);
	}
	var genCmdLine_Button = document.getElementById(GENERATE_CMDLINE_BUTTON_ID);
	if (genCmdLine_Button.addEventListener) {
		genCmdLine_Button.addEventListener("click", onGenerateCLI_Clicked, false);
	}
	else {
		genCmdLine_Button.attachEvent("onclick", onGenerateCLI_Clicked);
	}
}

function loadCmdLineDescriptor(evt) {
	document.getElementById(EXECUTABLE_FILE_INPUT_ID).value = "";
	document.getElementById(CMDLINE_RESULT_ID).innerHTML = "";
	document.getElementById(MAIN_FORM_ID).innerHTML = "";
	try {
		if (this.files != null) {
			if (this.files.length > 0) {
				var currentFile = this.files[0];
				if (currentFile.text != null) {
					currentFile.text().then(parseCmdLineDescriptor);
					return;
				}
				else if (window.FileReader != null) {
					var reader = new FileReader();
					reader.onload = function(e) {
						parseCmdLineDescriptor(reader.result);
					}
					reader.readAsText(currentFile);
					return;
				}
			}
		}
		if (window.ActiveXObject != null) {
			var fileSystemObject = new ActiveXObject("Scripting.FileSystemObject");
			var txtFile = fileSystemObject.OpenTextFile(this.value, 1, false, 0);
			var jsonText = txtFile.ReadAll();
			txtFile.Close();
			parseCmdLineDescriptor(jsonText);
			txtFile = undefined;
			fileSystemObject = undefined;
		}
	}
	catch(e) {
		console.error(e);
	}
}

function parseCmdLineDescriptor(descriptorText) {
	if ((descriptorText == null) || (descriptorText.length < 1)) {
		return;
	}
	argumentsDescriptors = JSON.parse(descriptorText);
	if (argumentsDescriptors.sections == null) {
		return;
	}
	var fileInputsReportFakePath = (document.getElementById(CMDLINE_DESCRIPTOR_INPUT_ID).value.substr(0, 12) == "C:\\fakepath\\");
	for (var s = 0; s < argumentsDescriptors.sections.length; s++) {
		var sectionFieldset = document.createElement("fieldset");
		var sectionFieldsetLegend = document.createElement("legend");
		sectionFieldsetLegend.innerText = argumentsDescriptors.sections[s].displayName;
		sectionFieldset.appendChild(sectionFieldsetLegend);
		for (var i = 0; i < argumentsDescriptors.sections[s].args.length; i++) {
			var argumentDescriptor = argumentsDescriptors.sections[s].args[i];
			var inputLabel = document.createElement("label");
			var inputTagName = null;
			var inputControl = null;
			if (argumentDescriptor.type == "number") {
				inputTagName = "input";
				inputControl = document.createElement(inputTagName);
				inputControl.type = "number";
			}
			else if (argumentDescriptor.type == "string") {
				inputTagName = "input";
				inputControl = document.createElement(inputTagName);
				inputControl.type = "text";
			}
			else if (argumentDescriptor.type == "input-file") {
				inputTagName = "input";
				inputControl = document.createElement(inputTagName);
				if (fileInputsReportFakePath) {
					inputControl.type = "text";
				}
				else {
					inputControl.type = "file";
				}
			}
			else if (argumentDescriptor.type == "input-file-multiple") {
				inputTagName = "input";
				inputControl = document.createElement(inputTagName);
				if (fileInputsReportFakePath) {
					inputControl.type = "text";
				}
				else {
					inputControl.type = "file";
					inputControl.multiple = true;
				}
			}
			else if (argumentDescriptor.type == "output-file") {
				inputTagName = "input";
				inputControl = document.createElement(inputTagName);
				inputControl.type = "text";
			}
			else if (argumentDescriptor.type == "boolean") {
				inputTagName = "input";
				inputControl = document.createElement(inputTagName);
				inputControl.type = "checkbox";
			}
			else if (argumentDescriptor.type == "select-one") {
				inputTagName = "select";
				inputControl = document.createElement(inputTagName);
				if (!argumentDescriptor.required) {
					inputControl.add(document.createElement("option"));
				}
				for (var j = 0; j < argumentDescriptor.options.length; j++) {
					var optionControl = document.createElement("option");
					optionControl.value = argumentDescriptor.options[j].value;
					optionControl.text = argumentDescriptor.options[j].displayValue;
					inputControl.add(optionControl);
				}
			}
			else if (argumentDescriptor.type == "select-multiple") {
				inputTagName = "select";
				inputControl = document.createElement(inputTagName);
				inputControl.multiple = true;
				for (var j = 0; j < argumentDescriptor.options.length; j++) {
					var optionControl = document.createElement("option");
					optionControl.value = argumentDescriptor.options[j].value;
					optionControl.text = argumentDescriptor.options[j].displayValue;
					inputControl.add(optionControl);
				}
				if (argumentDescriptor.selectMultipleQuotationSymbol !== undefined) {
					inputControl.dataset.selectMultipleQuotationSymbol = argumentDescriptor.selectMultipleQuotationSymbol;
				}
			}
			inputControl.name = argumentDescriptor.name;
			if (inputControl.dataset === undefined) {
				inputControl.dataset = {};
			}
			if (argumentDescriptor.nameValueSeparator !== undefined) {
				inputControl.dataset.nameValueSeparator = argumentDescriptor.nameValueSeparator;
			}
			if (argumentDescriptor.quotationSymbol !== undefined) {
				inputControl.dataset.quotationSymbol = argumentDescriptor.quotationSymbol;
			}
			if (argumentDescriptor.type != "boolean") {
				if (argumentDescriptor.required) {
					inputControl.required = true;
				}
				if (argumentDescriptor.dontIncludeName) {
					inputControl.dataset.dontIncludeName = argumentDescriptor.dontIncludeName;
				}
				if ((argumentDescriptor.defaultValue !== undefined) && (argumentDescriptor.type != "input-file") && (argumentDescriptor.type != "input-file-multiple")  && (argumentDescriptor.type != "select-multiple")) {
					inputControl.value = argumentDescriptor.defaultValue;
				}
	
				if (argumentDescriptor.type == "select-multiple") {
					for (var j = 0; j < inputControl.options.length; j++) {
						if (inputControl.options[j].value == argumentDescriptor.defaultValue) {
							inputControl.options[j].selected = true;
						}
					}
				}
	
			}
			else {
				if (argumentDescriptor.booleanTrueAsPresence) {
					inputControl.dataset.booleanTrueAsPresence = argumentDescriptor.booleanTrueAsPresence;
				}
				if (argumentDescriptor.booleanTrue !== undefined) {
					inputControl.dataset.booleanTrue = argumentDescriptor.booleanTrue;
				}
				if (argumentDescriptor.booleanFalse !== undefined) {
					inputControl.dataset.booleanFalse = argumentDescriptor.booleanFalse;
				}
				if (argumentDescriptor.defaultValue !== undefined) {
					inputControl.checked = argumentDescriptor.defaultValue;
				}
			}
			inputLabel.innerText = argumentDescriptor.displayName;
			if (inputControl.type == "checkbox") {
				inputLabel.insertBefore(inputControl, inputLabel.firstChild);
			}
			else {
				inputLabel.appendChild(inputControl);
			}
			sectionFieldset.appendChild(inputLabel);
			document.getElementById(MAIN_FORM_ID).appendChild(sectionFieldset);
		}
	}

	var genCmdLine_Button = document.getElementById(GENERATE_CMDLINE_BUTTON_ID);
	if (genCmdLine_Button.disabled) {
		genCmdLine_Button.disabled = false;
	}
}

function onGenerateCLI_Clicked(evt) {
	var mainForm = document.getElementById(MAIN_FORM_ID);
	if ((!mainForm.reportValidity) || (mainForm.reportValidity())) {
		var formAllControls = mainForm.elements ;
		//var executeArguments = [];
		var resultString = "";
		for (var i = 0; i < formAllControls.length; i++) {
			var inputControl = formAllControls[i];
			if (inputControl.tagName != "FIELDSET") {
				var doNotIncludeThisParameter = false;
				var nameValueSeparator = argumentsDescriptors.defaultArgumentNameValueSeparator;
				var quotationSymbol = argumentsDescriptors.defaultQuotationSymbol || "";
				var booleanFalse = argumentsDescriptors.defaultBooleanFalse;
				var booleanTrue = argumentsDescriptors.defaultBooleanTrue;
				var argumentName = inputControl.name;
				var argumentValue = "";
				if (inputControl.dataset.booleanTrue !== undefined) {
					booleanTrue = inputControl.dataset.booleanTrue;
				}
				if (inputControl.dataset.booleanFalse !== undefined) {
					booleanFalse = inputControl.dataset.booleanFalse;
				}
				if (booleanTrue === undefined) {
					booleanTrue = "true";
				}
				if (booleanFalse === undefined) {
					booleanFalse = "false";
				}
				var selectMultipleValueSeparator = argumentsDescriptors.defaultSelectMultipleValueSeparator;
				var selectMultipleQuotationSymbol = argumentsDescriptors.defaultSelectMultipleQuotationSymbol;
				if (inputControl.multiple) {
					if (inputControl.dataset.selectMultipleValueSeparator !== undefined) {
						selectMultipleValueSeparator = inputControl.dataset.multipleValueSeparator;
					}
					if (selectMultipleValueSeparator === undefined) {
						selectMultipleValueSeparator = "";
					}
					if (inputControl.dataset.selectMultipleQuotationSymbol !== undefined) {
						selectMultipleQuotationSymbol = inputControl.dataset.selectMultipleQuotationSymbol;
					}
					if (selectMultipleQuotationSymbol === undefined) {
						selectMultipleQuotationSymbol = "";
					}
				}
				if  (inputControl.type == "select-multiple") {
					var optionsKeyName = "selectedOptions";
					if (!inputControl[optionsKeyName]) {
						optionsKeyName = "options";
					}
					var selectedOptionsCount = 0;
					for (var j = 0; j < inputControl[optionsKeyName].length; j++) {
						if (inputControl[optionsKeyName][j].selected) {
							if (selectedOptionsCount == 0) {
								argumentValue = argumentValue + inputControl[optionsKeyName][j].value;
							}
							else {
								argumentValue = argumentValue + selectMultipleValueSeparator+inputControl[optionsKeyName][j].value;
							}
							selectedOptionsCount++;
						}
					}
					doNotIncludeThisParameter = (inputControl[optionsKeyName].length < 1);
				}
				else if ((inputControl.type == "file") && (inputControl.multiple) && (inputControl.files))  {
					for (var j = 0; j < inputControl.files.length; j++) {
						if (j == 0) {
							argumentValue = argumentValue + inputControl.files[j].name;
						}
						else {
							argumentValue = argumentValue + selectMultipleValueSeparator+inputControl.files[j].name;
						}
					}
					doNotIncludeThisParameter = (inputControl.files.length < 1);
				}
				else if (inputControl.type == "checkbox") {
					if (inputControl.dataset.booleanTrueAsPresence) {
						doNotIncludeThisParameter = !inputControl.checked;
					}
					else {
						argumentValue = inputControl.checked ? booleanTrue : booleanFalse;
						doNotIncludeThisParameter = false;
					}
				}
				else {
					if ((inputControl.value === undefined) || (inputControl.value === null) || (inputControl.value.length < 1)) {
						doNotIncludeThisParameter = true;
					}
					else {
						doNotIncludeThisParameter = false;
						argumentValue = inputControl.value;
					}
				}
				if (inputControl.dataset.nameValueSeparator !== undefined) {
					nameValueSeparator = inputControl.dataset.nameValueSeparator;
				}
				if (inputControl.dataset.quotationSymbol !== undefined) {
					quotationSymbol = inputControl.dataset.quotationSymbol;
				}
				if (quotationSymbol === undefined) {
					quotationSymbol = "";
				}
				if (!doNotIncludeThisParameter) {
					var currentArgumentStr = "";
					if (!inputControl.dataset.dontIncludeName) {
						currentArgumentStr  = argumentName;
					}
					if (!((inputControl.type == "checkbox") && (inputControl.dataset.booleanTrueAsPresence))) {
						if (!inputControl.dataset.dontIncludeName) {
							currentArgumentStr  = currentArgumentStr + nameValueSeparator;
						}
						currentArgumentStr = currentArgumentStr + quotationSymbol+argumentValue+quotationSymbol;
					}
					//executeArguments.push(currentArgumentStr);
					resultString = resultString + " " + currentArgumentStr;
				}
			}
		}
		//document.getElementById(CMDLINE_RESULT_ID).executeArguments = executeArguments;
		document.getElementById(CMDLINE_RESULT_ID).innerText = resultString;
		if ((window.ActiveXObject != null) || (window.require != null)) {
			var executableFileInput = document.getElementById(EXECUTABLE_FILE_INPUT_ID);
			if (executableFileInput.disabled) {
				executableFileInput.disabled = false;
				if (executableFileInput.addEventListener) {
					executableFileInput.addEventListener("change", onExecutableSelected, false);
				}
				else {
					executableFileInput.attachEvent("onchange", onExecutableSelected);
				}
			}
		}
		else {
			document.getElementById(WARNING_MSG_ID).innerText = "It seems that you are running this tool in browser. If you want to execute target app from here - you should run it via NW.js. You also may try to rename .html to .hta - it should work on older Windows versions.";
		}
	}
}

function onExecutableSelected() {
	if ((this.value !== null) && (this.value !== undefined) && (this.value.length > 0)) {
		var executeCmdLineButton = document.getElementById(EXECUTE_BUTTON_ID);
		if (executeCmdLineButton.disabled) {
			executeCmdLineButton.disabled = false;
			if (executeCmdLineButton.addEventListener) {
				executeCmdLineButton.addEventListener("click", onExecuteClicked, false);
			}
			else {
				executeCmdLineButton.attachEvent("onclick", onExecuteClicked);
			}
		}
	}
}

function shellOutput(error, stdout, stderr) {
	if ((stdout !== undefined) && (stdout !== null) && (stdout.length > 1)) {
		console.log(stdout);
	}
	if ((stderr !== undefined) && (stderr !== null) && (stderr.length > 1)) {
		console.error(stderr);
	}
	if (error) {
		console.error(error);
	}
}

function onExecuteClicked(evt) {
	var commandToRun = '"'+document.getElementById(EXECUTABLE_FILE_INPUT_ID).value+'"';
	var commandArguments = document.getElementById(CMDLINE_RESULT_ID).innerHTML;
	if (!confirm("WARNING: You are about to execute the command that you see bellow. Do not confirm execution if you don't understand what you're doing. Proceed at your own risk. \n \n "+commandToRun+" "+commandArguments)) {
		return;
	}
	if (window.ActiveXObject != null) {
		var shell = new ActiveXObject("Shell.Application");
		shell.ShellExecute(commandToRun, commandArguments, "","open","1");
		//Shell.ShellExecute(file, [ arguments ], [ directory ], [ operation ], [ show ]);
		shell = undefined;
	}
	else if (window.require != null) {
		var childProcessModule = require('child_process');
		try {
			//childProcessModule.execFile(commandToRun, [commandArguments], {}, shellOutput);
			childProcessModule.exec(commandToRun + commandArguments, {}, shellOutput);
		}
		catch(e) {
			alert(e);
		}
	}
}

if (window.addEventListener) {
	window.addEventListener("load", onPageLoad, false);
}
else {
	window.attachEvent("onload", onPageLoad);
}
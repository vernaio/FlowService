# FlowService (PIB Flow)
The FlowService is a workflow integration framework which integrates sPrintOne into a print production line. The service
takes print jobs from any source and prepares and imports them to sPrintOne. Further more, approved  
gang forms are being received from sPrintOne and will be converted to PDF, so that they can be easily processed by subsequenting applications such as prepress workflows etc.

## Flow Customization
In order to achieve a maximum level of integration, the FlowService provides several functions needed to be customized:

* **extractJobs()** - Extraction of jobs from any source.
* **processJob()** - Analyze Job Information and create BinderySignatures or an AssemblerTask.
* **processJobBinderySignatures()** - Post process generated BinderySignatures.
* **generateSheetId()** - Generate a sheetId for a sheet.
* **processSheet()** - Post processing of a generated sheet.
* **moveFiles()** - Move files from the storage folder to the sheet folder.
* **getVersion()** - Version details about this implementation.
* **getFlowConfig()** - Configuration for PIB Flow (optional).

All customizations have to be done in an external node library which will be automatically imported to FlowService at start up.
One reference implementation of such a customization is the "DefaultPdfIntegration" which is available on github: https://github.com/perfectpattern/DefaultPdfIntegration.

### Function: extractJobs()
The function _extractJobs()_ extract completes jobs from any source needed.

#### Input (Parameters):
The function _extractJobs()_ requires the following input parameters:

| Parameter | Description | Example |
| --------- |-------------| ------- |
| pathDataIn   | The path of the data input directory which is being scanned periodically for new jobs. | /data/in |

#### Output (JSON Object):
The function extractJobs() returns an array of complete jobs ready to be processed. Each job object SHALL include at
least an attribute 'jobId' as well as a files array, which contains the list of files belonging to that job. 
Additional fields are optional.

```json 'job array'
[
    {
        jobId: "job-1",
        files: ["/data/in/file-1-1.pdf", "/data/in/file-1-2.xml"],
        custom-field: "optional custom-field",
    },
    {
        jobId: "job-2",
        files: ["/data/in/file-2-1.pdf", "/data/in/file-2-2.xml"],
        custom-field: "optional custom-field",
    }
]
```

### Function: processJob()
The function _processJob_ analyzes the job information and creates BinderySignatures or an AssemblerTask.

#### Input (Parameters):
The function _processJob()_ requires the following input parameters:

| Parameter | Description | Example  |
| ------------- | ------------- | ----- |
| job   | One Job object of the job array extracted by _extractJobs()_ before. <br><br>**NOTE:** The attribute 'storageDir' defines the folder where all the input files are going to be stored after successful import. | *see below* |
| mediaList   | A json list of SPOV3 media entities provided by the PIB-Flows media retrieval. | *see below* |

```json 'job object'
{
    jobId: "job-1",
    files: ["/data/in/file-1-1.pdf", "/data/in/file-1-2.xml"],
    custom-field: "optional custom-field",
    storageDir: "/data/storage/job-1/"
}
```

```member json object in json 'mediaList'
{   
    "description:"",
    "id:"2.68545200106530644530971",
    "label:"Bilderdruck glänzend 170g 880x630 mm Breitbahn",
    "active":true,
    "dryingDuration":0,
    "grade":1,
    "grainDirection":"Y",
    "mediaType":"SHEET",
    "model":"Gloss",
    "producer":"RockPaperScissorsLizardSpock",
    "purpose":"Offset",
    "series":"Series-1",
    "surface":"glossy",
    "thickness":121,
    "weight":170,
    "categories": {
        "category":["Offset_glossy_170g"]},
    "format":{
        "height":630000,
        "width":880000}
}
```
#### Output (JSON Object):
The output is either a BinderySignature JSON or a AssemblerTask JSON as defined in the sPrintOne API.


### Function: processJobBinderySignatures()
Post process of generated BinderySignatures.

#### Input (Parameters):
The function _processJobBinderySignatures()_ requires the following input parameters:

| Parameter | Description | Example  |
| ------------- | ------------- | ----- |
| binderySignatures | List of BinderySignatures generated either from _processJob()_ before or from the Assembler. | |
| job | The job object. | |


#### Output (JSON Object):
The modified list of BinderySignatures.


### Function: generateSheetId()
The function _generateSheetId()_ generates a sheet's identifier based on the event XML.

#### Input (Parameters):
The function _generateSheetId()_ requires the following input parameters:

| Parameter | Description | Example  |
| ------------- | ------------- | ----- |
| event | The sheets Event XML ||

#### Output (String):
The output is a single string representing the sheet's identifier.

### Function: processSheet()
The function _processSheet_ is the last one called in the process. This method can be used to
integrate MIS Systems. [!Currently not called!]
 
#### Input (Parameters):
The function _processSheet()_ requires the following input parameters:
 
| Parameter | Description | Example  |
| ------------- | ------------- | ----- |
| sheetDirectory | The directory where all the sheet files are stored. ||
| outputFiles | JSON Object containing the files contained by the sheetDirectory ||
 
#### Output (none):
The function _processSheet()_ has no output.

### Function: moveFiles()
The function _moveFiles_ is called parallel to the function _processSheet_. This method can be used to
copy files to subsequenting applications hotfolder.
 
#### Input (Parameters):
The function _moveFiles()_ requires the following input parameters:
 
| Parameter | Description | Example  |
| ------------- | ------------- | ----- |
| sheetDirectory | The directory where all the sheet files are stored. ||
| jobInfos | JSON Object containing infos about the gangJobEvent ||
| storageFolder | path to the storage folder
 
#### Output:
The function _moveFiles()_ returns a error message on error containing a list of missing file ids.

### Function: getFlowConfig()
The optional function _getFlowConfig()_ offers the possibility to adapt PIB Flow to custom needs by providing a custom configuration to it. If this is not done, PIB Flow will runin default configuration.

#### Input:
none.

#### Output (JSON Object):
The function _getFlowConfig()_ has to return a configuration json in the following format:

```json 'flow config'
{
    flows : {
        binderySignatureUpload : {
            options : {
                uploadToWorkspace           : { enabled : true },
                createMultipleLayoutTasks   : { enabled : false }
            }
        },

        notificationListener : {
            enabled : false,
            options : {
                writeGangJobEventJSON       : { enabled : true },              
                writeGangJobEventXML        : { enabled : false },
                impose                      : { enabled : true },
                generateJdfJobTicket        : { enabled : false },
                generatePdfJobTicket        : { enabled : false }   
            }
        },

        layoutTaskProcessor : {
            enabled : false,
            options : {
                writeLayoutTaskJSON         : { enabled : true },
                writeLayoutTaskXML          : { enabled : false },
                writeReport                 : { 
                    enabled : true,
                    params : {
                        urlParams : ""
                    }
                },
                writeApogeeJDF              : { 
                    enabled : false,
                    params : {
                        urlParams : "?jdfIdStrategy=FIRST_ORDER_REF&jdfBinderySignatureIdStrategy=LABEL"
                    }
                }
            }
        }
    }
}
```
This example json is a maximum example containing all possible configurations and also the default configuration which is used if no custom configuration is provided. You can provide either the whole json or only parts of it, which are then merged with the default configuration. You have to respect the following rules. More infos about the configuration in section _Flow Configuration_.

##### Rules
* Provide either the whole json or parts of it.
* Within flow _binderySignatureUpload_, exactly one of the options _uploadToWorkspace_ and _createMultipleLayoutTasks_ has to be enabled.
* Exactly one of the flows _notificationListener_ and _layoutTaskProcessor_ has to be enabled.
* If you adress a option, you also have to provide the key _enabled_ whereas adressing key _params_ is optional.

## Flow Configuration
PIB Flow consists of three independent NodeRed flows, that each fullfill different tasks:

### Flow _binderySignatureUpload_
The purpose of this by an endpoint triggered flow is watching an input folder for print orders, which are being converted to bindery signatures and uploaded to sPrint One. In case the print order is a brochure, the sPrint One Assembler is used to disassemble the order into bindery signatures [always enabled].

#### Customizing functions
* **extractJobs()**
* **processJob()**
* **processJobBinderySignatures()**

#### Options
* **uploadToWorkspace:** Uploads the bindery signatures in a predefined sPrint One workspace [included, default: enabled]. 
* **createMultipleLayoutTasks:** Optional service to receive the bindery signatures. See https://github.com/perfectpattern/multiple-layouttasks-service [webservice, default: disabled].

Exactly on of these options has to be enabled.

### Flow _notificationListener_
This flow uses a websocket to listen to a predefined tenant for approved print jobs. Once a print job notification was received, the purpose of this flow is to download all information, PDF files, JSON files and JDF files needed into the out folder [dewfault: enabled].

#### Customizing functions
* **generateSheetId()** - Generate a sheetId for a sheet.
* **processSheet()** - Post processing of a generated sheet.
* **moveFiles()** - Move files from the storage folder to the sheet folder.

#### Options
* **writeGangJobEventJSON:** Write a JSON file containing the gangjob event [included, default: enabled].
* **writeGangJobEventXML:** Write a XML file containing the gangjob event [included, default: disabled].
* **impose:** Impose the print job and create a sheet pdf with default marks. See https://github.com/perfectpattern/ImpositionService.  This service alos provides a _PPF file_ for cutting, a _JPEG preview file_, a basic _XJDF file_ and an _Identification PDF file_ for the sheet [webservice, default: enabled].
* **generateJdfJobTicket:** This service creates a JDF jobticket accompanying the sheet PDF, that can be used to create a job in the following expositioning workflow. See https://github.com/perfectpattern/JdfJobTicketGenerator [webservice, default: disabled].
* **generatePdfJobTicket:** This service creates a PDF jobticket, see https://github.com/perfectpattern/PdfJobTicketGenerator [webservice, default: disabled].

Any of those options can be enabled.

### Flow _layoutTaskProcessor_
This flow is also triggered by an endpoint. Once it received a LayoutTask ID its purpose is to download the LayoutTask including PDF and JDF files and move them into the out folder [default: disabled].

#### Customizing functions
none.

#### Options
* **writeLayoutTaskJSON:** Download and write a JSON file containing the LayoutTask [included, default: enabled].
* **writeLayoutTaskXML:** Download and write a XML file containing the LayoutTask [included, default: disabled].
* **writeReport:** Download and write the LayoutTask Report file. Optional parameter _urlParams_ can be set which is added to the download URL [included, default: enabled].
* **writeApogeeJDF:** Download and write the LayoutTask Apogee JDF file. Optional parameter _urlParams_ can be set which is added to the download URL [included, default: disabled].

Any of those options can be enabled.

## Development Infos

```bash
# build dev image
docker build -t pib:v1 .

# start container for development
docker run -p 1881:1881 -v $PWD/lib/flow/src:/opt/flow/src pib:v1
```

| Parameter              | Description          |
| ---------              | -----------          |
| -p 1881:1881           | Port Forwarding von Container auf Host | 
| -v [PATH]:[PATH] | Verbindet das Entwicklungsverzeichnis mit src Ordner im Container |


## Folder Interface
TBD

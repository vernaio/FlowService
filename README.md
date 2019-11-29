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
| mediaList   | A json list of SPOV3 media entities provided by the PIB-Flows media retrieval . <br><br>**NOTE:** The attribute 'storageDir' defines the folder where all the input files are going to be stored after successful import. | *see below* |

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
integrate MIS Systems.
 
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

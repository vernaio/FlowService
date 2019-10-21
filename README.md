# FlowService (PIB Flow)


## Flow Customization
The FlowService is a workflow framework which is intended to be customized for each installation. A reference implementation of the customization is the "DefaultFlowLogic" which is available on github: https://github.com/perfectpattern/DefaultFlowLogic).

### Function: extractJobs()

#### Input (Parameters):
The function extractJobs() requires the following input parameters:
| Parameter    | Description | Example  |
| -------------|-------------| -----    |
| pathDataIn   | The path of the data input directory which is being scanned periodically for new jobs. | /data/in |

#### Output (JSON Object):
The function extractJobs() returns a list all complete jobs in the data in directory. Each job object SHALL include a attribute 'jobId' as well as a files array, which contains the list of files belonging to that job. Additional fields are optional.

```json 'job array'
[
    {
        jobId: "job-1",
        files: ["/data/in/file-1-1.pdf", "/data/in/file-1-2.xml"]
    },
    {
        jobId: "job-2",
        files: ["/data/in/file-2-1.pdf", "/data/in/file-2-2.xml"]
    }
]
```

### Function: processJob()
#### Input (Parameters):
The function processJob() requires the following input parameters:
| Parameter    | Description | Example  |
| -------------|-------------| -----    |
| job   | The path of the data input directory which is being scanned periodically for new jobs. | *see below* |

```json 'job object'
{
    jobId: "job-1",
    files: ["/data/in/file-1-1.pdf", "/data/in/file-1-2.xml"],
    storageDir: "/data/storage/job-1/"
}
```

#### Output (JSON Object):
TBD


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
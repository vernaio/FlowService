function retrieveFullSheetConfig(gangJobEvent) {
  let frontPage = {
    coloruUses: {
      colorUse: []
    },
    groups: { group: [] }
  }
  for (let color of gangJobEvent.gangJob.form.frontPage.colors.color) {
    frontPage.coloruUses.colorUse.push({ "color": color, intensity: 50 });
  }
  let backPage = {
    coloruUses: {
      colorUse: []
    },
    groups: { group: [] }
  }
  for (let color of gangJobEvent.gangJob.form.backPage.colors.color) {
    backPage.coloruUses.colorUse.push({ "color": color, intensity: 50 });
  }
  return { frontPage, backPage };
}

function generateFullSheetGangJobEvent(gangJobEvent, sheetId) {
  var pdfUrl = sheetId + "/" + sheetId + ".pdf";
  var fullSheetGangJobEvent = {
    "description": "",
    "id": sheetId,
    "label": sheetId,
    "approvalSetRef": "",
    "deviceRef": "phantom",
    "duration": gangJobEvent.duration,
    "latestEndTime": gangJobEvent.latestEndTime,
    "plannedDuration": gangJobEvent.plannedDuration,
    "startTime": gangJobEvent.startTime,
    "state": "PLANNED",
    "_type": "GangJobEvent",
    "gangJob": {
      "alternativeMediasDescription": "Bilderdruck glänzend 115g 1000x700 mm Breitbahn (7de3234a-ce94-4582-877f-7706267f1d36)",
      "factionRefs": "",
      "originalFactionRefs": "",
      "quantity": 2000,
      "referenceQuantity": 2000,
      "workStyle": "PERFECTING",
      "media": gangJobEvent.gangJob.media,
      "printingDeviceType": gangJobEvent.gangJob.printingDeviceType,
      "printingDevice": gangJobEvent.gangJob.printingDevice,
      "mountedMedia": gangJobEvent.gangJob.mountedMedia,
      "binderySignatures": {
        "binderySignature": [{
          "description": "Full Sheet",
          "id": sheetId,
          "label": sheetId,
          "active": true,
          "earliestStartTime": 0,
          "latestEndTime": gangJobEvent.latestEndTime,
          "mediaRefs": gangJobEvent.gangJob.media.id,
          "mustDemand": gangJobEvent.gangJob.quantity,
          "printingDeviceCategoryRefs": "",
          "printingDeviceRefs": gangJobEvent.gangJob.printingDevice.id,
          "trimFormat": {
            "height": gangJobEvent.gangJob.media.format.height,
            "width": gangJobEvent.gangJob.media.format.width
          },
          "printData": {
            "frontPage": {
              "jpgImage": "",
              "jpgRotation": "ZERO",
              "pdfPageNumber": 1,
              "pdfRotation": "ZERO",
              "pdfUrl": pdfUrl,
            },
            "backPage": {
              "jpgImage": "",
              "jpgRotation": "ZERO",
              "pdfPageNumber": 2,
              "pdfRotation": "ZERO",
              "pdfUrl": pdfUrl,
            }
          },
          "bleed": {
            "bottom": 2000,
            "left": 2000,
            "right": 2000,
            "top": 2000
          },
          "frontPage": retrieveFullSheetConfig(gangJobEvent).frontPage,
          "backPage": retrieveFullSheetConfig(gangJobEvent).backPage,
          "groups": {
            "group": []
          },
        }
        ]
      },
      "allowanceRules": {
        "allowanceRule": []
      },
      "freeRequirementRectangles": {
        "freeRequirementRectangle": []
      },
      "printAllowances": {
        "allowance": []
      },
      "form": {
        "groups": {
          "group": []
        },
        "frontPage": gangJobEvent.gangJob.form.frontPage,
        "backPage": gangJobEvent.gangJob.form.backPage,
        "placementZone": {
          "binderySignaturePlacements": {
            "binderySignaturePlacement": [
              {
                "description": "",
                "label": "",
                "flipped": false,
                "rotation": "ZERO",
                "rotationInPlane": "ZERO",
                "offset": {
                  "x": 0,
                  "y": 0
                },
                "format": {
                  "height": gangJobEvent.gangJob.media.format.height,
                  "width": gangJobEvent.gangJob.media.format.width,
                },
                "bleed": {
                  "bottom": 2000,
                  "left": 2000,
                  "right": 2000,
                  "top": 2000
                },
                "trim": {
                  "bottom": 2000,
                  "left": 2000,
                  "right": 2000,
                  "top": 2000
                },
                "selectedPrintData": {
                  "frontPage": {
                    "jpgImage": "",
                    "jpgRotation": "ZERO",
                    "pdfPageNumber": 1,
                    "pdfRotation": "ZERO",
                    "pdfUrl": pdfUrl
                  },
                  "backPage": {
                    "jpgImage": "",
                    "jpgRotation": "ZERO",
                    "pdfPageNumber": 2,
                    "pdfRotation": "ZERO",
                    "pdfUrl": pdfUrl
                  }
                },
                "binderySignatureRef": {
                  "id": sheetId
                }
              }
            ]
          },
          "reservedSpacePlacements": {
            "reservedSpacePlacement": []
          }
        }
      },
      "realizedRequirements": {
        "realizedRequirement": []
      },
      "groundsheet": {
        "_nil": true
      },
      "printDeviceStates": gangJobEvent.gangJob.printDeviceStates,
      "expenseStructure": {
        "total": {
          "cost": 302.071241,
          "duration": 1152571
        },
        "formProcessCost": {
          "cost": 62.4
        }
      },
      "efficiencies": {
        "areaEfficiency": 0.7549515170472317,
        "cutCount": 38,
        "demandEfficiency": 0.8611111111111112,
        "latestEndTime": 1575547200000,
        "mediaEfficiency": 0.6652095714732562
      }
    }
  };
  return fullSheetGangJobEvent;
}

/*
  createdOn is converted to a string like : 2019-01-19T00:04:27Z
*/
function apogeeFormatedDateFromUTC(utcMillisecondTimeStamp) {
  var createdOn = new Date(utcMillisecondTimeStamp);
  var YYYY = createdOn.getUTCFullYear();
  var MM = createdOn.getUTCMonth() + 1;
  if (MM < 10) {
    MM = "0" + MM;
  };
  var DD = createdOn.getUTCDate();
  if (DD < 10) {
    DD = "0" + DD;
  };
  var hh = createdOn.getUTCHours();
  if (hh < 10) {
    hh = "0" + hh;
  };
  var mm = createdOn.getUTCMinutes();
  if (mm < 10) {
    mm = "0" + mm;
  };
  var ss = createdOn.getUTCSeconds();
  if (ss < 10) {
    ss = "0" + ss;
  };
  return YYYY + "-" + MM + "-" + DD + "T" + hh + ":" + mm + ":" + ss + "Z";
}

function apogeeWorkstyleFromDtoWorkStyle(dtoWorkStyle) {
  return "Perfecting";
}

function microMeterToPoints(dimension) {
  return dimension*72/25400;
}

class JdfData {

  constructor(sheetId, gangJobEvent, sheetBleed) {
    this.gangJobEvent = gangJobEvent;
    this.injection = {};
    this.injection['pib.sheet.id'] = sheetId;
    this.injection['pib.sheet.amount'] = this.gangJobEvent.gangJob.quantity,
    this.injection['apogee.sheet.format.width'] = microMeterToPoints(this.gangJobEvent.gangJob.media.format.width);
    this.injection['apogee.sheet.format.height'] = microMeterToPoints(this.gangJobEvent.gangJob.media.format.height);
    this.injection['apogee.artwork.location'] = sheetId + "/" + sheetId + ".pdf";
    this.injection['apogee.sheet.pageCount'] = (this.gangJobEvent.gangJob.workStyle === "SIMPLEX") ? 1 : 2;
    this.injection['apogee.sheet.bleed'] = microMeterToPoints(sheetBleed);
    this.injection['pib.user'] = this.gangJobEvent.auditLog.createdBy.split("@")[0];
    this.injection['pib.sheet.createdOn'] = apogeeFormatedDateFromUTC(this.gangJobEvent.auditLog.createdOn);
    this.injection['pib.sheet.weight'] = this.gangJobEvent.gangJob.media.weight;
    this.injection['pib.sheet.thickness'] = this.gangJobEvent.gangJob.media.thickness;
    this.injection['apogee.job.workStyle'] = apogeeWorkstyleFromDtoWorkStyle(this.gangJobEvent.gangJob.workStyle);
    this.injection['apogee.sheet.absoluteFormat.width'] = this.injection['apogee.sheet.format.width']+2*this.injection['apogee.sheet.bleed'];
    this.injection['apogee.sheet.absoluteFormat.height'] = this.injection['apogee.sheet.format.height']+2*this.injection['apogee.sheet.bleed'];
    this.injection['pib.sheet.device.id'] = this.gangJobEvent.gangJob.printingDevice.id;
    this.injection['pib.sheet.device.label'] = this.gangJobEvent.gangJob.printingDevice.label;
    this.injection['apogee.media.grainDirection'] = this.gangJobEvent.gangJob.media.grainDirection+"Direction";
  }

  replace(lineArray) {
    var result = [];
    for (let line of lineArray) {
      var currentLine = line;
      for (let key of Object.keys(this.injection)) {
        let regex = new RegExp("INJECT[(]" + key + "[)]", "g");
        if (currentLine.match(regex)) {
          var value = this.injection[key];
          currentLine = currentLine.replace(regex, value);
        }
      }
      result.push(currentLine);
    }
    return result;
  }

  writeJdf(lineArray,jobTicketFileName) {
    var fs = require('fs');
    var file = fs.createWriteStream(jobTicketFileName);
    file.on('error', function (err) { "Apogee Jdf for sheet with id: " + sheetId + " could not be build. ErrorMessage: " + error });
    var newLineArray = this.replace(lineArray);
    newLineArray.forEach(function (line) { file.write(line + '\n'); });
    file.end();
  }
}

function writeApogeeJdf(
  apogeeJobTicketLocation,
  sheetId,
  gangJobEvent,
  sheetBleed,
  apogeeJdfModel) {
  /*
  var fs = require('fs');
  fs.readFile('apogee/model/ApogeeJdfV9_model.jdf',
    function (err, data) {
      if (err) throw "Apogee Jdf Model file could not be read - Error message: " + err;
      var jdfData = new JdfData(sheetId,gangJobEvent,sheetBleed);
      var lineArray = data.toString().split("\n");
      jdfData.writeJdf(lineArray,); 
    }
  );    
  */
  var jdfData = new JdfData(sheetId, gangJobEvent, sheetBleed);
  jdfData.writeJdf(apogeeJdfModel,apogeeJobTicketLocation);
}

module.exports = {
  "generateFullSheetGangJobEvent": generateFullSheetGangJobEvent,
  "writeApogeeJdf": writeApogeeJdf
}
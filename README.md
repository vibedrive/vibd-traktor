# vibd-traktor

Loosely organized scripts for working with Native Instruments Traktor 2.x files within the vibd ecosystem.

## find-collection-file

`var findCollectionFile = require('vibd-traktor/find-collection-file')`

#### `findCollectionFile(callback)`

Calls back with the path to your Traktor collection file.

## parse-collection

`var parseCollection = require('vibd-traktor/parse-collection')`

#### `parseCollection([,filepath], callback)`

Given the path to a collection file, calls back with a serialized json dictionary of `AUDIO_ID`. 
If no filepath is given, it will try to find it. 


## generate-collection

`var parseCollection = require('vibd-traktor/generate-collection')`

#### `generateCollection(collection, callback)`

Calls back with serialized nml collection file.

---

**example parse-collection input:**

```xml
  ...
  <ENTRY 
      MODIFIED_DATE="2018/1/28" 
      MODIFIED_TIME="10082" 
      AUDIO_ID="AI0AAAEREAAS...==" 
      TITLE="Rusha &amp; Blizza - Mood Boy">
    <LOCATION 
      DIR="/:Users/:kareniel/:Vibedrive/:Inbox/:" 
      FILE="Rusha &amp; Blizza - Mood Boy.mp3" 
      VOLUME="Macintosh HD" VOLUMEID="Macintosh HD">  
    </LOCATION>
    <MODIFICATION_INFO AUTHOR_TYPE="user"></MODIFICATION_INFO>
    <INFO 
      BITRATE="320000" 
      PLAYTIME="142" 
      PLAYTIME_FLOAT="141.061" 
      IMPORT_DATE="2018/1/28" 
      RELEASE_DATE="2017/1/1" 
      FLAGS="14" 
      FILESIZE="5512">  
    </INFO>
    <TEMPO BPM="60" BPM_QUALITY="100"></TEMPO>
    <LOUDNESS 
      PEAK_DB="-0.308064" 
      PERCEIVED_DB="0.0325165" 
      ANALYZED_DB="0.0325165"></LOUDNESS>
    <MUSICAL_KEY VALUE="19"></MUSICAL_KEY>
    <CUE_V2 
      NAME="AutoGrid" 
      DISPL_ORDER="0" 
      TYPE="4" 
      START="1034.23" 
      LEN="0" 
      REPEATS="-1" 
      HOTCUE="0">
    </CUE_V2>
  </ENTRY>
  ...
```

**example parse-collection output:**

```json
{
  "AI0AAAEREAAS...==": {
    "location": {
      "dir": "/:Users/:kareniel/:Vibedrive/:Inbox/:",
      "file": "Rusha & Blizza - Mood Boy.mp3",
      "volume": "Macintosh HD",
      "volumeid": "Macintosh HD"
    },
    "modificationInfo": {
      "authorType": "user"
    },
    "info": {
      "bitrate": "320000",
      "filesize": "5512",
      "flags": "14",
      "importDate": "2018/1/28",
      "playtime": "142",
      "playtimeFloat": "141.061",
      "releaseDate": "2017/1/1"
    },
    "tempo": {
      "bpm": "60",
      "bpmQuality": "100"
    },
    "loudness": {
      "analyzedDb": "0.0325165",
      "peakDb": "-0.308064",
      "perceivedDb": "0.0325165"
    },
    "musicalKey": {
      "value": "19"
    },
    "cueV2": {
      "displOrder": "0",
      "hotcue": "0",
      "len": "0",
      "name": "AutoGrid",
      "repeats": "-1",
      "start": "1034.23",
      "type": "4"
    },
    "attributes": {
      "modifiedDate": "2018/1/28",
      "modifiedTime": "10082",
      "title": "Rusha & Blizza - Mood Boy"
    }
  },
  "AI0AAAERDFAS...==": { ... },
  "AI0ATRSADIUO...==": { ... },
  ...
}
```

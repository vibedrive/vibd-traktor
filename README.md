# vibd-traktor

a [vibd](https://github.com/vibedrive/vibd) import plugin for importing collections from Traktor.

1. find all the files in your traktor collection that are not already in vibd
2. import the tracks in vibd with the traktor metadata
3. generate a new traktor collection file with the file paths pointing to your vibd folder

## usage

**terminal:**

```shell
$ vibd use vibd-traktor
$ vibd import --format=traktor
```

**node/browser:**

```js
var traktor = require('vibd-traktor')
var vibd = Library('vibd')

vibd.use(traktor)
vibd.import('traktor', null, function (err) {
  // done!
})
```

---

## scripts

#### find-collection-file

```js
var findCollectionFile = require('vibd-traktor/find-collection-file')

findCollectionFile(callback)
```

Calls back with the path to your Traktor collection file.


Given the path to a collection file, calls back with a serialized json dictionary of `AUDIO_ID`. 
If no filepath is given, it will try to find it. 


#### generate-collection

```js
var parseCollection = require('vibd-traktor/generate-collection')

generateCollection([,collection], function callback (err, entries) {
})
```
Takes an optional collection instance.
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

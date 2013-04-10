// @Birba Manuel

var theEntry;// undefined at the beginning, it'll affected 
var theEntries;
var theFileSystem;
var br = '<br />';
var hr = '<hr />';
var startP = '<p>';
var endP = '</p>';
var esp = ' ';
var contenuFichierText ;
var nomfichiertext = "Manueltest" + '.txt';
var cpt =0;

var _writer = undefined;

/**
 * @class Writer
 * @param String filename
 */

function Writer(filename) {
    this.fileName = fileName;
    this.writer = undefined;
}

/**
 * @function openFile
 * @param unknown fileSystemType
 * @param function callback this function will be called once the writer is ready
 * @return callback(Writer);
 */
Writer.prototype.openFile = function(fileSystemType, callback) {
    var me = this;
    
    /**
     * request for a handle on fileSystem
     */
    window.requestFileSystem(fileSystemType, 1024 * 1024, function(fs) {
        me.fileSystem = fs;
        
        /**
         * Once the file system handle is here, open  the file
         */
        fs.root.getFile(me.fileName, {
            create : true
        }, 
        function(theFile) {  
            /**
             * then create the writer
             */
            theFile.createWriter(function(writer) {
                me.writer = writer;
               /**
                * execute the callback function passed in params
                */
                callback(me);
            }, 
            function() {
                console.log('error in writer creation');
            });
        }, 
        function() {
            console.log('error in getFile');
        });
    }, 
    function() {
        console.log('error in requestFileSystem');
    });
}

/**
 * @function write
 * @param string content
 * 
 */
Writer.prototype.writeLn = function(content) {
    var me = this;
    me.writer.seek(me.writer.length);      
    me.writer.write(content+'\n');
}


function onSuccess(acceleration) {
    
    var element = document.getElementById('accelerometer');
    element.innerHTML =
    'Acceleration X: ' + acceleration.x + '<br />' +
    'Acceleration Y: ' + acceleration.y + '<br />' +
    'Acceleration Z: ' + acceleration.z + '<br />' +
    'Timestamp: '      + acceleration.timestamp + '\n';
    
    //alert("je suis dans onSuccess");
    
   /* for (i = 1; i <= 3; i ++)
    {
        
        alert ("valeurs x, y, z, et de timestamp de l' accéléromètre : " +esp +acceleration.x +esp +acceleration.y +esp +acceleration.z +esp +acceleration.timestamp +esp +" affichage numéro : "+i);
    }
    */
    
    
    var un = +acceleration.x +esp +acceleration.y +esp +acceleration.z +esp +acceleration.timestamp ;
    
    cpt = cpt + 1;
    //alert ("valeur cpt : " +cpt);
    
    
    if(cpt == 10) {
        stopWatch();
    }
    if(cpt == 9) {
        //alert ("c'est bon là non? le cpt = " +cpt);
        navigator.notification.vibrate();
    }
    /*var element = document.getElementById('accelerometer');
    element.innerHTML =
    'Acceleration X: ' + acceleration.x + '<br />' +
    'Acceleration Y: ' + acceleration.y + '<br />' +
    'Acceleration Z: ' + acceleration.z + '<br />' +
    'Timestamp: '      + acceleration.timestamp + '<br />';
    */
    
    
    contenuFichierText = un;
    /**
     * if the writer is not set, we initialize it, then write the content inside,
     */
    if (_writer === undefined) {
        _writer = new Writer(nomfichiertext);
        _writer.openFile(theFileSystem, function(writer){
            writer.writeLn(contenuFichierText);
        });
    } else {
        /**
         * else, write directly at the end of the file.
         */
        _writer.writeLn(contenuFichierText);
    }
}

function onError() {
    alert('une erreur');
}

function startWatch() {
    
    
    var options = { frequency: 100 };
    
    watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
    
}

function vibre (){
    
    navigator.notification.vibrate();
}

function stopWatch() {
    if (watchID) {
        navigator.accelerometer.clearWatch(watchID);
        watchID = null;
        cpt = 0;
    }
}


function storeName (){
    
    
    var myName = document.getElementById("name").value;
    nomfichiertext = myName;
    
    var result = document.getElementById("result");
    result.innerHTML = "le nom du fichier est " + nomfichiertext;
    return false;
}
/***********************************************************************************************/
/***********************************************************************************************/
/***********************************************************************************************/
/***********************************************************************************************/
/***********************************************************************************************/
/***********************************************************************************************/
/***********************************************************************************************/

function processDir(fileSystemType) {
  alert("processDir: " + fileSystemType);
  //Get a handle to the local file system (allocate 1 Mb for
  // storage)
  window.requestFileSystem(fileSystemType, 1024 * 1024, onGetFileSystemSuccess, onFileError);
    alert("nous avons pu allouer un fichier système de taille 1024 * 1024");
}

function onGetFileSystemSuccess(fs) {
  alert("onGetFileSystemSuccess: " + fs.name);
  //Save the file system object so we can access it later
  
  theFileSystem = fs;
  //Create a directory reader we'll use to list the files in the
  // directory
  var dr = fs.root.createReader();
  // Get a list of all the entries in the directory
  dr.readEntries(onDirReaderSuccess, onFileError);
}

function onDirReaderSuccess(dirEntries) {
  alert("onDirReaderSuccess (" + dirEntries.length + ")"); // nombre de fichiers dans le répertoire lu
  //Whack the previous dir entries
  $('#dirEntries').empty();
  //Save the entries to the global variable I created.
  theEntries = dirEntries;
  var i, fl, len;
  len = theEntries.length;
  if(len > 0) {
    fl = '<ul data-role="listview" id="dirEntryList">';
    for( i = 0; i < len; i++) {
      if(theEntries[i].isDirectory == true) {
        fl += '<li><a href="#" onclick="processEntry(' + i + ');">Directory: ' + theEntries[i].name + '</a></li>';
      } else {
        fl += '<li><a href="#" onclick="processEntry(' + i + ');">File: ' + theEntries[i].name + '</a></li>';
      }
    }
    fl += "</ul>";
    //Update the page content with our directory list
    $('#dirEntries').html(fl);
    //$('#dirEntryList').listview('refresh');
    $('#dirEntryList').trigger('create');
  } else {
    fl = "<p>No entries found</p>";
    $('#dirEntries').html(fl);
  }
  //Delete any previous fileWriter details we may have on the page
  $('#writeInfo').empty();
  //Display the directory entries page
  $.mobile.changePage("#dirList", "slide", false, true);
}

function processEntry(entryIndex) {
  //clear out the writeInfo div in case we go back to the list
  // page
  $('#writeInfo').empty();
  //Get access to the inidividual file entry
  theEntry = theEntries[entryIndex];
  //FileInfo variable
  var fi = "";
  fi += startP + '<b>Name</b>: ' + theEntry.name + endP;
  fi += startP + '<b>Full Path</b>: ' + theEntry.fullPath + endP;
  fi += startP + '<b>URI</b>: ' + theEntry.toURI() + endP;
  if(theEntry.isFile == true) {
    fi += startP + 'The entry is a file' + endP;
  } else {
    fi += startP + 'The entry is a directory' + endP;
  }
  //Update the page content with information about the file
  $('#fileInfo').html(fi);
  //Display the directory entries page
  $.mobile.changePage("#fileDetails", "slide", false, true);
  //Now go off and see if you can get meta data about the file
  theEntry.getMetadata(onGetMetadataSuccess, onFileError);
}

function onGetMetadataSuccess(metadata) {
  // alert("onGetMetadataSuccess");
  var md = '';
  for(aKey in metadata) {
    md += '<b>' + aKey + '</b>: ' + metadata[aKey] + br;
  }
  md += hr;
  //Update the page content with information about the file
  $('#fileMetadata').html(md);
}
/***********************************************************************************************/
/***********************************************************************************************/
/***********************************************************************************************/
/***********************************************************************************************/
/***********************************************************************************************/
/***********************************************************************************************/
/***********************************************************************************************/

function writeFile() {
  //Get a file name for the file
  // on déclare une variable appelé "theFileName" et on l'a définit comme étant le résultat de la fonction "createRandomString()".
    var theFileName = nomfichiertext;
  //var theFileName = createRandomString(8) + '.txt'; // créer un nom aléatoirement pour le fichier .txt
   // on affiche le contenu de la variable "theFileName".
  //alert("function writeFile ok, le nom du fichier créé sera : " + theFileName);
  // On créer un fichier appelé "" qui correspond au contenu de la variable theFileName
  
  theFileSystem.root.getFile(theFileName, {
    create : true
  }, onGetFileSuccess, onFileError);
}

function onGetFileSuccess(theFile) {
  //alert("function onGetFileSuccess ok: nous avons pu créer le fichier système : " + theFile.name);
  theFile.createWriter(onCreateWriterSuccess, onFileError);
}

function onCreateWriterSuccess(writer){
  //alert("onCreateWriterSuccess ok: nous avons pu créer un écrivain sur le fichier : " );
    var i;
    for (i= 1; i <= 5; i ++){// début écriture

  writer.onwritestart = function(e) {
console.log("Write start");
  };

  writer.onwriteend = function(e) {
    console.log("Write end");
  };

  writer.onwrite = function(e) {
console.log("Write completed");
  };

  writer.onerror = function(e) {
    console.log("Write error: " + e.toString() + br);
  };
  //writer.write("File created by Example 18-1: OK ");
   // var i;
    //for( i = 0; i < 9; i++) {
        //writer.write("Bonjour le mondeeeeeeeeeeee");
        //writer.write("non");
  //var string = " loool ";
  //writer.write("This is another line of text tu es où?");
  writer.seek(writer.length);      
  writer.write(" " + contenuFichierText);
  
  //writer.seek(writer.length);
  //writer.write("Première écriture ...");
  //writer.seek(writer.length);
  //writer.write("Deuxième écriture...");
  //writer.write(createRandomStory(25));
        //alert("J'ai fini d'écrire dans le fichier " + theFile.name);
    }
}
// fin de ligne de la fonction onCreateWriterSuccess

/***********************************************************************************************/
/***********************************************************************************************/
/***********************************************************************************************/
/***********************************************************************************************/
/***********************************************************************************************/
/***********************************************************************************************/
/***********************************************************************************************/

function removeFile() {
  theEntry.remove(onRemoveFileSuccess, onFileError);
}

function onRemoveFileSuccess(entry) {
  alert("Successfully removed " + entry.name);
}

function viewFile() {
  $('#viewFileName').html('<h1>' + theEntry.name + '</h1>');
  //Display the directory entries page
  $.mobile.changePage("#viewFile", "slide", false, true);
  theEntry.file(onFileReaderSuccess, onFileError);
}

function onFileReaderSuccess(file) {
  var reader = new FileReader();

  reader.onloadend = function(e) {
    $('#readInfo').append("Load end" + br);
    $('#fileContents').text(e.target.result);
  };

  reader.onloadstart = function(e) {
    $('#readInfo').append("Load start" + br);
  };

  reader.onloaderror = function(e) {
    $('#readInfo').append("Load error: " + e.target.error.code + br);
  };

  reader.readAsText(file);
}

function onFileError(e) {
  var msgText;
  switch(e.code) {
    case FileError.NOT_FOUND_ERR:
      msgText = "File not found error.";
      break;
    case FileError.SECURITY_ERR:
      msgText = "Security error.";
      break;
    case FileError.ABORT_ERR:
      msgText = "Abort error.";
      break;
    case FileError.NOT_READABLE_ERR:
      msgText = "Not readable error.";
      break;
    case FileError.ENCODING_ERR:
      msgText = "Encoding error.";
      break;
    case FileError.NO_MODIFICATION_ALLOWED_ERR:
      msgText = "No modification allowed.";
      break;
    case FileError.INVALID_STATE_ERR:
      msgText = "Invalid state.";
      break;
    case FileError.SYNTAX_ERR:
      msgText = "Syntax error.";
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msgText = "Invalid modification.";
      break;
    case FileError.QUOTA_EXCEEDED_ERR:
      msgText = "Quote exceeded.";
      break;
    case FileError.TYPE_MISMATCH_ERR:
      msgText = "Type mismatch.";
      break;
    case FileError.PATH_EXISTS_ERR:
      msgText = "Path exists error.";
      break;
    default:
      msgText = "Unknown error.";
  }
  //Now tell the user what happened
  navigator.notification.alert(msgText, null, "File Error");
}

function onFileTransferError(e) {
  alert("Error");
  var msgText;
  switch(e.code) {
    case FileTransferError.FILE_NOT_FOUND_ERR:
      msgText = "File not found.";
      break;
    case FileTransferError.INVALID_URL_ERR:
      msgText = "Invalid URL.";
      break;
    case FileTransferError.CONNECTION_ERR:
      msgText = "Connection error.";
      break;
    default:
      msgText = "Unknown error.";
  }
  //Now tell the user what happened
  navigator.notification.alert(msgText, null, "File Transfer Error");
}

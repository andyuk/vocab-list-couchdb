/* 
Author: Andrew Moist
*/

var db_name = "vocab-db";
var db;
var xhr;

$(document).ready(function() {
	
	db = new CouchDB(db_name, {"X-Couch-Full-Commit":"false"});
});

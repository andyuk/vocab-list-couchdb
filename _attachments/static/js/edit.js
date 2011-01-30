/* 
Author: Andrew Moist
*/

var db_name = "vocab-db";
var db;
var xhr;

$(document).ready(function() {
	
	db = new CouchDB(db_name, {"X-Couch-Full-Commit":"false"});
	
	$("#tableRow").template("tableRow");
	
	// load data
	$.getJSON('/'+db_name+'/_design/vocab-app/_view/recent-items?limit=20&descending=true', function(data) {
		
		var doc;
		for (var i = 0; i < data.rows.length; i++) {
			
			doc = data.rows[i].value;
			
			$.tmpl( "tableRow", doc).appendTo( "#vocab-list tbody" );
		}
	});
	
});

$('#main form').submit(function(event) {
	addVocabToDB();
	$('#main form input').val('');
	$('#word1').focus();
	return false;
});

$('#vocab-list .delete_button').live('click', function(event) {
	
	removeVocab($(event.target).parent().parent()[0]);
});

function addVocabToDB() {	
	var date = new Date();
	
	var doc = {
		'type': 'vocab',
		'word1': $('#word1').val(),
		'word2': $('#word2').val(),
		'score': 0,
		'tests': 0,
		'created_at': date.getTime(),
		'updated_at': date.getTime(),
	};
	
	var result = db.save(doc);
	
	if(! result.ok) {
		console.error('Failed to save document!');
		return;
	}
	
	doc._id = result.id;
	doc._rev == result.rev;
	
	addVocab(doc);
}


function addVocab(doc) {
	$.tmpl( "tableRow", doc).prependTo( "#vocab-list tbody" );
}

function removeVocab(element) {
	var result = db.deleteDoc({'_id': element.id, '_rev': $(element).attr('data-rev')});
	if (result.ok) {
		$(element).remove();
	} else {
		console.error('Failed to delete doc!');
	}
}

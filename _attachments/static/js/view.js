var docs;

$(document).ready(function() {
	
	$("#tableRow0").template("tableRow0");
	$("#tableRow1").template("tableRow1");
	$("#correctIcon").template("correctIcon");
	$("#falseIcon").template("falseIcon");
	$("#correction").template("correction");
	
	// load data
	$.getJSON('/'+db_name+'/_design/vocab-app/_view/worst-items?limit=20&descending=false', function(data) {
		
		docs = data.rows;
		
		var doc;
		for (var i = 0; i < docs.length; i++) {
			
			doc = docs[i].value;
			doc.index = i;
			
			// only 1 word 1 is displayed, pick this at random
			var index = Math.round(Math.random(0,1));
			$.tmpl( "tableRow" + index, doc).appendTo( "#vocab-list tbody" );
		}
	});
});

$('button.show_answer').live('click', function(event) {
	
	var tr = $(event.target).closest("tr");
	var input = tr.find('input[type=text]');

	correctAnswer(input, reveal = true);

	return false;
});

$('#main form').submit(function(event) {
	
	correctAnswers();
	
	return false;
});

function correctAnswers() {
	
	$('#main form input[type=text]').each(function(i, element) {
		
		correctAnswer(element, reveal = false);
	});	
}

function correctAnswer(element, reveal_answer) {
	
	var e = $(element);
	var tr = e.closest("tr");
	
	var word = e.val();
	if (reveal_answer || word.length > 0 ) {
		
		var correct_word = e.parent().attr('data-answer');
		
		var is_correct = word.toLowerCase().indexOf(correct_word.toLowerCase()) >= 0;
		
		if (is_correct) {
			
			var testResult = "correct";
			
		} else {
			
			var testResult = "false";
			$.tmpl("correction", {'answer': correct_word, 'word': word})
				.appendTo(e.parent().empty());
		}
		
		
		tr.addClass(testResult);
		$.tmpl( testResult+"Icon").appendTo(tr.find('td.action').empty());
		
		updateVocabRecord(tr.attr('data-index'), is_correct);
	}
}

function updateVocabRecord(index, isCorrect) {
	
	var doc = docs[index].value;
	doc.tests += 1;
	doc.score += (isCorrect ? 1 : -1);
	
	var date = new Date();
	doc.updated_at = date.getTime();
	
	var result = db.save(doc);
	
	if(! result.ok) {
		console.error('Failed to save document!');
		return;
	}
	
	doc._rev == result.rev;
}

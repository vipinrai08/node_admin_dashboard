$( document ).ready(function() {
	
	// SUBMIT FORM
    $("#commentForm").submit(function(event) {
		// Prevent the form from submitting via the browser.
		event.preventDefault();
		ajaxPost();
	});
    
    
    function ajaxPost(){
    	
    	// PREPARE FORM DATA
    	var formData = {
    		comment : $("#comment").val()
    	}
    	
    	// DO POST
    	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : window.location + "blogs/comment/save",
			data : JSON.stringify(formData),
			dataType : 'json',
			success : function(customer) {
				$("#postResultDiv").html("<p>" + 
					"Post Successfully! <br>" +
					"--->" + JSON.stringify(comment)+ "</p>"); 
			},
			error : function(e) {
				alert("Error!")
				console.log("ERROR: ", e);
			}
		});
    	
    	// Reset FormData after Posting
    	resetData();
 
    }
    
    function resetData(){
    	$("#comment").val("");
    }
})
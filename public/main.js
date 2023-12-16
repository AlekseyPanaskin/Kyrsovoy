$(document).ready(function() {
  prep_modal();
});

$(document).ready(function () {
                       
	$('#myModal .btn-primary').click(function () {
		if (document.getElementById("save_btn")?.classList.contains("canSave") ?? false) {
			
			var fileInput = document.getElementById('prod_File');   
			var filename = fileInput?.files[0]?.name;

			var employee_name = $('#employee').val();
			var employee_role = $('#employee_role').val();
			var report_date = $('#report_date').val();
			var prod_name = $('#prod_name').val();
			var prod_text = $('#prod_text').val();
			var prod_code = $('#prod_code').val();
			var prod_developer = $('#prod_developer').val();
			var prod_releaser = $('#prod_releaser').val();
			var prod_description = $('#prod_description').val();
			var prod_develop_date_start = $('#prod_develop_date_start').val();
			var prod_develop_date_end = $('#prod_develop_date_end').val();
			var prod_chr1 = $('input[name=exampleRadios]:checked').val()
			var prod_chr2 = $('input[name=exampleRadios2]:checked').val()
			var prod_file = filename;
		
			let data = {
				employee_name,
				employee_role,
				report_date,
				prod_name,
				prod_text,
				prod_code,
				prod_developer,
				prod_releaser,
				prod_description,
				prod_develop_date_start,
				prod_develop_date_end,
				prod_chr1,
				prod_chr2,
				prod_file
			}

			console.log(data);

			$.ajax({
				type: "POST",
				url: "/add",
				data: data,
				success: function (response) {
					console.log(response);
				}
			});

			if (fileInput.files.length > 0) {
				let formData = new FormData();
				formData.append('uploadFile', fileInput.files[0]);
				$.ajax({
					url:'/upload',
					type: 'POST',
					contentType: false,
					processData: false,
					cache: false,
					data: formData,
					success: function(res){
						console.log(res);
					},
					error: function(){
						console.error('Error: In sending the request!');
					}
				})
			}

			location.reload();
		}
		});
  });

function prep_modal()
{
  $(".modal").each(function() {

	var pages = $(this).find('.modal-split');

	if (pages.length != 0)
	{
		pages.hide();
		pages.eq(0).show();

		var b_button = document.createElement("button");
		b_button.setAttribute("type","button");
		b_button.setAttribute("class","btn btn-primary");
		b_button.setAttribute("style","display: none;");
		b_button.innerHTML = "←";

		var n_button = document.createElement("button");
		n_button.setAttribute("type","button");
		n_button.setAttribute("class","btn btn-primary");
		n_button.innerHTML = "→";
		n_button.id = "save_btn";

		$(this).find('.modal-footer').append(b_button).append(n_button);


		var page_track = 0;

		$(n_button).click(function() {
		
			this.blur();

			if(page_track == 0)
			{
				$(b_button).show();
			}

			if(page_track == pages.length-2)
			{		
				$(n_button).text("Сохранить");
			}

			if(page_track == pages.length-1)
			{
				n_button.classList.add("canSave");
			}
			else if (n_button.classList.contains("canSave")) {
				n_button.classList.remove("canSave");
			}

			if(page_track < pages.length-1)
			{
				page_track++;

				pages.hide();
				pages.eq(page_track).show();
			}
		});

		$(b_button).click(function() {

			if(page_track == 1)
			{
				$(b_button).hide();
			}

			if(page_track == pages.length-1)
			{
				$(n_button).text("→");
			}

			if(page_track > 0)
			{
				page_track--;

				pages.hide();
				pages.eq(page_track).show();
			}
		});
	}
  });
}

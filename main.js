
$(document).ready(function() {
  prep_modal();
});

$(document).ready(function () {
                       
	$('#myModal .btn-primary').click(function () {
	  // Получаем значения полей ввода
	  var employee = $('#employee').val();
	  var employee_role = $('#employee_role').val();
	  var report_date = $('#report_date').val();
	  var prod_name = $('#prod_name').val();
	  var prod_text = $('#prod_text').val();
	  var prod_code = $('#prod_code').val();
	  var prod_developer = $('#prod_developer').val();
	  var prod_releaser = $('#prod_releaser').val();
  
	  // Выводим значения в консоль для проверки
	  console.log('ФИО сотрудника: ' + employee);
	  console.log('Должность: ' + employee_role);
	  console.log('Дата: ' + report_date);
	  console.log('Наименование продукции: ' + prod_name);
	  console.log('Условное обозначение продукции: ' + prod_text);
	  console.log('Код продукции: ' + prod_code);
	  console.log('Предприятие разработчик: ' + prod_developer);
	  console.log('Предприятие изготовитель: ' + prod_releaser);
  
	  // Очищаем поля формы
	  $('#employee').val('');
	  $('#employee_role').val('');
	  $('#report_date').val('');
	  $('#prod_name').val('');
	  $('#prod_text').val('');
	  $('#prod_code').val('');
	  $('#prod_developer').val('');
	  $('#prod_releaser').val('');
  
	  // Отправляем данные на сервер
	  $.ajax({
		type: "POST",
		url: "save_data.php",
		data: {
		  employee: employee,
		  employee_role: employee_role,
		  report_date: report_date,
		  prod_name: prod_name,
		  prod_text: prod_text,
		  prod_code: prod_code,
		  prod_developer: prod_developer,
		  prod_releaser: prod_releaser
		},
		success: function (response) {
		  console.log(response);
		}
	  });
  
	});
  });

function prep_modal()
{
  $(".modal").each(function() {

  var element = this;
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
          $(element).find("form").submit();
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

$(document).ready(function() {
  prep_modal();

  addRefenceData();

  let btn = document.getElementById("btn_add_reference");
  btn.addEventListener("click", e => {
	addRefenceData();
  })
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
			var consignment = $('#consignment').val();
			var selection = $('#factCount').val();
		
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
				prod_file,
				consignment,
				selection
			}
			
			console.log(data);

			let partId;

			$.ajax({
				type: "POST",
				url: "/add",
				data: data,
				async: false,
				success: function (response) {
					console.log(response);
					partId = response['id'];
				}
			});

					
			let referenceDiv = document.getElementById("referenceData");

			let columnsCount = referenceDiv.querySelectorAll(".reference-group").length;
			let rowsCount = document.getElementById("factCount").value;

			let referenceData = {
				partId,
				data: []
			};

			for (let i = 0; i < columnsCount; i++) {
				let name = document.getElementsByName(`reference[${i}].name`)[0]?.value;
				let value = document.getElementsByName(`reference[${i}].value`)[0]?.value;
				let threshold = document.getElementsByName(`reference[${i}].threshold`)[0]?.value;

				referenceData['data'].push({
					name,
					value,
					threshold
				})
			}

			$.ajax({
				type: "POST",
				url: "/addRef",
				data: referenceData,
				success: function (response) {
					console.log(response);
				}
			});



			let factData = {
				partId,
				data: []
			};

			for (let i = 0; i < rowsCount; i++) {
				let row = [];
				for (let j = 0; j < columnsCount; j++) {
					let cellValue = document.getElementsByName(`fact[${i}][${j}]`)[0]?.value;

					row.push(cellValue);
				}
				factData['data'].push(row);
			}

			$.ajax({
				type: "POST",
				url: "/addFact",
				data: factData,
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

				if (pages.eq(page_track)[0].id == 'factData') {
					setupFactData();
				}
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

function setupFactData() {
	let factDataDiv = document.getElementById("factData");

	let factTable = document.getElementById("factTable");

	if (factTable) {
		factTable.remove();
	}

	let referenceData = document.getElementById("referenceData");

	let divGroupCount = referenceData.querySelectorAll(".reference-group").length;

	let headers = [];

	for (let i = 0; i < divGroupCount; i++) {
		let name = document.getElementsByName(`reference[${i}].name`)[0].value;
		let value = document.getElementsByName(`reference[${i}].value`)[0].value;
		let threshold = document.getElementsByName(`reference[${i}].threshold`)[0].value;
		
		headers.push({
			name,
			value,
			threshold
		});
	}

	let factCount = document.getElementById("factCount").value;

	factTable = createFactTable(headers, factCount);

	factDataDiv.appendChild(factTable);
}

function createFactTable(headers, factCount) {
	let table = document.createElement("table");
	table.id = "factTable";
	table.classList.add("table");

	let thead = createThead();
	table.appendChild(thead);

	let tbody = createTbody();
	table.appendChild(tbody);

	return table;


	function createThead() {
		let thead = document.createElement("thead");

		let trHead = document.createElement("tr");

		let thList = [createTh("№ Экземпляра")]

		for (let i = 0; i < headers.length; i++) {
			const header = headers[i];
			
			let th = createTh(header["name"]);

			thList.push(th);
		}

		trHead.append(...thList);

		thead.appendChild(trHead);

		return thead;
	}

	function createTbody() {
		let tbody = document.createElement("tbody");

		let referenceValues = headers.map(h => h["value"]);
		let referenceThresholds = headers.map(h => h["threshold"]);

		let referenceValuesRow = createRow("Эталонные показатели", referenceValues);
		let referenceThresholdsRow = createRow("Допуски", referenceThresholds);

		let factTrs = []

		for (let row = 0; row < factCount; row++) {
			let tr = createRowInput(row + 1, row, headers.length);

			factTrs.push(tr);
		}

		tbody.appendChild(referenceValuesRow);
		tbody.appendChild(referenceThresholdsRow);
		tbody.append(...factTrs);

		return tbody;


		function createRow(thValue, tdValues) {
			let tr = document.createElement("tr");
			
			let th = createTh(thValue);

			tr.appendChild(th);
			
			if (tdValues && tdValues.length > 0) {
				for (const tdValue of tdValues) {
					let td = createTd(tdValue);
					tr.appendChild(td);
				}
			}

			return tr;
		}

		function createRowInput(thValue, rowNumber, colsCount) {
			let tr = document.createElement("tr");
			
			let th = createTh(thValue);

			tr.appendChild(th);
			
			for (let i = 0; i < colsCount; i++) {
				let td = createTd();

				let input = document.createElement("input");
				input.classList.add("form-control");
				input.type = "number";
				input.step = "0.001";
				input.name = `fact[${rowNumber}][${i}]`

				td.appendChild(input);
				tr.appendChild(td);
			}

			return tr;
		}
	}
	
		
	function createTh(value) {
		return createTableElement("th", value);
	}
	
	function createTd(value) {
		return createTableElement("td", value);
	}

	function createTableElement(name, value) {
		let elem = document.createElement(name);
		if (value) {
			elem.innerText = value;
		}

		return elem;
	}
}

function addRefenceData() {
	let referenceData = document.getElementById("referenceData");

	let divGroupCount = referenceData.querySelectorAll(".reference-group")?.length ?? 0;

	let divGroup = createReferenceInputsRow(divGroupCount);

	referenceData.insertBefore(divGroup, referenceData.lastElementChild);
}

function createReferenceInputsRow(num) {
	let divGroup = document.createElement("div");
	divGroup.classList.add("input-group");
	divGroup.classList.add("reference-group");

	let span = document.createElement("span");
	span.classList.add("input-group-text");
	span.innerText = "Показатель – Значение - допуск";

	let inputName = createInput(`reference[${num}].name`);
	let inputValue = createInput(`reference[${num}].value`);
	let inputThreshold = createInput(`reference[${num}].threshold`);

	divGroup.appendChild(span);
	divGroup.append(...[inputName, inputValue, inputThreshold]);

	return divGroup;

	
	function createInput(name) {
		let input = document.createElement("input");
		input.name = name;
		input.classList.add("form-control");
		input.type = "text";

		return input;
	}
}

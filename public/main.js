let factValues = [];
let isEdit = false;

$(document).ready(function() {
  prep_modal();

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
		
			if (part && part['prod_file'] && !prod_file) {
				prod_file = part['prod_file'];
			}

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

			if (isEdit) {
				partId = part['id'];
				$.ajax({
					type: "PUT",
					url: `/edit/${partId}`,
					data: data,
					async: false,
					success: function (response) {
						console.log(response);
					}
				});
			}
			else {
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
			}

					
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

				if (isEdit) {
					let id = document.getElementsByName(`reference[${i}].id`)[0]?.value;
					referenceData['data'].push({
						id,
						name,
						value,
						threshold
					})
				}
				else {
					referenceData['data'].push({
						name,
						value,
						threshold
					})
				}

			}

			if (isEdit) {
				$.ajax({
					type: "PUT",
					url: "/editRef",
					data: referenceData,
					async: false,
					success: function (response) {
						console.log(response);
					}
				});
			}
			else {
				$.ajax({
					type: "POST",
					url: "/addRef",
					data: referenceData,
					async: false,
					success: function (response) {
						console.log(response);
					}
				});
			}
			



			let factData = {
				partId,
				data: []
			};

			for (let i = 0; i < rowsCount; i++) {
				let row = {
					values: [],
					isDefect: false,
					comment: null
				};
				for (let j = 0; j < columnsCount; j++) {
					let cellValue = document.getElementsByName(`fact[${i}][${j}]`)[0]?.value;

					row.values.push(cellValue);
				}

				let isDefect = document.getElementsByName(`isDefect[${i}]`)[0]?.checked;
				let comment = document.getElementsByName(`comment[${i}]`)[0]?.value;

				row.isDefect = isDefect;
				row.comment = comment;

				if (isEdit) {
					row.id = document.getElementsByName(`id[${i}]`)[0]?.value;
				}
				
				factData.data.push(row);
			}

			if (isEdit) {
				$.ajax({
					type: "PUT",
					url: "/editFact",
					data: factData,
					async: false,
					success: function (response) {
						console.log(response);
					}
				});
			}
			else {
				$.ajax({
					type: "POST",
					url: "/addFact",
					data: factData,
					async: false,
					success: function (response) {
						console.log(response);
					}
				});
			}
			


			if (fileInput.files.length > 0) {
				let formData = new FormData();
				formData.append('uploadFile', fileInput.files[0]);
				$.ajax({
					url:'/upload',
					type: 'POST',
					contentType: false,
					processData: false,
					cache: false,
					async: false,
					data: formData,
					success: function(res){
						console.log(res);
					},
					error: function(){
						console.error('Error: In sending the request!');
					}
				})
			}
			
			window.location.replace(location.href);
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
			threshold,
			type: 'number'
		});
	}

	headers.push({
		name: 'Брак',
		value: null,
		threshold: null,
		type: 'checkbox',
		inputName: 'isDefect'
	});
	
	headers.push({
		name: 'Комментарий',
		value: null,
		threshold: null,
		type: 'text',
		inputName: 'comment'
	});

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

		let columnTypes = headers.map(h => h["type"]);
		let inputNames = headers.map(h => h["inputName"]);

		for (let row = 0; row < factCount; row++) {
			let factData = {
				values: factValues[row],
				types: columnTypes,
				inputNames
			}

			let tr = createRowInput(row + 1, row, headers.length, factData);

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

		function createRowInput(thValue, rowNumber, colsCount, factData) {
			let tr = document.createElement("tr");
			
			let th = createTh(thValue);

			tr.appendChild(th);
			
			for (let i = 0; i < colsCount; i++) {
				let td = createTd();

				let value = null;
				if (factData['values'] && factData['values'].length - 1 > i) {
					value = factData['values'][i];
				}

				let name = factData['inputNames'][i]
				 ? `${factData['inputNames'][i]}[${rowNumber}]`
				 : `fact[${rowNumber}][${i}]`;
				let input = createInput(name, value, factData['types'][i]);
				

				td.appendChild(input);
				tr.appendChild(td);
			}
			
			if (factData['values'].length > colsCount) {
				let input = createInput(`id[${rowNumber}]`, factData['values'].at(-1), "hidden");
				
				tr.appendChild(input);
			}

			return tr;
		}
		
		function createInput(name, value, type) {
			let input = document.createElement("input");
		
			input.classList.add("form-control");
			input.name = name;

			input.type = type;

			if (value && value != null) {
				input.value = value;
			}

			switch (type) {
				case "number":
					input.step = "0.001";
					break;

				case "checkbox":
					input.checked = value;
					break;
			}

			return input;
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

function addRefenceData(ref) {
	let referenceData = document.getElementById("referenceData");

	let divGroupCount = referenceData.querySelectorAll(".reference-group")?.length ?? 0;

	let divGroup = createReferenceInputsRow(divGroupCount, ref);

	referenceData.insertBefore(divGroup, referenceData.lastElementChild);
}

function createReferenceInputsRow(num, ref) {
	let divGroup = document.createElement("div");
	divGroup.classList.add("input-group");
	divGroup.classList.add("reference-group");

	let span = document.createElement("span");
	span.classList.add("input-group-text");
	span.innerText = "Показатель – Значение - допуск";

	let inputName = createInput(`reference[${num}].name`, ref?.name);
	let inputValue = createInput(`reference[${num}].value`, ref?.value);
	let inputThreshold = createInput(`reference[${num}].threshold`, ref?.threshold);

	divGroup.appendChild(span);
	divGroup.append(...[inputName, inputValue, inputThreshold]);

	if (ref) {
		let inputRefId = createInput(`reference[${num}].id`, ref.id);
		inputRefId.type = "hidden";
		divGroup.appendChild(inputRefId);
	}

	return divGroup;

	
	function createInput(name, value) {
		let input = document.createElement("input");
		input.name = name;
		input.classList.add("form-control");
		input.type = "text";

		if (value) {
			input.value = value;
		}

		return input;
	}
}

function fillValues() {
	isEdit = true;
	let btnAddRef = document.getElementById("btn_add_reference");
	btnAddRef.style = "display: none";

	let factCount = document.getElementById("factCount");
	let consignment = document.getElementById("consignment");

	factCount.setAttribute("readonly", "");
	consignment.setAttribute("readonly", "");

	factValues = Array.from(facts.map(f => [...f.values, f.is_defect, f.comment, f.id]));
	
	$('#employee').val(part['employee_name']);
	$('#employee_role').val(part['employee_role']);
	$('#report_date').val(new Date(part['report_date']).toISOString().slice(0, 10));
	$('#prod_name').val(part['prod_name']);
	$('#prod_text').val(part['prod_text']);
	$('#prod_code').val(part['prod_code']);
	$('#prod_developer').val(part['prod_developer']);
	$('#prod_releaser').val(part['prod_releaser']);
	$('#prod_description').val(part['prod_description']);
	$('#prod_develop_date_start').val(new Date(part['prod_develop_date_start']).toISOString().slice(0, 10));
	$('#prod_develop_date_end').val(new Date(part['prod_develop_date_end']).toISOString().slice(0, 10));
	$(`input[name=exampleRadios][value="${part['prod_chr1']}"]`).prop('checked', true);
	$(`input[name=exampleRadios2][value="${part['prod_chr2']}"]`).prop('checked', true);
	$('#consignment').val(part['consignment']);
	$('#factCount').val(part['selection']);

	for (let ref of refs) {
		addRefenceData(ref);
	}
}
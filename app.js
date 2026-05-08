let status = "All"
let identififier = ""
let latestData
document.getElementById("input").addEventListener("submit", e => {
	e.preventDefault()

	let inputs = Array.from(document.querySelectorAll("#input input")).find(inp => {
		return inp.value.trim() == ""
	})

	let fileds = Array.from(document.querySelectorAll("#input input")).map(inp => inp.value.trim())

	let datas = JSON.parse(localStorage.getItem("record")) || []

	let isDuplicate = datas.find(data => data.matric == fileds[1])

	if (isDuplicate) {
		alert("Matric already exists")
		return
	}

	fileds[2] = parseFloat(fileds[2])
	fileds[3] = parseFloat(fileds[3])
	fileds[4] = parseFloat(fileds[4])
	fileds[5] = parseFloat(fileds[5])



	let average = (fileds[2] + fileds[3] + fileds[4] + fileds[5]) / 4

	let grade = ""
	if (average >= 80) grade = "A"
	else if (average >= 70) grade = "B"
	else if (average >= 60) grade = "C"
	else if (average >= 50) grade = "D"
	else grade = "F"

	let isPass = average >= 50 ? "Pass" : "Fail"

	fileds.push(average)
	fileds.push(grade)
	fileds.push(isPass)

	addData(fileds)
})

let addData = (datas) => {
	let record = JSON.parse(localStorage.getItem("record")) || []

	let dt = {
		name: datas[0],
		matric: datas[1],
		assignment: datas[2],
		labTest: datas[3],
		project: datas[4],
		finalExam: datas[5],
		average: datas[6],
		grade: datas[7],
		status: datas[8],
	}


	record.push(dt)

	localStorage.setItem("record", JSON.stringify(record))
	renderTable()
}

let show = (e) => {
	let element = e.target

	let data = JSON.parse(localStorage.getItem("record")).find(row => row.matric == element.dataset.matric)
	// console.log(data);

	document.getElementById("dtlName").textContent = data.name
	document.getElementById("dtlMatric").textContent = data.matric
	document.getElementById("dtlAss").textContent = data.assignment
	document.getElementById("dtlLab").textContent = data.labTest
	document.getElementById("dtlProject").textContent = data.project
	document.getElementById("dtlGarade").textContent = data.grade
	document.getElementById("dtlStatus").textContent = data.status

}
let deleteData = (e) => {
	let element = e.target
	let datas = JSON.parse(localStorage.getItem("record")).filter(d => d.matric != element.dataset.matric)
	// console.log(datas);

	localStorage.setItem("record", JSON.stringify(datas))
	renderTable()
}
document.getElementById("deleteData").addEventListener("click", () => {
	if (!confirm("Are you sure?")) return
	localStorage.removeItem("record")
	renderTable()
})
document.getElementById("sortData").addEventListener("click", () => {

	let datas = JSON.parse(localStorage.getItem("record")) || []
	datas = datas.sort((a, b) => b.average - a.average)
	// console.log(datas);
	localStorage.setItem("record", JSON.stringify(datas))

	renderTable()
})
document.getElementById("filterStatus").addEventListener("change", e => {
	status = e.target.value
	console.log(status);
	renderTable()
})
document.getElementById("cari").addEventListener("input", e => {
	identififier = e.target.value.trim()
	// console.log(identififier);
	renderTable()
})
let id
let dataOld
document.getElementById("reset").addEventListener("click" , e => {
	document.getElementById("updateStdName").value = dataOld.name
	document.getElementById("updateStdMatric").value = dataOld.matric
	document.getElementById("updateStdAss").value = dataOld.assignment
	document.getElementById("updateStdlab").value = dataOld.labTest
	document.getElementById("updateStdProject").value = dataOld.project
	document.getElementById("updateStdfinal").value = dataOld.finalExam
})
document.getElementById("update").addEventListener("submit", e => {
	e.preventDefault()
	let datas = JSON.parse(localStorage.getItem("record"))

	dt = datas.find(data => data.matric == id)
	

	let assignment = parseFloat(document.getElementById("updateStdAss").value.trim())
	let labTest = parseFloat(document.getElementById("updateStdlab").value.trim())
	let project = parseFloat(document.getElementById("updateStdProject").value.trim())
	let finalExam = parseFloat(document.getElementById("updateStdfinal").value.trim())

	dt.name = document.getElementById("updateStdName").value.trim()
	dt.matric = document.getElementById("updateStdMatric").value.trim()
	dt.assignment = assignment
	dt.labTest = labTest
	dt.project = project
	dt.finalExam = finalExam

	let average = (finalExam + labTest + project + assignment) / 4

	let grade = ""
	if (average >= 80) grade = "A"
	else if (average >= 70) grade = "B"
	else if (average >= 60) grade = "C"
	else if (average >= 50) grade = "D"
	else grade = "F"

	let isPass = average >= 50 ? "Pass" : "Fail"

	dt.average = average
	dt.grade = grade
	dt.status = isPass

	localStorage.setItem("record", JSON.stringify(datas))
	document.getElementById("update").classList.add("hidden")
	renderTable()
})

let edit = e => {
	let datas = JSON.parse(localStorage.getItem("record"))
	let matric = e.target.dataset.matric

	datas = datas.find(data => data.matric == matric)
	dataOld = datas

	// console.log(datas);
	id = datas.matric
	document.getElementById("updateStdName").value = datas.name
	document.getElementById("updateStdMatric").value = datas.matric
	document.getElementById("updateStdAss").value = datas.assignment
	document.getElementById("updateStdlab").value = datas.labTest
	document.getElementById("updateStdProject").value = datas.project
	document.getElementById("updateStdfinal").value = datas.finalExam

	document.getElementById("update").classList.remove("hidden")
}

let renderTable = () => {
	let tbody = document.querySelector("tbody")
	let datas = JSON.parse(localStorage.getItem("record")) || []

	if (datas.length > 0) {
		tbody.innerHTML = ""
		let countPass = 0
		let countFail = 0

		document.getElementById("totalStd").textContent = datas.length

		let arrayAvg = datas.map(data => parseFloat(data.average))

		document.getElementById("classAvg").textContent = ((arrayAvg.reduce((sum, curr) => sum + curr)) / arrayAvg.length).toFixed(2)
		document.getElementById("heightAvg").textContent = Math.max(...arrayAvg)
		document.getElementById("lowestAvg").textContent = Math.min(...arrayAvg)

		if (status == "All") {
			datas = JSON.parse(localStorage.getItem("record"))
		}
		else if (status == "Pass") {
			datas = datas.filter(data => data.status == "Pass")
		}
		else if (status == "Fail") {
			datas = datas.filter(data => data.status == "Fail")
		}
		let w
		if (identififier != "") {
			datas = datas.filter(data =>
				data.name.toLowerCase().includes(identififier.toLowerCase())
				||
				data.matric.toLowerCase().includes(identififier.toLowerCase())
			)
		}

		latestData = datas 
		datas.forEach((data, index) => {
			console.log(data);

			if (data.status == "Pass") countPass++
			else countFail++

			document.getElementById("totalPass").textContent = countPass
			document.getElementById("totalFail").textContent = countFail

			tbody.innerHTML += `
				<tr>
					<td>${index + 1}</td>
					<td>${data.name}</td>
					<td>${data.matric}</td>
					<td>${data.average}</td>
					<td>${data.grade}</td>
					<td>${data.status}</td>
					<td>
						<button data-matric="${data.matric}" class="blue" id="show">Show</button>
						<button data-matric="${data.matric}" class="gray" id="updateData">Edit</button>
						<button data-matric="${data.matric}" class="red" id="delete">Delete</button>
					</td>
				</tr>
			`
		});

		document.querySelectorAll("#show").forEach(btn => btn.addEventListener("click", e => show(e)))
		document.querySelectorAll("#delete").forEach(btn => btn.addEventListener("click", e => deleteData(e)))
		document.querySelectorAll("#updateData").forEach(btn => btn.addEventListener("click", e => edit(e)))

		let indexheightAvg = arrayAvg.findIndex(d => d == Math.max(...arrayAvg))

		document.querySelectorAll("tbody tr").forEach((row, idx) => {
			if (idx == indexheightAvg) {
				row.classList.add("higlight")
			}
		})

	} else {
		tbody.innerHTML = `<tr><td class="noData" colspan="7">No Record</td></tr>`

		document.getElementById("totalStd").textContent = 0
		document.getElementById("totalPass").textContent = 0
		document.getElementById("totalFail").textContent = 0
		document.getElementById("classAvg").textContent = "0.00"
		document.getElementById("heightAvg").textContent = "0.00"
		document.getElementById("lowestAvg").textContent = "0.00"
	}


}

document.getElementById("exportCSV").addEventListener("click" , e => {
	if (latestData.length == 0){
		alert("No Record")
		return
	}

	console.log(latestData);
	

	let csv = []

	csv.push([
		"name",
		"matric",
		"assignment",
		"labTest",
		"project",
		"finalExam",
		"average",
		"grade",
		"status",
	].join(","))

	latestData.forEach(data => {
		csv.push([
			data.name,
			data.matric,
			data.assignment,
			data.labTest,
			data.project,
			data.finalExam,
			data.average,
			data.grade,
			data.status
		].join(","))
	})

	csv = csv.join("\n")

	let blob = new Blob([csv], { type: "text/csv" })

	let url = URL.createObjectURL(blob)

	let a = document.createElement("a")

	a.href = url
	a.download = "student_record.csv"

	a.click()

	URL.revokeObjectURL(url)
})

renderTable()
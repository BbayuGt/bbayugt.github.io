const prefix = 'root@bbayugt ~# '
let terminal = []
let input = []
let history = []
let historyPointer = 0
let modifierPressed = false

terminal.push(`Welcome to Ubuntu 26.04.1 LTS (GNU/Linux 7.0.0-38-generic x86_64)

 * Documentation:  https://docs.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of ${(new Date()).toLocaleDateString()}

  Name:                  FITYAH BAYODIANSYAH HARAHAP
  Address:               Bandung
  LinkedIn:              https://www.linkedin.com/in/fityah-bayodiansyah-harahap-578a35279
  Github:                https://github.com/BbayuGt
  Processes:             256
  Users logged in:       1
  IPv4 address for eth0: 192.168.1.1

Expanded Security Maintenance for Applications is enabled.

Welcome!

You have new mail.
Last login: ${(new Date()).toLocaleString()} from 192.168.1.1
`)

terminal.push(prefix)

refresh()

setInterval(() => {
	const el = document.getElementById("cursor")
	if (!el.classList.contains("hidden")) el.classList.add("hidden")
	else el.classList.remove("hidden")
}, 1000)

function refresh() {
	const el = document.getElementById("output")

	const cur = document.createElement("p") // cursor
	cur.className = "cursor line"
	cur.id = "cursor"
	cur.innerText = "█"

	el.innerHTML = ""
	
	// build the console
	const lines = terminal.join("").split("\n")
	for (let i = 0; i < lines.length-1; i++) {
		let line = document.createElement("p")
		if (lines[i] === "") line.innerHTML = "&nbsp;"
		else line.innerHTML = escapeHTML(lines[i]);
		line.className = "line"
		el.appendChild(line)
	}

	let inputLine = document.createElement("div")
	inputLine.className = "line activeLine"

	let line = document.createElement("p")
	line.className = "line"

	line.innerHTML = escapeHTML(lines[lines.length-1] + input.join(""))
	inputLine.appendChild(line)
	inputLine.appendChild( // apply cursor at theend
		cur
	)
	cur.hidden = false
	el.appendChild(inputLine)
}

function escapeHTML(text) {
	let splitted = text.split("")

	for (let x = 0; x < splitted.length; x++) {
		const chr = splitted[x];

		switch (chr) {
			case " ": {
				splitted[x] = "&nbsp;"
				break
			}
			case "<": {
				splitted[x] = "&lt;"
				break;
			}
			case ">": {
				splitted[x] = "&gt;"
				break;
			}
		}
	}
	return splitted.join("")
}

function handleEnter() {
	terminal.push(...input, "\n");
	handleCommand(...input.join("").split(" "))
	terminal.push(prefix)
	history.push(input.join(""))
	historyPointer = history.length
	input = []
}

function println(input) {
	terminal.push(input + "\n")
}

function cat(file) {
	switch (file) {
		case "experience": {
			
		} break;
	}
}

function handleCommand(...input) {
	const cmd = input[0]
	const argv = input.slice(1)
	switch (cmd) {
		case "./blog.elf": {
			println("Opening in existing browser session.")
			window.open("https://bbayugt.kamo.my.id")
			break
		}
		case "echo": {
			println(argv.join(" "))
			break;
		}
		case "ls": {
			if (argv.length === 0) println("about-me blog.elf")
			break;
		}
		case "cat": {
			cat(argv[0])
		}
		case "": {
			break;
		}
		default: {
			println(`zsh: command not found: ${cmd}`)
		}
	}
}

// Keyup CTRL
document.addEventListener("keyup", (ev) => {
	if (ev.key === "Control") modifierPressed = false;
})

document.addEventListener("click", () => {
	const el = document.getElementById("input")
	el.click()
	el.focus()
})

document.addEventListener("keydown", (ev) => {
	if (ev.key.length > 1) {
		console.log(ev.key)
		if (ev.key === "Control") modifierPressed = true
		if (ev.key === "ArrowUp") { // History up
			if (history.length === 0 || historyPointer === 0) return;
			input = history[--historyPointer].split("")
			console.log(historyPointer)
			refresh()
			return
		}
		if (ev.key === "ArrowDown") { // History up
			if (historyPointer < 0) historyPointer = 0;
			if (history.length === 0) return;
			if (historyPointer >= history.length-1) {
				historyPointer = history.length
				input = []
			}
			else input = history[++historyPointer].split("")
			console.log(historyPointer)
			refresh()
			return
		}
		if (ev.key === "Enter") {
			handleEnter()
			refresh()
			return
		}
		if (ev.key === "Backspace") { //delete word
			if (modifierPressed) {
				if (input[input.length-1] === " ") input.pop()
				while (input.pop() !== " " && input.length != 0) {
				}
				if (input.length != 0)input.push(" ")
			} else if (input.length >= 1)input.pop()
			refresh()
			return
		}
		return
	}

	// Handle modifier (CTRL+C, CTRL+V)
	if (modifierPressed) {
		if (ev.key === "v") { // CTRL + V
			navigator.clipboard.readText().then((text) => {
				input.push(...text.split(""))
				refresh()
			})
		}
		if (ev.key === "c") { // CTRL+c (close)
			terminal.push(input.join("")  + "^C\n" + prefix)
			input = []
			refresh()
		}
	} else {
		// sanitize spaces
		if (ev.key === " ") input.push(ev.key)
		else input.push(ev.key)
		refresh()
	}
})

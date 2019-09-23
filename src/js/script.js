var oFileIn;
var fileJson;
var startTime = new Date();
var typed = [];
var remaining = [];
var words = [];
var totalWord = 0;
var characters = [];
var totalChar = 0;
var wrongFlag = false;
var wrongCharacter = [];
var paragraph = "";

$(function () {
	// $("body").on("contextmenu", function () {
	// 	return false;
	// });
	timer();
	readTextFile("src/data.json", function (text) {
		fileJson = JSON.parse(text);
	});
	var lstfocus = $("input[type='text']")[0];
	$("body").click(function () {
		if ($(':focus').is("input[type='text']")) {
			lstfocus = $(':focus');
		}
		lstfocus.focus();
	});

	$("#start").on("click", function () {
		toStart();
	});
	$("#to_text").on('keypress', function (event) {
		if (!wrongFlag) {
			toType(event, true);
		} else {
			return false;
		}
	});
	$("#to_text").on('keydown', function (e) {
		if (event.keyCode == 8 && $(e.target).is("input, textarea")) {
			if (!wrongFlag) {
				e.preventDefault();
			} else {
				toType(event, false);
			}
		}
	});
});


function readTextFile(file, callback) {
	var rawFile = new XMLHttpRequest();
	rawFile.overrideMimeType("application/json");
	rawFile.open("GET", file, true);
	rawFile.onreadystatechange = function () {
		if (rawFile.readyState === 4 && rawFile.status == "200") {
			callback(rawFile.responseText);
		}
	}
	rawFile.send(null);
}

async function toStart() {
	$(".typed").html("");

	var random = Math.floor(Math.random() * 10);
	// var random = 11;
	var fromString = _.filter(fileJson, function (line) {
		if (parseInt(line.no) == random) {
			return line;
		}
	});
	if (fromString.length) {
		paragraph = fromString[0].paragraph;
	}

	resetAll();
}

function startTyping(paragraph) {
	words = paragraph.split(" ");
	totalWord = words.length;
	characters = paragraph.split("");
	var newarr = []
	startTime = new Date();
	characters = _.each(characters, ch => {
		if (ch == ' ') {
			ch = '&nbsp';
		}
		newarr.push(ch);
	})
	characters = newarr;
	remaining = characters.slice(0);
	totalChar = characters.length;
	$("#to_text").focus();
	remaining.splice(0, 1)
	$(".remaining").html(join(remaining));
	$(".next").html(characters[0]);
}

function toType(event, flag) {
	if (typed.length + 1 == characters.length) {
		displayResults();
	} else {
		if (flag) {
			var nextChar = "";
			if (event.key == ' ') {
				nextChar = "&nbsp;";
			} else {
				nextChar = event.key;
			}
			if (nextChar == $(".next").html()) {
				addChar(event.key);
			} else {
				removeChar(event.key);
			}
		} else {
			wrongFlag = false;
			if ($(".next").hasClass("wrong")) {
				$(".next").removeClass("wrong");
			} else {
				return false;
			}
		}
	}
}

function addChar(character) {
	if (character == " ") {
		character = "&nbsp;";
	}
	typed.push(character);
	$(".next").removeClass("wrong");
	$(".typed").html(join(typed));
	if (characters[typed.length] == " ") {
		$(".next").html("&nbsp;");
	} else {
		$(".next").html(characters[typed.length]);
	}
	remaining.splice(0, 1);
	$(".remaining").html(join(remaining));
}

function removeChar() {
	$(".next").addClass("wrong");
	wrongFlag = true;
	wrongCharacter.push("1");
}

function displayResults() {
	var endTime = new Date();
	var diff = (endTime.getTime() - startTime.getTime()) / 1000;
	var speed = (totalChar / 5) / (diff / 60)
	$(".result_div .speed .res_num").text(parseInt(speed));
	var acc = (100 * wrongCharacter.length) / totalChar;
	$(".result_div .accuracy .res_num").text(parseInt(100 - acc));
	if (speed <= 20) {
		$(".result_div img").attr("src", "src/images/cry.png");
	} else if (speed > 20 && speed <= 60) {
		$(".result_div img").attr("src", "src/images/smile.png");
	} else if (speed > 60) {
		$(".result_div img").attr("src", "src/images/gogles.png");
	}
	sparcle();
	$(".result_div").show();
	$(".result_div .res_num").animate({ fontSize: '250px' });;
	resetAll();
	$("#to_text").attr("disabled", "disabled");
	return false;
}

function sparcle() {
	const app = document.getElementById('body')

	const myRand = () => {
		return Math.random() * 100
	}

	for (let i = 0; i < 200; i++) {
		const delay = Math.random() + 's';
		const el = document.createElement('img')
		el.src = 'https://dl.dropboxusercontent.com/s/soxcov4m81dx55l/star.svg'
		el.className = 'glitter-star'
		el.style.top = myRand() + '%'
		el.style.left = myRand() + '%'
		el.style.animationDelay = delay
		el.style.msAnimationDelay = delay
		el.style.webkitAnimationDelay = delay
		el.style.monAnimationDelay = delay
		app.appendChild(el)
	}
}

function resetAll() {
	currentTime = new Date();
	typed = [];
	remaining = [];
	words = [];
	totalWord = 0;
	characters = [];
	totalChar = 0;
	$(".textFromHere").hide();
	$(".typed").html("");
	$(".next").html("");
	$(".remaining").html("");
	$("#to_text").attr("disabled", false).val("");
}

function timer() {
	return new Promise(resolve => {
		new ProgressButton($("button")[0], {
			callback: function (instance) {
				$(".result_div").hide();
				$(".glitter-star").remove();
				var progress = 0,
					interval = setInterval(function () {
						progress = Math.min(progress + Math.random() * 0.1, 1);
						instance._setProgress(progress);
						if (progress === 1) {
							instance._stop(1);
							clearInterval(interval);
							$(".textFromHere").show();

							startTyping(paragraph);
							resolve("done");
						}
					}, 200);
			}
		});
	});
}

function join(arr) {
	return arr.join("");
}
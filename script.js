/* ================================================================
   RANDOM SÕNAD — hajusrakenduste sõnavara EE ↔ RU
   ================================================================ */

/* 1. Sõnastik on rakenduse ühine andmeallikas: iga objekt sisaldab
   eestikeelset terminit ja sellele vastavat venekeelset tõlget. */
const dictionary = [
  { ee: "server", ru: "сервер" },
  { ee: "klient", ru: "клиент" },
  { ee: "andmebaas", ru: "база данных" },
  { ee: "sõlm", ru: "узел" },
  { ee: "klaster", ru: "кластер" },
  { ee: "päring", ru: "запрос" },
  { ee: "vastus", ru: "ответ" },
  { ee: "veebiteenus", ru: "веб-сервис" },
  { ee: "rakendusliides", ru: "интерфейс приложения" },
  { ee: "protokoll", ru: "протокол" },
  { ee: "sõnum", ru: "сообщение" },
  { ee: "järjekord", ru: "очередь" },
  { ee: "latentsus", ru: "задержка" },
  { ee: "koormus", ru: "нагрузка" },
  { ee: "skaleeritavus", ru: "масштабируемость" },
  { ee: "veakindlus", ru: "отказоустойчивость" },
  { ee: "autentimine", ru: "аутентификация" },
  { ee: "turvalisus", ru: "безопасность" },
  { ee: "pilv", ru: "облако" },
  { ee: "konteiner", ru: "контейнер" },
  { ee: "mikroteenus", ru: "микросервис" },
  { ee: "sünkroniseerimine", ru: "синхронизация" },
  { ee: "replika", ru: "реплика" },
  { ee: "haru", ru: "ветка" },
  { ee: "muudatus", ru: "изменение" }
];

let currentEE = null;
let currentRU = null;
let correctCount = 0;
let wrongCount = 0;
let lastEEIndex = -1;
let lastRUIndex = -1;

/* 2. See funktsioon tagastab juhusliku massiivi indeksi ning väldib
   võimaluse korral sama sõna kohest kordumist samas veerus. */
function getRandomIndex(previousIndex) {
  if (dictionary.length <= 1) return 0;

  let nextIndex;
  do {
    nextIndex = Math.floor(Math.random() * dictionary.length);
  } while (nextIndex === previousIndex);

  return nextIndex;
}

/* 3. Vasaku veeru uuendamisel valitakse random eestikeelne sõna,
   tühjendatakse eelmine vastus ja eemaldatakse vana tagasiside. */
function refreshEE() {
  lastEEIndex = getRandomIndex(lastEEIndex);
  currentEE = dictionary[lastEEIndex];
  document.getElementById("wordEE").textContent = currentEE.ee;
  document.getElementById("inputRU").value = "";
  setFeedback("feedbackEE", "", "");
}

/* 4. Parema veeru uuendamine kasutab sama andmemassiivi, kuid kuvab
   venekeelse väärtuse ning ootab kasutajalt eestikeelset vastust. */
function refreshRU() {
  lastRUIndex = getRandomIndex(lastRUIndex);
  currentRU = dictionary[lastRUIndex];
  document.getElementById("wordRU").textContent = currentRU.ru;
  document.getElementById("inputEE").value = "";
  setFeedback("feedbackRU", "", "");
}

/* 5. Normaliseerimine teeb kontrolli kasutajasõbralikumaks: alguse ja
   lõpu tühikud eemaldatakse ning suurtel/väikestel tähtedel pole vahet. */
function normalize(value) {
  return value.trim().toLocaleLowerCase();
}

/* 6. Ühine tagasisidefunktsioon hoiab DOM-i muutmise ühes kohas ning
   lisab vastusele kas õnnestumise või vea CSS-klassi. */
function setFeedback(elementId, message, type) {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.className = type ? `feedback ${type}` : "feedback";
}

/* 7. Skoori renderdamine eraldab rakenduse state'i ja kasutajaliidese:
   loendurid asuvad JavaScriptis, aga nende väärtused kuvatakse HTML-is. */
function updateScore() {
  document.getElementById("scoreCorrect").textContent = correctCount;
  document.getElementById("scoreWrong").textContent = wrongCount;
  document.getElementById("dictSize").textContent = dictionary.length;
}

/* 8. EE → RU kontroll võrdleb kliendi sisestatud väärtust oodatud
   response'iga ja uuendab tulemusloendurit vastavalt päringu tulemusele. */
function checkEE() {
  const answer = normalize(document.getElementById("inputRU").value);

  if (!answer) {
    setFeedback("feedbackEE", "Sisesta enne vastus.", "err");
    return;
  }

  if (answer === normalize(currentEE.ru)) {
    correctCount++;
    setFeedback("feedbackEE", `Õige ✓  ${currentEE.ee} = ${currentEE.ru}`, "ok");
  } else {
    wrongCount++;
    setFeedback("feedbackEE", `Vale. Õige vastus: ${currentEE.ru}`, "err");
  }

  updateScore();
}

/* 9. RU → EE kontroll töötab vastupidises suunas, kuid kasutab sama
   kontrolliloogikat ja sama ühist sõnastikku nagu vasak veerg. */
function checkRU() {
  const answer = normalize(document.getElementById("inputEE").value);

  if (!answer) {
    setFeedback("feedbackRU", "Sisesta enne vastus.", "err");
    return;
  }

  if (answer === normalize(currentRU.ee)) {
    correctCount++;
    setFeedback("feedbackRU", `Õige ✓  ${currentRU.ru} = ${currentRU.ee}`, "ok");
  } else {
    wrongCount++;
    setFeedback("feedbackRU", `Vale. Õige vastus: ${currentRU.ee}`, "err");
  }

  updateScore();
}

/* 10. Kasutaja saab lisada uue sõnapaari massiivi ilma lehte muutmata;
   pärast lisamist võib random-generaator uut objekti kohe valida. */
function addWord(event) {
  event.preventDefault();

  const eeInput = document.getElementById("newEE");
  const ruInput = document.getElementById("newRU");
  const message = document.getElementById("addWordMessage");
  const ee = eeInput.value.trim();
  const ru = ruInput.value.trim();

  if (!ee || !ru) {
    message.textContent = "Täida mõlemad väljad.";
    message.className = "form-message err";
    return;
  }

  const alreadyExists = dictionary.some(
    (item) => normalize(item.ee) === normalize(ee) || normalize(item.ru) === normalize(ru)
  );

  if (alreadyExists) {
    message.textContent = "See sõna on sõnastikus juba olemas.";
    message.className = "form-message err";
    return;
  }

  dictionary.push({ ee, ru });
  updateScore();
  eeInput.value = "";
  ruInput.value = "";
  message.textContent = `Lisatud: ${ee} ↔ ${ru}`;
  message.className = "form-message ok";
}

/* 11. Enter-klahv käivitab kontrolli nagu tavaline submit/request,
   seega saab harjutust kasutada kiiresti ka ainult klaviatuuriga. */
document.getElementById("inputRU").addEventListener("keydown", (event) => {
  if (event.key === "Enter") checkEE();
});

document.getElementById("inputEE").addEventListener("keydown", (event) => {
  if (event.key === "Enter") checkRU();
});

/* 12. Event listener'id seovad HTML-is olevad nupud JavaScripti
   funktsioonidega ning moodustavad kasutajaliidese põhilise sündmusvoo. */
document.getElementById("checkEE").addEventListener("click", checkEE);
document.getElementById("checkRU").addEventListener("click", checkRU);
document.getElementById("refreshEE").addEventListener("click", refreshEE);
document.getElementById("refreshRU").addEventListener("click", refreshRU);
document.getElementById("newBoth").addEventListener("click", () => {
  refreshEE();
  refreshRU();
});

document.getElementById("reloadPage").addEventListener("click", () => window.location.reload());
document.getElementById("addWordForm").addEventListener("submit", addWord);

document.getElementById("resetScore").addEventListener("click", () => {
  correctCount = 0;
  wrongCount = 0;
  updateScore();
});

/* 13. Init käivitub lehe laadimisel: kuvatakse sõnastiku suurus ning
   mõlemas tabeliveerus genereeritakse kohe esimene juhuslik sõna. */
updateScore();
refreshEE();
refreshRU();

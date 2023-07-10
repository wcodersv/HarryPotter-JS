//Привязывание обработчика к элементу input
const inputName = document.querySelector("#name");
const selectHouse = document.querySelector("#house")

function addSelectHouseOptions(students) {
    // Создаем новый Set для хранения уникальных факультетов
    const uniqueHouses = new Set();

    // Перебираем массив студентов и добавляем факультеты в Set
    students.forEach(student => {
        uniqueHouses.add(student.house);
    });

    [...uniqueHouses].filter(house => house).forEach(house => {
        const optionElement = document.createElement("option");
        optionElement.value = house;
        optionElement.textContent = house;
        selectHouse.append(optionElement);
    });
}

let cardsPerLoad = 4;
let currentPosition = 4;

let allStudents;

let prevName;
let prevHouse;
let filteredStudents;

let ldsDefault = document.querySelector('.lds-default');
ldsDefault.style.display = 'block';

fetch("https://hp-api.onrender.com/api/characters")
    .then((response) => response.json())
    .then((data) => {
        renderStudentsFromStart(data);
        ldsDefault.style.display = 'none';
        allStudents = data;

        addSelectHouseOptions(data);
        addHandlers();
    })
    .catch((error) => {
        console.log("Произошла ошибка", error);
    });

let divContainer = document.querySelector(".container");

function addHandlers() {
    inputName.addEventListener("input", event => handleNameInput(event.target.value));

    selectHouse.addEventListener("change", event => handleHouseChange(event.target.value));

    // Привязываем обработчик скроллинга
    window.addEventListener("scroll", handleScroll);
}

function handleNameInput(name) {
    const filteredStudents = getFilteredStudents(name, selectHouse.value);
    renderStudentsFromStart(filteredStudents);
}

function handleHouseChange(house) {
    const filteredStudents = getFilteredStudents(inputName.value, house);
    renderStudentsFromStart(filteredStudents);
}

function handleScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const visibleHeight = window.innerHeight;
    const totalHeight = document.documentElement.offsetHeight - 100;

    const filteredStudents = getFilteredStudents(inputName.value, selectHouse.value);

    if (scrollTop + visibleHeight >= totalHeight) {
        // Достигнут конец страницы, отрисовываем следующую порцию карточек
        const nextPosition = currentPosition + cardsPerLoad;
        renderNextStudens(currentPosition, nextPosition, filteredStudents);
        currentPosition = nextPosition;
    }
}

function getFilteredStudents(name, house) {
    if (name !== prevName || house !== prevHouse) {
        filteredStudents = filterStudents(allStudents, name, house);
        prevName = name;
        prevHouse = house;
    }
    return filteredStudents;
}

/* Функция для отрисовки одной карточки */
function renderStudent(student) {
    let card = `
        <div class="card">
          <div class="card-photo">
            <img src="${student.image}" alt="${student.name}" width="334px" height="192px" />
          </div>
          <div class="card-info">
            <h2 class="card-info__title">${student.name}</h2>
            <p>Actor: ${student.actor}</p>
            <p>Gender: ${student.gender}</p>
            <p>House: ${student.house}</p>
            <p>Wand core: ${student.wand.core}</p>
            <p>Alive: ${student.alive ? "yes" : "no"}</p>
          </div>
        </div> 
    `;
    divContainer.innerHTML += card;
}

/*Функция для отрисовки карточек всех карточек вначале*/
function renderStudentsFromStart(students) {
    clearList();
    renderNextStudens(0, cardsPerLoad, students)
}

//Функция для удаления div-card внутри container
function clearList() {
    divContainer.innerHTML = "";
    currentPosition = 4;
}

function filterStudents(students, name, house) {
    if (!name && !house) {
        return students;
    }
    if (name) {
        name = name.toLowerCase().trim();
    }

    /*Функция для проверки совпадает ли карточка с ключевыми словами*/
    function isStudentMatched(student) {
        if (!house) {
            return student.name.toLowerCase().includes(name);
        }
        if (name) {
            return student.house === house && student.name.toLowerCase().includes(name);
        }
        return student.house === house;
    }

    return students.filter(isStudentMatched);
}

function renderNextStudens(startIndex, endIndex, students) {
    students.slice(startIndex, endIndex).forEach(renderStudent);
}

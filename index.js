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

fetch("https://hp-api.onrender.com/api/characters")
    .then((response) => response.json())
    .then((data) => {
        renderAllDataList(data);
        return data;
    })
    .then((data) => {
        addSelectHouseOptions(data);
        inputName.addEventListener("input", function (event) {
            renderFilteredDataList(data, event.target.value, selectHouse.value);
        });
        selectHouse.addEventListener("change", function (event) {
            renderFilteredDataList(data, inputName.value, event.target.value);
        });
    })
    .catch((error) => {
        console.log("Произошла ошибка", error);
    });

let divContainer = document.querySelector(".container");

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
function renderAllDataList(students) {
    students.forEach(renderStudent);
}

//Функция для удаления div-card внутри container
function clearList() {
    divContainer.innerHTML = "";
}

function renderFilteredDataList(students, name, house) {
    clearList();
    if (!name && !house) {
        renderAllDataList(students);
        return;
    }

    if (name) {
        name = name.toLowerCase().trim();
    }

    students.filter(isStudentMatched).forEach(renderStudent);

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
}
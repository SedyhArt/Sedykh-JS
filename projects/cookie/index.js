/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответствует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

import './cookie.html';

/*
 app - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const app = document.querySelector('#app');
// текстовое поле для фильтрации cookie
const filterNameInput = app.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = app.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = app.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = app.querySelector('#add-button');
// таблица со списком cookie
const listTable = app.querySelector('#list-table tbody');

function getCookies() {
  if (!document.cookie) {
    return {};
  }
  return document.cookie.split('; ').reduce((prev, current) => {
    const [name, value] = current.split('=');
    prev[name] = value;
    return prev;
  }, {});
}

function createTable(cookies) {
  if (cookies[addNameInput.value]) {
    console.log('Уже есть такой Cookie');
    const cookieTableValue = document.getElementById(addNameInput.value);
    return (cookieTableValue.innerText = addValueInput.value);
  } else if (!cookies[addNameInput.value] && addNameInput.value) {
    cookies = { [addNameInput.value]: addValueInput.value };
  }

  for (const cookie in cookies) {
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${cookie}</td>
      <td id ="${cookie}">${cookies[cookie]}</td>
      <td><button class="del" data-delete="${cookie}">Удалить</button></td>
      `;
    listTable.appendChild(newRow);
  }
}

function isMatching(full, chunk) {
  return full.toLowerCase().indexOf(chunk.toLowerCase()) > -1;
}

function clearDomTree(elem) {
  for (let i = elem.children.length - 1; i > -1; i--) {
    const element = elem.children[i];
    element.remove();
  }
}

filterNameInput.addEventListener('input', function (cookies) {
  cookies = getCookies();

  clearDomTree(listTable);

  const cookiesNames = Object.keys(cookies);
  let newObj = {};
  for (const cookieName in cookiesNames) {
    const name = cookiesNames[cookieName];
    const val = cookies[cookiesNames[cookieName]];

    if (isMatching(val, this.value) || isMatching(name, this.value)) {
      newObj = { [name]: val };
    }
  }
  createTable(newObj);
});

addButton.addEventListener('click', () => {
  if (!addNameInput.value || !addValueInput.value) {
    return alert('Не введено имя cookie');
  }
  createTable(getCookies());
  document.cookie = `${addNameInput.value}=${addValueInput.value}`;

  setTimeout(() => {
    addNameInput.value = '';
    addValueInput.value = '';
  }, 0);
});

listTable.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    e.target.closest('tr').remove();
    const cookieName = e.target.dataset.delete;
    document.cookie = `${cookieName}=delete; expires=${new Date(0)}`;
  }
});

createTable(getCookies());

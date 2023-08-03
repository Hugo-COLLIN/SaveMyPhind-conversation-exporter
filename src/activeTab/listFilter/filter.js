import {waitAppend} from "../utils/webpage/insertElements";

export async function addListFilter() {
  // Créez un champ de texte pour la saisie de l'utilisateur
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Filter list...';
  input.classList.add('form-control', 'form-control-sm', 'mb-2', 'searchbox-textarea');
  // document.body.insertBefore(input, document.querySelector('tbody'));
  await waitAppend('.container.p-0.mt-6 > .row', [input], 'insertBefore')

// Fonction pour filtrer la liste en fonction du texte saisi
  function filterList() {
    const filterText = input.value.toLowerCase();
    const rows = document.querySelectorAll('tbody tr');

    rows.forEach(row => {
      const text = row.querySelector('.fs-6').textContent.toLowerCase();
      row.style.display = text.includes(filterText) ? '' : 'none';
    });
  }

// Ajoutez un gestionnaire d'événements pour détecter les modifications dans le champ de texte
  input.addEventListener('input', filterList);


  // //Add an input field above the list
  // const filterInput = document.createElement('input');
  // filterInput.setAttribute('type', 'text');
  // filterInput.setAttribute('placeholder', 'Recherche...');
  // document.body.insertBefore(filterInput, document.getElementById('listItems'));
  //
  // //Add an event listener to the input field to filter the list items based on the entered text
  // filterInput.addEventListener('input', function() {
  //   const filterText = this.value.toLowerCase();
  //   const listItems = document.querySelectorAll('#listItems tr');
  //
  //   listItems.forEach(function(item) {
  //     const itemText = item.querySelector('.fs-6').textContent.toLowerCase();
  //     if (itemText.includes(filterText)) {
  //       item.style.display = '';
  //     } else {
  //       item.style.display = 'none';
  //     }
  //   });
  // });
  //
  //
  // document.getElementById('filterInput').addEventListener('keyup', function() {
  //   const filterText = this.value.toLowerCase();
  //   const listItems = document.getElementById('listItems').querySelectorAll('tr');
  //
  //   listItems.forEach(function(item) {
  //     const itemText = item.querySelector('.fs-6').textContent.toLowerCase();
  //     if (itemText.includes(filterText)) {
  //       item.style.display = '';
  //     } else {
  //       item.style.display = 'none';
  //     }
  //   });
  // });
}
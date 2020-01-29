const currentComment = {};

function insertCommentsInResults(comments) {
  const resultsContainer = $("#results");
  $(resultsContainer).empty();
  comments.forEach(comment => {
    const newComment = $(`
        <div class="comment-container">
        <h2>${comment.titulo}</h2>
        <h4>By: ${comment.autor}</h4>
        <p>${comment.contenido}</p>
        <p> Id: ${comment._id} </p>
        <p> Timestamp: ${comment.fecha}</p>
        </div>
      `);
    $(resultsContainer).append(newComment);
  });
}

function hideAllFormsExcept(className) {
  $("form").each(function(_index) {
    if ($(this).hasClass(className)) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });

  $(".selection-button").each(function(_index) {
    if ($(this).hasClass(className)) {
      $(this).addClass("selected-button");
    } else {
      $(this).removeClass("selected-button");
    }
  });
}

function populateComments() {
  const url = "/blog-api/comentarios";
  const settings = {
    method: "GET"
  };
  fetch(url, settings)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
    .then(responseJSON => {
      insertCommentsInResults(responseJSON);
    });
}

function watchNavigationButtons() {
  $("button.create-form").on("click", event => {
    event.preventDefault();
    hideAllFormsExcept("create-form");
  });
  $("button.edit-form").on("click", event => {
    event.preventDefault();
    hideAllFormsExcept("edit-form");
  });
  $("button.delete-form").on("click", event => {
    event.preventDefault();
    hideAllFormsExcept("delete-form");
  });
  $("button.search-form").on("click", event => {
    event.preventDefault();
    hideAllFormsExcept("search-form");
  });
}

function watchCreateForm() {
  $("form.create-form").on("submit", event => {
    event.preventDefault();

    const titleInput = $(event.currentTarget).find("input[name='titulo']");
    const autorInput = $(event.currentTarget).find("input[name='autor']");
    const contenidoInput = $(event.currentTarget).find(
      "textarea[name='contenido']"
    );
    const url = "/blog-api/nuevo-comentario";
    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        titulo: $(titleInput).val(),
        autor: $(autorInput).val(),
        contenido: $(contenidoInput).val()
      })
    };
    fetch(url, settings)
      .then(response => {
        if (response.ok) {
          $(titleInput).val("");
          $(autorInput).val("");
          $(contenidoInput).val("");
          populateComments();
        } else {
          alert("Error: " + response.statusText);
        }
      })
      .catch(error => {
        alert("Hubo un error en el request: " + error);
      });
  });
}

function watchEditForm() {
  $("form.edit-form").on("submit", event => {
    event.preventDefault();

    const idInput = $(event.currentTarget).find("input[name='id']");
    const fechaInput = $(event.currentTarget).find("input[name='fecha']");
    const titleInput = $(event.currentTarget).find("input[name='titulo']");
    const autorInput = $(event.currentTarget).find("input[name='autor']");
    const contenidoInput = $(event.currentTarget).find(
      "textarea[name='contenido']"
    );

    const url = `/blog-api/actualizar-comentario/${$(idInput).val()}`;
    const settings = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: $(idInput).val(),
        fecha: $(fechaInput).val(),
        titulo: $(titleInput).val(),
        autor: $(autorInput).val(),
        contenido: $(contenidoInput).val()
      })
    };
    fetch(url, settings)
      .then(response => {
        if (response.ok) {
          $(idInput).val("");
          $(fechaInput).val("");
          $(titleInput).val("");
          $(autorInput).val("");
          $(contenidoInput).val("");
          populateComments();
        } else {
          alert("Error: " + response.statusText);
        }
      })
      .catch(error => {
        alert("Hubo un error en el request: " + error);
      });
  });
}

function watchDeleteForm() {
  $("form.delete-form").on("submit", event => {
    event.preventDefault();

    const idInput = $(event.currentTarget).find("input[name='id']");

    const url = `/blog-api/remover-comentario/${$(idInput).val()}`;
    const settings = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    };
    fetch(url, settings)
      .then(response => {
        if (response.ok) {
          $(idInput).val("");
          populateComments();
        } else {
          alert("Error: " + response.statusText);
        }
      })
      .catch(error => {
        alert("Hubo un error en el request: " + error);
      });
  });
}

function watchSearchForm() {
  $("form.search-form").on("submit", event => {
    event.preventDefault();

    const autorInput = $(event.currentTarget).find("input[name='autor']");

    const url =
      "/blog-api/comentarios-por-autor?" +
      $.param({ autor: $(autorInput).val() });
    const settings = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    };
    fetch(url, settings)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          alert("Error: " + response.statusText);
        }
      })
      .then(responseJSON => {
        if (responseJSON) {
          insertCommentsInResults(responseJSON);
        }
      })
      .catch(error => {
        alert("Hubo un error en el request: " + error);
      });
  });
  $("form.search-form button[name='clear'").on("click", event => {
    event.preventDefault();
    $("form.search-form input[name='autor']").val("");
    populateComments();
    $();
  });
}

function init() {
  hideAllFormsExcept("create-form");
  watchNavigationButtons();
  watchCreateForm();
  watchEditForm();
  watchDeleteForm();
  watchSearchForm();
  populateComments();
}

init();

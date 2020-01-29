const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const uuid = require("uuid");
const mongoose = require("mongoose");
const { port, databaseURL } = require("./config");
const { PostMethods } = require("./model");

const app = express();
app.use(express.static("public"));
app.use(morgan("dev"));

app.get("/blog-api/comentarios", (_req, res) => {
  PostMethods.getAll().then(posts => {
    res.status(200).json(posts);
  });
});

app.get("/blog-api/comentarios-por-autor", (req, res) => {
  const { autor } = req.query;
  console.log("Autor");
  if (!autor) {
    res.statusMessage = "El parametro autor es requerido";
    return res.status(406).send();
  }
  PostMethods.getByAuthor(autor)
    .then(posts => {
      if (posts.length === 0) {
        res.statusMessage = "El autor proporcionado no tiene ningun comentario";
        return res.status(404).send();
      }
      return res.status(200).json(posts);
    })
    .catch(_error => {
      res.statusMessage = "Internal server error";
      return res.status(500).send();
    });
});

app.post("/blog-api/nuevo-comentario", jsonParser, (req, res) => {
  const { titulo, contenido, autor } = req.body;
  if (!(titulo && contenido && autor)) {
    res.statusMessage =
      "Los parametros titulo, contenido y autor son requeridos en el cuerpo.";
    return res.status(406).send();
  }
  const post = {
    titulo,
    contenido,
    autor,
    _id: uuid.v4(),
    fecha: new Date().getTime()
  };
  PostMethods.create(post).then(_response => res.status(201).json(post));
});

app.delete("/blog-api/remover-comentario/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  PostMethods.delete(id).then(deletedDoc => {
    if (deletedDoc) {
      return res.status(204).json({});
    }
    res.statusMessage = "No existe un comentario con el id especificado";
    res.status(404).send();
  });
});

app.put("/blog-api/actualizar-comentario/:id", jsonParser, (req, res) => {
  const paramId = req.params.id;
  const { id, titulo, contenido, autor, fecha } = req.body;
  if (!id) {
    res.statusMessage = "El parametro id es requerido en el cuerpo";
    return res.status(406).send();
  }
  if (id !== paramId) {
    res.statusMessage =
      "El id proporcionado en el cuerpo y en el url no coinciden";
    return res.status(409).send();
  }
  if (!(titulo || contenido || autor || fecha)) {
    res.statusMessage =
      "Al menos uno de los parametros titulo, contenido, autor o fecha deben ser proporcionados";
    return res.status(406).send();
  }

  const updateObject = {
    ...(titulo && { titulo }),
    ...(contenido && { contenido }),
    ...(autor && { autor }),
    ...(fecha && { fecha })
  };

  PostMethods.update(id, updateObject).then(newPost => {
    if (newPost) {
      return res.status(202).json(newPost);
    }
    res.statusMessage = "No existe un comentario con el id proporcionado";
    return res.status(404).send();
  });
});

let server;

function runServer(port, databaseUrl) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, response => {
      if (response) {
        return reject(response);
      } else {
        server = app
          .listen(port, () => {
            resolve();
          })
          .on("error", err => {
            mongoose.disconnect();
            return reject(err);
          });
      }
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      server.close(err => {
        if (err) {
          return reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}

runServer(port, databaseURL);

module.exports = { app, runServer, closeServer };

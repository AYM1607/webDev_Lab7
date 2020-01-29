const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  _id: { type: String, required: true },
  titulo: { type: String, required: true },
  contenido: { type: String, required: true },
  autor: { type: String, required: true },
  fecha: { type: Number, required: true }
});

const PostModel = mongoose.model("posts", PostSchema);

const PostMethods = {
  getAll: () =>
    PostModel.find()
      .then(posts => posts)
      .catch(error => {
        throw Error(error);
      }),
  getByAuthor: autor =>
    PostModel.find({ autor })
      .then(posts => posts)
      .catch(error => {
        throw Error(error);
      }),
  create: post =>
    PostModel.create(post)
      .then(response => console.log(response))
      .catch(error => {
        throw Error(error);
      }),
  delete: id =>
    PostModel.findByIdAndDelete(id)
      .then(post => post)
      .catch(e => {
        throw Error(e);
      }),
  update: (id, updateObject) =>
    PostModel.findByIdAndUpdate(id, updateObject, { new: true })
      .then(newObject => newObject)
      .catch(e => {
        throw Error(e);
      })
};

module.exports = { PostMethods };

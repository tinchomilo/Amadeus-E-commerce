
const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
    /* id, */
    name: {
        type: String,
        unique: true,
        required: true
    }
},
    {
        timestamps: false,
        versionKey: false,
      }
)

const Category = model('Category', categorySchema)

module.exports = Category
const express = require('express');
const fs = require('fs');
const ids = require('short-id');

const contactFile = process.env.npm_package_config_contacts;

class Contact {
  constructor(lastName, firstName) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.id = ids.generate(this.firstName + this.lastName);
  }

  isNull() {
    return (this.id == null
             && this.lastName == null
             && this.firstName == null);
  }

  printConsole() {
    console.log(
      String(this.lastName).toUpperCase(),
      this.firstName,
    );
  }

  toJSON() {
    return { id: this.id, lastName: this.lastName, firstName: this.firstName };
  }

  setAttr(attr, value) {
    switch (attr) {
      case 'id':
        this.id = value;
        break;
      case 'lastName':
        this.lastName = value;
        break;
      case 'firstName':
        this.firstName = value;
        break;
      default:
        break;
    }
  }
}

const listContacts = (id, callback) => {
  if (id == null) {
    fs.readFile(contactFile, (err, data) => {
      if (!err) {
        const result = JSON.parse((data));
        callback(null, result);
      } else {
        callback(new Error());
      }
    });
  } else {
    fs.readFile(contactFile, (err, data) => {
      if (!err) {
        const file = JSON.parse(data);
        let result;
        for (let i = 0; i < file.length; i += 1) {
          if (file[i].id === id) {
            result = file[i];
            break;
          }
        }
        if (result != null) callback(null, result);
        else {
          callback(new Error('error : no contact with this id'));
        }
      } else {
        callback(new Error(`error readFile: ${err}`));
      }
    });
  }
};

const addContact = (contact, callback) => {
  fs.readFile(contactFile, (err, data) => {
    if (!err) {
      let file = JSON.parse(data);
      file.push(contact.toJSON());
      file = JSON.stringify(file, null, 2);
      fs.writeFile(contactFile, file, 'utf8', (err2) => {
        if (!err2) {
          if (callback) callback(null, contact.id);
        } else if (callback) callback(new Error(`error writeFile: ${err}`));
      });
    } else if (callback) callback(new Error(`error readFile: ${err}`));
  });
};

const removeContact = (id, callback) => {
  fs.readFile(contactFile, (err, data) => {
    if (!err) {
      let file = JSON.parse(data);
      listContacts(id, (err2) => {
        if (!err) {
          file = file.filter(contact => contact.id !== id);
          file = JSON.stringify(file, null, 2);
          fs.writeFile(contactFile, file, 'utf8', (err3) => {
            if (!err2) {
              if (callback != null) {
                callback();
              }
            } else if (callback != null) callback(new Error(`error writeFile: ${err3}`));
            else console.error('error writeFile:', err3);
          });
        } else callback(new Error('error : no client to delete'));
      });
    } else callback(new Error(`error readFile: ${err}`));
  });
};

const server = () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  /*
GET /health : ne retourne rien mais confirme que le serveur fonctionne en répondant 204 No Content
GET /contacts : retourne la liste des contacts au format JSON
POST /contacts : à partir de l'objet posté qui contient un prénom et un nom, crée un nouveau contact
  avec une id générée puis le sauvegarde et répond 201 Created (exemple d'objet accepté :
  {"firstName": "Clark", "lastName": "Kent"}) ; le test vous demande aussi de répondre l'URL du
  nouveau contact (sous la forme /contact/id) à la fois dans le header Location et le body
GET /contacts/:id : retourne le contact d'id spécifiée ; si l'id n'existe pas, répond 404
DELETE /contacts/:id
   */

  app.get('/health', (req, res) => {
    res.sendStatus(204);
  });
  app.get('/contacts', (req, res) => {
    listContacts(null, (err, result) => {
      if (!err) {
        res
          .status(200)
          .send(JSON.stringify(result, null, 2));
      } else {
        res
          .status(500);
      }
    });
  });
  app.post('/contacts', (req, res) => {
    if (req.body.firstName != null && req.body.lastName != null) {
      const contact = new Contact(
        req.body.lastName,
        req.body.firstName,
      );
      addContact(contact, (err, id) => {
        if (!err) {
          res
            .status(201)
            .setHeader('location', `/contacts/${id}`);
          res.send(`/contacts/${id}`);
        } else {
          res
            .status(500)
            .send(err);
        }
      });
    } else {
      res
        .status(404)
        .send('the body is not correct');
    }
  });
  app.get('/contacts/:id', (req, res) => {
    console.log(req.params.id);
    if (req.params.id != null) {
      listContacts(req.params.id, (err, result) => {
        if (!err) {
          res
            .status(200)
            .send(JSON.stringify(result, null, 2));
        } else {
          res
            .sendStatus(404);
        }
      });
    } else {
      res
        .sendStatus(404);
    }
  });
  app.delete('/contacts/:id', (req, res) => {
    removeContact(req.params.id, (err) => {
      if (!err) {
        res
          .sendStatus(204);
      } else {
        res
          .sendStatus(404);
      }
    });
  });

  app.listen(3000, () => {
    console.log('port: 3000');
  });
};

module.exports = {
  Contact,
  listContacts,
  addContact,
  removeContact,
  server,
};

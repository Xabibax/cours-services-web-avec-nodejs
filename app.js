
const fs = require('fs');
const program = require('commander');
const lib = require('./lib.js');

const contactFile = process.env.npm_package_config_contacts;


program
  .command('list')
  .description('Show list of contacts')
  .action((source, destination) => {
    fs.readFile(contactFile, (err, data) => {
      if (!err) {
        lib.listContacts(data);
      } else {
        console.log('error :', err);
      }
    });
  });

program
  .command('add')
  .description('Add a contact to the list of contacts')
  .action((source, destination) => {
    if (process.argv.length === 5) {
      fs.readFile(contactFile, (err, data) => {
        if (!err) {
          const contact = new lib.Contact(0, process.argv[4], process.argv[3]);
          fs.writeFile(contactFile, lib.addContact(data, contact), 'utf8', (err2) => {
            if (err2) {
              console.log('error :', err2);
            }
          });
        } else {
          console.log('error :', err);
        }
      });
    } else {
      console.log('no contact passed as parameter');
    }
  });

program
  .command('remove')
  .description('Remove a contact to the list of contacts')
  .action((source, destination) => {
    if (process.argv.length === 4) {
      fs.readFile(contactFile, (err, data) => {
        if (!err) {
          fs.writeFile(contactFile, lib.removeContact(data, process.argv[3]), 'utf8', (err2) => {
            if (err2) {
              console.log('error :', err2);
            }
          });
        } else {
          console.log('error :', err);
        }
      });
    } else {
      console.log('no contact passed as parameter');
    }
  });


program.parse(process.argv);

if (process.argv.length < 3) {
  program.help();
}

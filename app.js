const fs = require('fs');
const program = require('commander');

const contactFile = process.env.npm_package_config_contacts;

function parseFile(data) {
  const contacts = new Map();

  JSON.parse(data, (key, value) => {
    if (Number(key) || key === '0') {
      console.log(
        String(contacts.get('lastName')).toUpperCase(),
        contacts.get('firstName'),
      );
    } else {
      contacts.set(key, value);
    }
  });
}

program
  .command('list')
  .description('Show list of contacts')
  .action((source, destination) => {
    fs.readFile(contactFile, (err, data) => {
      if (!err) {
        parseFile(data);
      } else {
        console.log('error :', err);
      }
    });
  });
// program
//   .command('add')
//   .description('Add a conctact to the list of contacts')
//   .action((source, destination) => {
//     fs.readFile(contactFile, (err, data) => {
//       if (!err) {
//         parseFile(data);
//       } else {
//         console.log('error :', err);
//       }
//     });
//   });

program.parse(process.argv);

if (process.argv.length < 3) {
  program.help();
}

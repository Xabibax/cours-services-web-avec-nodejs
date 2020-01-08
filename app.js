
const program = require('commander');
const lib = require('./lib.js');

program
  .command('list')
  .description('Show list of contacts')
  .action(() => {
    lib.listContacts(null, (err, result) => {
      if (!err) {
        result.forEach((contact) => {
          console.log(String(contact.lastName).toUpperCase(), contact.firstName);
        });
      } else console.error(err);
    });
  });

program
  .command('add')
  .description('Add a contact to the list of contacts')
  .action(() => {
    if (process.argv.length !== 5) console.log('Not enough parameters');
    else lib.addContact(new lib.Contact(process.argv[4], process.argv[3]));
  });

program
  .command('remove')
  .description('Remove a contact to the list of contacts')
  .action(() => {
    if (process.argv.length !== 4) console.log('Not enough parameters');
    else lib.removeContact(process.argv[3]);
  });

program
  .command('serve')
  .description('Launch a server to manage the list of contacts')
  .action(() => {
    lib.server();
  });


program.parse(process.argv);

if (process.argv.length < 3) {
  program.help();
}

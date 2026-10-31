const fs = require('fs');
const path = require('path');

const migrationName = process.argv[2];

if (!migrationName) {
    console.error('Usage: npm run migration:generate <migration_name>');
    process.exit(1);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const fileName = `${timestamp}-${migrationName}.js`;
const migrationPath = path.join(__dirname, '..', 'src', 'migrations', fileName);

const migrationContent = `const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // Add your migration code here
  },

  down: async (queryInterface) => {
    // Add your rollback code here
  },
};

module.exports.fileName = '${fileName}';
`;

fs.writeFileSync(migrationPath, migrationContent);
console.log(`Migration created: ${migrationPath}`);

const fs = require('fs-extra');
const path = require('path');
const Handlebars = require('handlebars');

console.log(`
  __  __ _____ ________
 |  \\/  |  __ \\__   __|
 | \\  / | |__) | | |
 | |\\/| |  ___/  | |
 | |  | | |      | |
 |_|  |_|_|      |_|
 
 Gerador de código Angular
`);
;

const templatesDir = path.join(__dirname, 'templates');
const outputPath = path.join(__dirname, 'resultado');

console.log(`📂 Pasta de templates: ${templatesDir}`);
console.log(`📂 Pasta de saída: ${outputPath}`);

const args = process.argv.slice(2);
const entityName = args[0];

if (!entityName) {
  console.error("❌ Forneça um nome para a entidade. Exemplo: node generate-crud.js usuario");
  process.exit(1);
}

console.log(`📌 Nome da entidade: ${entityName}`);

const className = entityName.charAt(0).toUpperCase() + entityName.slice(1);
const fileName = entityName.toLowerCase();
const context = { className, fileName };

console.log(`📌 Classe gerada: ${className}`);
console.log(`📌 Nome de arquivo base: ${fileName}`);

const generateFile = (templateFile, outputFile) => {
  const templatePath = path.join(templatesDir, templateFile);
  const outputFilePath = path.join(outputPath, outputFile);

  console.log(`📄 Gerando arquivo: ${outputFilePath}`);

  if (!fs.existsSync(templatePath)) {
    console.error(`❌ Template não encontrado: ${templatePath}`);
    return;
  }

  const templateContent = fs.readFileSync(templatePath, 'utf8');
  const compiledTemplate = Handlebars.compile(templateContent);
  const result = compiledTemplate(context);

  fs.outputFileSync(outputFilePath, result);
  console.log(`✅ Arquivo gerado com sucesso: ${outputFilePath}`);
};

fs.removeSync(outputPath);
fs.mkdirSync(outputPath, { recursive: true });

generateFile('component.ts.hbs', `${fileName}/${fileName}.component.ts`);
generateFile('service.ts.hbs', `${fileName}/${fileName}.service.ts`);
generateFile('module.ts.hbs', `${fileName}/${fileName}.module.ts`);
generateFile('routing.module.ts.hbs', `${fileName}/${fileName}-routing.module.ts`);

console.log(`✅Código criado em: resultado/✅`);

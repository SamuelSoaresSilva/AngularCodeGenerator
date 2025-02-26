const fs = require('fs-extra');
const path = require('path');
const Handlebars = require('handlebars');

const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString();
};

console.clear()

console.log(`

███    ███████████████ 
████  ████   ██  ██    
██ ████ ██████   ██    
██  ██  ██       ██    
██      ██       ██    
                                                      
Tabela de apoio crud CLI
`);

const templatesDir = path.join(__dirname, 'templates');
const outputPath = path.join(__dirname, 'resultado');

const args = process.argv.slice(2);
const entityName = args[0];
const plural = args[1].split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
const route = args[2];

if (!entityName || !route || !plural) {
  console.error(`❌ [${getCurrentTime()}] Faltam informações na linha de comando. Verifique o exemplo: node gerar-crud-base.js <nome-da-entidade> <nome-plural-da-entidade> <rota/Do/Modulo>`);
  process.exit(1);
}

console.log(`📂 [${getCurrentTime()}] Pasta de templates: (${templatesDir})`);
console.log(`📂 [${getCurrentTime()}] Pasta de saída: (${outputPath})\n`);

const className = entityName
  .split('-')
  .map(part => part.charAt(0).toUpperCase() + part.slice(1))
  .join('');

const textName = entityName
  .split('-')
  .map(part => part.charAt(0).toUpperCase() + part.slice(1))
  .join(' ');
const variableName = className.charAt(0).toLowerCase() + className.slice(1);
const fileName = entityName.toLowerCase();
const pluralVariableName = plural.charAt(0).toLowerCase() + plural.slice(1);

const context = { 
                  className,
                  fileName, 
                  variableName, 
                  textName, 
                  route, 
                  pluralVariableName, 
                };


console.log(`📌 [${getCurrentTime()}] Rota:               ${route}`);
console.log(`📌 [${getCurrentTime()}] Prefixo do arquivo: ${fileName}`);
console.log(`📌 [${getCurrentTime()}] Classe:             ${className}`);
console.log(`📌 [${getCurrentTime()}] Variavel:           ${variableName}`);
console.log(`📌 [${getCurrentTime()}] Plural:             ${pluralVariableName}`);
console.log(`📌 [${getCurrentTime()}] Texto:              ${textName}\n`);

const getSubfolder = (fileName) => {
  if (fileName.includes('.type')) return entityName +'-types';
  if (fileName.includes('-form')) return entityName +'-form';
  if (fileName.includes('-listagem')) return entityName +'-listagem';
  return ''; //root diretory
};

const generateFile = (templateFile) => {
  const templatePath = path.join(templatesDir, templateFile);
  const templateBaseName = templateFile.replace('.hbs', '');
  const outputFileName = templateBaseName.startsWith('-')
    ? `${fileName}${templateBaseName}`
    : `${fileName}.${templateBaseName}`;
  const subfolder = getSubfolder(outputFileName);
  const outputFilePath = path.join(outputPath, fileName, subfolder, outputFileName);

  if (!fs.existsSync(templatePath)) {
    console.error(`❌ [${getCurrentTime()}] Template não encontrado: (${templatePath})`);
    return;
  }

  const templateContent = fs.readFileSync(templatePath, 'utf8');
  const compiledTemplate = Handlebars.compile(templateContent);
  const result = compiledTemplate(context);

  fs.outputFileSync(outputFilePath, result);
  console.log(`✅ [${getCurrentTime()}] Arquivo gerado com sucesso: (${outputFilePath})`);
};

fs.removeSync(outputPath);
fs.mkdirSync(path.join(outputPath, fileName), { recursive: true });

fs.readdirSync(templatesDir)
  .filter(file => file.endsWith('.hbs'))
  .forEach(generateFile);

console.log(`\n🚀 [${getCurrentTime()}] Resultado em: (${outputPath}/${fileName}/)`);

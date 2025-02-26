const fs = require('fs-extra');
const path = require('path');
const Handlebars = require('handlebars');

const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString();
};

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
const route = args[1];

if (!entityName) {
  console.error(`❌ [${getCurrentTime()}] Forneça um nome para a entidade. Exemplo: node gerar-crud-base.js usuario`);
  process.exit(1);
}
if (!route) {
  console.error(`❌ [${getCurrentTime()}] Forneça um endpoint para a rota do modulo. Exemplo: node gerar-crud-base.js <nomeDoModulo> /exemplo/usuario`);
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
const context = { className, fileName, variableName, textName, route };


console.log(`📌 [${getCurrentTime()}] Classe:             ${className}`);
console.log(`📌 [${getCurrentTime()}] Texto:              ${textName}`);
console.log(`📌 [${getCurrentTime()}] Variavel:           ${variableName}`);
console.log(`📌 [${getCurrentTime()}] Rota:               ${route}`);
console.log(`📌 [${getCurrentTime()}] Prefixo do arquivo: ${fileName}\n`);

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

console.log(`🚀 [${getCurrentTime()}] Resultado em: (${outputPath}/${fileName}/)`);

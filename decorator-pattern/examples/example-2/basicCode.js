// Implémentation sans le Pattern Decorator
// Exemple: Système de génération de rapports

// Classe de base pour les rapports
class Report {
  constructor(data) {
    this.data = data;
    this.title = 'Rapport Standard';
  }

  generateHeader() {
    return `
==============================================
${this.title.toUpperCase()}
==============================================
Généré le: ${new Date().toLocaleString()}
    `;
  }

  generateBody() {
    let body = '';
    for (const item of this.data) {
      body += `- ${item.name}: ${item.value}\n`;
    }
    return body;
  }

  generateFooter() {
    return `
==============================================
Fin du rapport
==============================================
    `;
  }

  generate() {
    return `${this.generateHeader()}\n${this.generateBody()}\n${this.generateFooter()}`;
  }
}

// Classe pour les rapports avec HTML
class HtmlReport extends Report {
  constructor(data) {
    super(data);
    this.title = 'Rapport HTML';
  }

  generateHeader() {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>${this.title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .header { background-color: #f0f0f0; padding: 10px; border-bottom: 1px solid #ccc; }
    .footer { margin-top: 20px; border-top: 1px solid #ccc; padding: 10px; font-size: 0.8em; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${this.title}</h1>
    <p>Généré le: ${new Date().toLocaleString()}</p>
  </div>
  <div class="content">
    `;
  }

  generateBody() {
    let body = '<ul>\n';
    for (const item of this.data) {
      body += `  <li><strong>${item.name}</strong>: ${item.value}</li>\n`;
    }
    body += '</ul>\n';
    return body;
  }

  generateFooter() {
    return `
  </div>
  <div class="footer">
    <p>Fin du rapport</p>
  </div>
</body>
</html>
    `;
  }
}

// Classe pour les rapports CSV
class CsvReport extends Report {
  constructor(data) {
    super(data);
    this.title = 'Rapport CSV';
  }

  generateHeader() {
    return `# ${
      this.title
    }\n# Généré le: ${new Date().toLocaleString()}\nNom,Valeur\n`;
  }

  generateBody() {
    let body = '';
    for (const item of this.data) {
      // Échapper les virgules dans les valeurs
      const escapedName = item.name.includes(',')
        ? `"${item.name}"`
        : item.name;
      const escapedValue = ('' + item.value).includes(',')
        ? `"${item.value}"`
        : item.value;
      body += `${escapedName},${escapedValue}\n`;
    }
    return body;
  }

  generateFooter() {
    return ''; // Pas de pied de page pour CSV
  }
}

// Classe pour les rapports JSON
class JsonReport extends Report {
  constructor(data) {
    super(data);
    this.title = 'Rapport JSON';
  }

  generateHeader() {
    return ''; // JSON n'a pas d'en-tête
  }

  generateBody() {
    const jsonData = {
      title: this.title,
      generatedAt: new Date().toISOString(),
      data: this.data,
    };
    return JSON.stringify(jsonData, null, 2);
  }

  generateFooter() {
    return ''; // JSON n'a pas de pied de page
  }
}

// Classe pour les rapports avec compression
class CompressedReport extends Report {
  constructor(data, format = 'text') {
    super(data);
    this.title = 'Rapport Compressé';
    this.format = format;
  }

  generate() {
    let content;

    // Créer le contenu en fonction du format
    if (this.format === 'html') {
      const htmlReport = new HtmlReport(this.data);
      content = htmlReport.generate();
    } else if (this.format === 'csv') {
      const csvReport = new CsvReport(this.data);
      content = csvReport.generate();
    } else if (this.format === 'json') {
      const jsonReport = new JsonReport(this.data);
      content = jsonReport.generate();
    } else {
      content = super.generate();
    }

    // Simuler la compression (dans un vrai cas, nous utiliserions gzip ou similaire)
    console.log('Compressing report...');
    const compressed = `[COMPRESSED ${this.format.toUpperCase()}] ${
      content.length
    } bytes compressed to ${Math.round(content.length * 0.7)} bytes`;
    return compressed;
  }
}

// Classe pour les rapports chiffrés
class EncryptedReport extends Report {
  constructor(data, format = 'text', encryptionKey = 'default-key') {
    super(data);
    this.title = 'Rapport Chiffré';
    this.format = format;
    this.encryptionKey = encryptionKey;
  }

  generate() {
    let content;

    // Créer le contenu en fonction du format
    if (this.format === 'html') {
      const htmlReport = new HtmlReport(this.data);
      content = htmlReport.generate();
    } else if (this.format === 'csv') {
      const csvReport = new CsvReport(this.data);
      content = csvReport.generate();
    } else if (this.format === 'json') {
      const jsonReport = new JsonReport(this.data);
      content = jsonReport.generate();
    } else {
      content = super.generate();
    }

    // Simuler le chiffrement (dans un vrai cas, nous utiliserions AES ou similaire)
    console.log(`Encrypting report with key: ${this.encryptionKey}...`);
    const encrypted = `[ENCRYPTED ${this.format.toUpperCase()}] ${content.substring(
      0,
      20
    )}... (${content.length} bytes encrypted)`;
    return encrypted;
  }
}

// Classe pour les rapports compressés ET chiffrés
class CompressedEncryptedReport extends Report {
  constructor(data, format = 'text', encryptionKey = 'default-key') {
    super(data);
    this.title = 'Rapport Compressé et Chiffré';
    this.format = format;
    this.encryptionKey = encryptionKey;
  }

  generate() {
    let content;

    // Créer le contenu en fonction du format
    if (this.format === 'html') {
      const htmlReport = new HtmlReport(this.data);
      content = htmlReport.generate();
    } else if (this.format === 'csv') {
      const csvReport = new CsvReport(this.data);
      content = csvReport.generate();
    } else if (this.format === 'json') {
      const jsonReport = new JsonReport(this.data);
      content = jsonReport.generate();
    } else {
      content = super.generate();
    }

    // Simuler la compression et le chiffrement
    console.log('Compressing report...');
    const compressedSize = Math.round(content.length * 0.7);
    console.log(`Encrypting report with key: ${this.encryptionKey}...`);
    const result = `[COMPRESSED & ENCRYPTED ${this.format.toUpperCase()}] Original: ${
      content.length
    } bytes, Compressed: ${compressedSize} bytes, Encrypted with key: ${
      this.encryptionKey
    }`;
    return result;
  }
}

// Données d'exemple pour le rapport
const sampleData = [
  { name: "Chiffre d'affaires", value: '120,000 €' },
  { name: 'Dépenses', value: '95,000 €' },
  { name: 'Profit', value: '25,000 €' },
  { name: 'Clients', value: 250 },
  { name: 'Projets', value: 15 },
];

// Utilisation des rapports
console.log('=== DÉMONSTRATION DES RAPPORTS SANS PATTERN DECORATOR ===\n');

// Création d'un rapport standard
console.log('--- Rapport Standard ---');
const standardReport = new Report(sampleData);
console.log(standardReport.generate());

// Création d'un rapport HTML
console.log('\n--- Rapport HTML ---');
const htmlReport = new HtmlReport(sampleData);
console.log(htmlReport.generate());

// Création d'un rapport CSV
console.log('\n--- Rapport CSV ---');
const csvReport = new CsvReport(sampleData);
console.log(csvReport.generate());

// Création d'un rapport JSON
console.log('\n--- Rapport JSON ---');
const jsonReport = new JsonReport(sampleData);
console.log(jsonReport.generate());

// Création d'un rapport compressé
console.log('\n--- Rapport Compressé (format HTML) ---');
const compressedHtmlReport = new CompressedReport(sampleData, 'html');
console.log(compressedHtmlReport.generate());

// Création d'un rapport chiffré
console.log('\n--- Rapport Chiffré (format JSON) ---');
const encryptedJsonReport = new EncryptedReport(
  sampleData,
  'json',
  'secret-key-123'
);
console.log(encryptedJsonReport.generate());

// Création d'un rapport compressé et chiffré
console.log('\n--- Rapport Compressé et Chiffré (format CSV) ---');
const compressedEncryptedCsvReport = new CompressedEncryptedReport(
  sampleData,
  'csv',
  'top-secret-key'
);
console.log(compressedEncryptedCsvReport.generate());

// Problèmes avec cette approche:
console.log('\n=== PROBLÈMES AVEC CETTE APPROCHE ===');
console.log(
  '1. Duplication de code - Les fonctionnalités comme compression et chiffrement sont répétées'
);
console.log(
  '2. Explosion de classes - Pour chaque combinaison de format et fonctionnalité, une nouvelle classe est nécessaire'
);
console.log(
  "3. Flexibilité limitée - Difficile d'ajouter ou de combiner dynamiquement des fonctionnalités"
);
console.log(
  '4. Non extensible - Pour ajouter une nouvelle fonctionnalité (ex: signature numérique), il faudrait créer encore plus de classes'
);
console.log(
  '5. Principe ouvert/fermé violé - Les classes existantes doivent être modifiées pour ajouter des fonctionnalités'
);

// Implémentation avec le Pattern Decorator
// Exemple: Système de génération de rapports

// Interface Component - Définit l'interface commune pour les composants concrets et les décorateurs
class Report {
  constructor(data) {
    this.data = data;
    this.title = 'Rapport';
  }

  generate() {
    throw new Error(
      'La méthode generate() doit être implémentée par les sous-classes'
    );
  }
}

// Composants concrets - Implémentations de base que nous pouvons décorer
class TextReport extends Report {
  constructor(data) {
    super(data);
    this.title = 'Rapport Texte';
  }

  generate() {
    let report = `
==============================================
${this.title.toUpperCase()}
==============================================
Généré le: ${new Date().toLocaleString()}
`;

    for (const item of this.data) {
      report += `- ${item.name}: ${item.value}\n`;
    }

    report += `
==============================================
Fin du rapport
==============================================
`;

    return report;
  }
}

class HtmlReport extends Report {
  constructor(data) {
    super(data);
    this.title = 'Rapport HTML';
  }

  generate() {
    let report = `
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
    <ul>`;

    for (const item of this.data) {
      report += `\n      <li><strong>${item.name}</strong>: ${item.value}</li>`;
    }

    report += `
    </ul>
  </div>
  <div class="footer">
    <p>Fin du rapport</p>
  </div>
</body>
</html>`;

    return report;
  }
}

class CsvReport extends Report {
  constructor(data) {
    super(data);
    this.title = 'Rapport CSV';
  }

  generate() {
    let report = `# ${
      this.title
    }\n# Généré le: ${new Date().toLocaleString()}\nNom,Valeur\n`;

    for (const item of this.data) {
      // Échapper les virgules dans les valeurs
      const escapedName = item.name.includes(',')
        ? `"${item.name}"`
        : item.name;
      const escapedValue = ('' + item.value).includes(',')
        ? `"${item.value}"`
        : item.value;
      report += `${escapedName},${escapedValue}\n`;
    }

    return report;
  }
}

class JsonReport extends Report {
  constructor(data) {
    super(data);
    this.title = 'Rapport JSON';
  }

  generate() {
    const jsonData = {
      title: this.title,
      generatedAt: new Date().toISOString(),
      data: this.data,
    };

    return JSON.stringify(jsonData, null, 2);
  }
}

// Décorateur de base - Définit l'interface pour tous les décorateurs concrets
class ReportDecorator extends Report {
  constructor(report) {
    super(report.data);
    this.wrappedReport = report;
    this.title = report.title;
  }

  // Déléguer l'appel au rapport enveloppé
  generate() {
    return this.wrappedReport.generate();
  }
}

// Décorateurs concrets - Ajoutent des comportements supplémentaires

// Décorateur pour la compression de rapports
class CompressedReportDecorator extends ReportDecorator {
  constructor(report, compressionRate = 0.7) {
    super(report);
    this.compressionRate = compressionRate;
    this.title = `${report.title} (Compressé)`;
  }

  generate() {
    const originalContent = this.wrappedReport.generate();
    console.log('Compressing report...');

    // Simuler la compression (dans un vrai cas, nous utiliserions gzip ou similaire)
    const originalSize = originalContent.length;
    const compressedSize = Math.round(originalSize * this.compressionRate);

    return `[COMPRESSED] ${originalSize} bytes compressed to ${compressedSize} bytes\n---\n${originalContent}`;
  }
}

// Décorateur pour le chiffrement de rapports
class EncryptedReportDecorator extends ReportDecorator {
  constructor(report, encryptionKey = 'default-key') {
    super(report);
    this.encryptionKey = encryptionKey;
    this.title = `${report.title} (Chiffré)`;
  }

  generate() {
    const originalContent = this.wrappedReport.generate();
    console.log(`Encrypting report with key: ${this.encryptionKey}...`);

    // Simuler le chiffrement (dans un vrai cas, nous utiliserions AES ou similaire)
    const previewContent = originalContent.substring(0, 20) + '...';

    return `[ENCRYPTED with key: ${this.encryptionKey}] ${originalContent.length} bytes\nPreview: ${previewContent}`;
  }
}

// Décorateur pour ajouter un horodatage détaillé
class TimestampedReportDecorator extends ReportDecorator {
  constructor(report) {
    super(report);
    this.title = `${report.title} (Horodaté)`;
  }

  generate() {
    const originalContent = this.wrappedReport.generate();
    const timestamp = new Date().toISOString();

    return `[TIMESTAMPED: ${timestamp}]\n---\n${originalContent}`;
  }
}

// Décorateur pour ajouter une signature numérique
class SignedReportDecorator extends ReportDecorator {
  constructor(report, privateKey = 'default-private-key') {
    super(report);
    this.privateKey = privateKey;
    this.title = `${report.title} (Signé)`;
  }

  generate() {
    const originalContent = this.wrappedReport.generate();
    console.log(`Signing report with key: ${this.privateKey}...`);

    // Simuler la génération d'une signature numérique
    const signature = `SIG-${Date.now()
      .toString(36)
      .toUpperCase()}-${this.privateKey.substring(0, 8)}`;

    return `${originalContent}\n\n[DIGITALLY SIGNED: ${signature}]`;
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

// Utilisation des rapports avec le pattern Decorator
console.log('=== DÉMONSTRATION DES RAPPORTS AVEC PATTERN DECORATOR ===\n');

// Création d'un rapport standard
console.log('--- Rapport Texte Standard ---');
const textReport = new TextReport(sampleData);
console.log(textReport.generate());

// Décoration d'un rapport HTML avec compression
console.log('\n--- Rapport HTML Compressé ---');
const htmlReport = new HtmlReport(sampleData);
const compressedHtmlReport = new CompressedReportDecorator(htmlReport);
console.log(compressedHtmlReport.generate());

// Décoration d'un rapport JSON avec chiffrement
console.log('\n--- Rapport JSON Chiffré ---');
const jsonReport = new JsonReport(sampleData);
const encryptedJsonReport = new EncryptedReportDecorator(
  jsonReport,
  'secret-key-123'
);
console.log(encryptedJsonReport.generate());

// Décoration d'un rapport CSV avec horodatage
console.log('\n--- Rapport CSV Horodaté ---');
const csvReport = new CsvReport(sampleData);
const timestampedCsvReport = new TimestampedReportDecorator(csvReport);
console.log(timestampedCsvReport.generate());

// Combiner plusieurs décorateurs
console.log('\n--- Rapport Texte Compressé, Chiffré et Signé ---');
const complexReport = new SignedReportDecorator(
  new EncryptedReportDecorator(
    new CompressedReportDecorator(new TextReport(sampleData)),
    'top-secret-key'
  ),
  'private-signing-key-xyz'
);
console.log(complexReport.generate());

// Ajouter dynamiquement des décorations à un rapport existant
console.log('\n--- Ajout dynamique de décorations ---');
let report = new HtmlReport(sampleData);
console.log('Rapport original créé.');

// L'utilisateur décide de chiffrer le rapport
report = new EncryptedReportDecorator(report, 'runtime-key');
console.log('Décoration de chiffrement ajoutée.');

// Plus tard, l'utilisateur décide d'ajouter une signature numérique
report = new SignedReportDecorator(report, 'runtime-signature-key');
console.log('Décoration de signature ajoutée.');

// Génération du rapport final avec toutes les décorations
console.log('\nRapport final:');
console.log(report.generate());

// Avantages du Pattern Decorator
console.log('\n=== AVANTAGES DU PATTERN DECORATOR ===');
console.log(
  '1. Flexibilité - Les fonctionnalités peuvent être ajoutées dynamiquement et combinées librement'
);
console.log(
  '2. Principe de Responsabilité Unique - Chaque classe a une seule responsabilité'
);
console.log(
  '3. Principe Ouvert/Fermé - Nouvelles fonctionnalités ajoutées sans modifier le code existant'
);
console.log(
  "4. Composition au lieu d'héritage - Plus flexible et moins de duplication de code"
);
console.log(
  "5. Décoration à l'exécution - Possibilité d'ajouter des comportements en fonction des besoins"
);
console.log(
  '6. Personnalisation - Combinaisons infinies de décorations possibles'
);

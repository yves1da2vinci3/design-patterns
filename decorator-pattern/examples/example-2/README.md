# Pattern Decorator - Système de Génération de Rapports

## Le problème

Les systèmes de génération de rapports doivent souvent offrir une grande flexibilité aux utilisateurs pour personnaliser leurs rapports. Ces personnalisations peuvent inclure:

- Différents formats de sortie (texte, HTML, CSV, JSON, etc.)
- Différentes options de traitement (compression, chiffrement, etc.)
- Différentes métadonnées (horodatage, signature, etc.)

Avec une approche classique utilisant l'héritage, chaque combinaison de ces fonctionnalités nécessiterait une classe distincte. Par exemple, si nous avons 4 formats de base et 3 traitements possibles, nous aurions besoin de créer 4 × 2³ = 32 classes différentes pour couvrir toutes les combinaisons possibles!

## La solution: Pattern Decorator

Le Pattern Decorator nous permet d'ajouter dynamiquement des responsabilités additionnelles à un objet sans modifier sa structure. Il offre une alternative flexible à l'héritage pour étendre les fonctionnalités.

Dans notre système de génération de rapports, nous utilisons:

- Des **composants concrets** pour les différents formats de rapports
- Des **décorateurs** pour ajouter des comportements supplémentaires comme la compression, le chiffrement, etc.

## Structure de l'exemple

### L'implémentation de base (sans Decorator)

Dans l'implémentation sans le Pattern Decorator (`basicCode.js`), nous avons:

1. Une classe de base `Report`
2. Des classes héritées pour chaque format (`HtmlReport`, `CsvReport`, etc.)
3. Des classes spécifiques pour chaque combinaison de format et comportement additionnel:
   - `CompressedReport` (avec duplication de code pour chaque format)
   - `EncryptedReport` (avec duplication de code pour chaque format)
   - `CompressedEncryptedReport` (avec encore plus de duplication)

```javascript
// Code sans pattern decorator - utilisation d'héritage en cascade
class Report {
  /* ... */
}
class HtmlReport extends Report {
  /* ... */
}
class CompressedReport extends Report {
  /* ... */
}
class EncryptedReport extends Report {
  /* ... */
}
class CompressedEncryptedReport extends Report {
  /* ... */
}

// Pour chaque nouvelle fonctionnalité, le nombre de classes croît exponentiellement
```

### L'implémentation avec le Pattern Decorator

Dans l'implémentation refactorisée (`refactorCode.js`), nous avons:

1. Une interface commune `Report`
2. Des composants concrets pour chaque format de base
3. Un décorateur abstrait `ReportDecorator`
4. Des décorateurs concrets pour chaque fonctionnalité additionnelle

#### La structure du code

```
Report (Interface)
  ├── TextReport (Composant Concret)
  ├── HtmlReport (Composant Concret)
  ├── CsvReport (Composant Concret)
  ├── JsonReport (Composant Concret)
  └── ReportDecorator (Décorateur Abstrait)
        ├── CompressedReportDecorator (Décorateur Concret)
        ├── EncryptedReportDecorator (Décorateur Concret)
        ├── TimestampedReportDecorator (Décorateur Concret)
        └── SignedReportDecorator (Décorateur Concret)
```

#### Le décorateur abstrait

```javascript
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
```

#### Un décorateur concret

```javascript
class CompressedReportDecorator extends ReportDecorator {
  constructor(report, compressionRate = 0.7) {
    super(report);
    this.compressionRate = compressionRate;
    this.title = `${report.title} (Compressé)`;
  }

  generate() {
    const originalContent = this.wrappedReport.generate();
    console.log('Compressing report...');

    // Simuler la compression
    const originalSize = originalContent.length;
    const compressedSize = Math.round(originalSize * this.compressionRate);

    return `[COMPRESSED] ${originalSize} bytes compressed to ${compressedSize} bytes\n---\n${originalContent}`;
  }
}
```

### Utilisation et combinaison des décorateurs

Le principal avantage du Pattern Decorator est la capacité à combiner plusieurs décorateurs pour créer des comportements complexes:

```javascript
// Combinaison de plusieurs décorateurs
const complexReport = new SignedReportDecorator(
  new EncryptedReportDecorator(
    new CompressedReportDecorator(new TextReport(data)),
    'top-secret-key'
  ),
  'private-signing-key'
);

// Le rapport est maintenant compressé, chiffré ET signé
console.log(complexReport.generate());
```

## Avantages du Pattern Decorator

1. **Flexibilité maximale**

   - Ajout dynamique de responsabilités à un objet
   - Combinaison libre des comportements sans explosion du nombre de classes

2. **Respect des principes SOLID**

   - Principe de Responsabilité Unique: chaque classe a une seule responsabilité
   - Principe Ouvert/Fermé: extension sans modification du code existant
   - Substitution de Liskov: les décorateurs sont utilisables comme les composants qu'ils décorent

3. **Composition dynamique**

   - Les décorateurs peuvent être ajoutés ou retirés à l'exécution
   - Les objets peuvent être décorés de façon conditionnelle selon les besoins

4. **Maintenabilité**
   - Réduction de la duplication de code
   - Isolation des fonctionnalités dans des classes séparées
   - Ajout de nouvelles fonctionnalités sans toucher au code existant

## Comparaison avec l'approche par héritage

| Approche  | Nombre de classes pour 4 formats et 3 traitements |
| --------- | ------------------------------------------------- |
| Héritage  | 4 × 2³ = 32 classes différentes                   |
| Decorator | 4 (formats) + 3 (décorateurs) = 7 classes         |

## Applications réelles

Le Pattern Decorator est largement utilisé dans les systèmes de génération de rapports et plus généralement:

- Frameworks de journalisation (log4j, etc.)
- Bibliothèques d'entrées/sorties (Java I/O)
- Outils de génération de documents (PDF, etc.)
- Frameworks web pour l'ajout de middlewares
- Frameworks de rendu graphique (filtres, effets, etc.)

## Conclusion

Le Pattern Decorator offre une solution élégante à la personnalisation flexible des rapports sans explosion combinatoire du nombre de classes. Il permet aux développeurs d'ajouter des comportements à leurs objets de manière modulaire, respectant ainsi les principes de conception orientée objet.

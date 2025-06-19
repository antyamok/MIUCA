// src/lib/LibraryIcons.tsx
import { Leaf, Diameter, Sprout, Trees, Footprints as Footprint, Mountain } from 'lucide-react';

/**
 * IconLibrary regroupe toutes les icônes utilisées
 * Il suffit de référencer une clé (string) pour obtenir le composant React correspondant.
 */
export const IconLibrary: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  // Gamme Particuliers
  package50: Diameter,          // Forfait 50€
  package100: Sprout,       // Forfait 100€
  package150: Mountain,        // Forfait 150€

  // Gamme Professionnel
  proEmpreinte: Footprint,  // Forfait Empreinte
  proCommerce: Trees, // Forfait Canopée
};
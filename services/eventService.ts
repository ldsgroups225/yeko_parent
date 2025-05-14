// services/eventService.ts

import { parseISO, isPast, isToday } from 'date-fns';
import { IEventDTO } from '@/types/IEventDTO';

const mockEvents: IEventDTO[] = [
  {
    id: 1,
    title: "Bal de fin d'année",
    description: "Soirée dansante pour célébrer la fin de l'année scolaire. N'oubliez pas votre tenue de soirée !",
    date: "2025-06-20",
    isClassEvent: false,
    isDone: false,
    priority: "medium",
  },
  {
    id: 2,
    title: "Examen blanc - Mathématiques",
    description: "Simulation d'examen pour préparer le Bac. Durée : 4 heures. Calculatrice autorisée.",
    date: "2025-05-30",
    isClassEvent: true,
    isDone: false,
    priority: "high",
  },
  {
    id: 3,
    title: "Devoir de classe - Français",
    description: "Rédaction sur le thème du roman réaliste. À rendre pour le début du cours.",
    date: "2025-05-18",
    isClassEvent: true,
    isDone: false,
    priority: "medium",
  },
  {
    id: 4,
    title: "Séminaire orientation post-bac",
    description: "Présentation des filières universitaires et BTS. Ouvert à tous les élèves de Terminale.",
    date: "2025-06-05",
    isClassEvent: false,
    isDone: false,
    priority: "low",
  },
  {
    id: 5,
    title: "Alerte scolarité - Retard de paiement",
    description: "Rappel : régulariser les frais de scolarité avant le 25 mai pour éviter toute interruption de service.",
    date: "2025-05-25",
    isClassEvent: false,
    isDone: false,
    priority: "high",
  },
  {
    id: 6,
    title: "Convocation parents - Comportement élève",
    description: "Entretien avec le coordinateur suite à incivilités en classe. Votre présence est requise.",
    date: "2025-05-22",
    isClassEvent: false,
    isDone: false,
    priority: "high",
  },
  {
    id: 7,
    title: "Devoir maison - Histoire-Géographie",
    description: "Etude de cas sur la colonisation en Afrique. À rendre sur la plateforme en ligne.",
    date: "2025-05-21",
    isClassEvent: true,
    isDone: false,
    priority: "low",
  },
  {
    id: 8,
    title: "Examen blanc - Physique",
    description: "Examen blanc session P1 pour les classes de Première. Programme : Mécanique et Optique.",
    date: "2025-05-28",
    isClassEvent: true,
    isDone: false,
    priority: "high",
  },
  {
    id: 9,
    title: "Réunion parents-professeurs",
    description: "Bilan du 2ᵉ trimestre et perspectives pour le 3ᵉ. Inscription préalable obligatoire.",
    date: "2025-06-10",
    isClassEvent: false,
    isDone: false,
    priority: "medium",
  },
  {
    id: 10,
    title: "Devoir de niveau - Anglais",
    description: "Test de compréhension écrite niveau A2. Apportez vos écouteurs.",
    date: "2025-05-19",
    isClassEvent: true,
    isDone: false,
    priority: "medium",
  },
  {
    id: 11,
    title: "Journée portes ouvertes",
    description: "Découverte des ateliers et laboratoires de l’école. Venez nombreux !",
    date: "2025-06-12",
    isClassEvent: false,
    isDone: false,
    priority: "low",
  },
  {
    id: 12,
    title: "Examen blanc - Chimie",
    description: "Examen blanc session C1 pour les classes de Terminale. Programme : Chimie organique.",
    date: "2025-05-29",
    isClassEvent: true,
    isDone: false,
    priority: "high",
  },
  {
    id: 13,
    title: "Atelier prévention santé",
    description: "Intervention d’un infirmier sur l’hygiène de vie et les addictions.",
    date: "2025-05-27",
    isClassEvent: false,
    isDone: false,
    priority: "low",
  },
  {
    id: 14,
    title: "Concours d’orthographe",
    description: "Compétition inter-classes pour tous les niveaux. Lots à gagner pour les meilleurs.",
    date: "2025-06-08",
    isClassEvent: true,
    isDone: false,
    priority: "medium",
  },
  {
    id: 15,
    title: "Alerte scolarité - Absences fréquentes",
    description: "Signalement des absences répétées de votre enfant. Merci de justifier rapidement.",
    date: "2025-05-20",
    isClassEvent: false,
    isDone: false,
    priority: "high",
  },
  {
    id: 16,
    title: "Soutien scolaire",
    description: "Séances de rattrapage en petits groupes pour les élèves en difficulté. Inscription auprès du professeur principal.",
    date: "2025-05-23",
    isClassEvent: true,
    isDone: false,
    priority: "medium",
  },
  {
    id: 17,
    title: "Convocation parents - Retard répété",
    description: "Entretien suite aux retards réguliers de votre enfant. Merci de prendre contact avec le secrétariat.",
    date: "2025-05-24",
    isClassEvent: false,
    isDone: false,
    priority: "high",
  },
  {
    id: 18,
    title: "Spectacle de fin d’année",
    description: "Représentation théâtrale des élèves de la 3ᵉ à la Terminale. Vente des billets à l'entrée.",
    date: "2025-06-18",
    isClassEvent: false,
    isDone: false,
    priority: "medium",
  },
  {
    id: 19,
    title: "Devoir de classe - SVT",
    description: "Exercice sur la génétique et l’hérédité. Documents autorisés.",
    date: "2025-05-17",
    isClassEvent: true,
    isDone: true,
    priority: "low",
  },
  {
    id: 20,
    title: "Examen blanc - Philosophie",
    description: "Simulation d’épreuve pour les Terminales L. Dissertation et commentaire de texte.",
    date: "2025-05-31",
    isClassEvent: true,
    isDone: false,
    priority: "high",
  },
];

export const event = {
  getAllEvents: ({page, pageSize}: {page: number, pageSize: number}): Promise<IEventDTO[]> => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          const allProcessedEvents = mockEvents.map(event => ({
            ...event,
            isDone: isPast(parseISO(event.date)) && !isToday(parseISO(event.date))
          }));
          const startIndex = (page - 1) * pageSize;
          const endIndex = startIndex + pageSize;
          const paginatedEvents = allProcessedEvents.slice(startIndex, endIndex);
          resolve(paginatedEvents);
        }, 600);
      });
    } catch (error) {
      console.error("Error fetching progression config:", error);
      throw error;
    }
  }
}

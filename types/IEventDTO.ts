interface IEventDTO {
    id: number;
    title: string;
    description: string;
    date: string;               // format YYYY-MM-DD
    isClassEvent: boolean;      // true si c'est un événement ciblant une classe
    isDone: boolean;            // true si l'événement est passé
    priority: 'high' | 'medium' | 'low';
}

export { IEventDTO };

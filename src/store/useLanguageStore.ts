import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'es';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const dictionaries = {
  en: {
    dashboard: "Race Dashboard",
    dashboard_desc: "Find your next race across {count} available active series.",
    week: "WEEK",
    season_reset: "Tuesday Season Reset Approaching",
    season_reset_desc: "You are within 48 hours of the Tuesday 00:00 UTC track rotation. Prepare for next week's circuits!",
    car: "Car",
    track: "Track",
    status: "Status",
    owned: "Owned",
    unowned: "Unowned",
    apto: "ELIGIBLE",
    no_apto: "NOT ELIGIBLE",
    no_results: "No Series Match Your Filters",
    class: "CLASS",
    favorite: "Favorite",
    garage: "Garage",
    sync: "Sync",
    settings: "Settings",
    all_licenses: "All Licenses",
    all_types: "All Types",
    owned_car: "Owned Car",
    owned_track: "Owned Track",
    show_only_owned: "Strict Mode (Hide Unowned)",
    content_check: "Content Check",
    configure_garage: "Configure Garage",
    hide_unowned: "Hide Locked Content",
    license_filter: "License Class Filter",
    discipline_filter: "Racing Discipline Filter (OR)",
    home: "Dashboard",
    agenda: "Favorite Agenda",
    calendar: "Season Calendar",
    cars: "Cars",
    tracks: "Tracks",
    rain: "Rain",
    cautions: "Caut",
    favorite_agenda: "Favorite Agenda",
    favorite_agenda_desc: "Track the upcoming weeks for your favorite series.",
    no_favorites: "You have no favorited series yet.",
    no_favorites_desc: "Go to the Dashboard and click the star icon on series you want to track.",
    series_layout: "Series Layout",
    timeline_layout: "Timeline Layout",
    planner: "Season Planner",
    races_now: "Races Available NOW",
    my_collection: "My Collection",
    setup_content: "Setup Content",
  },
  es: {
    dashboard: "Panel de Carreras",
    dashboard_desc: "Encuentra tu próxima carrera entre {count} series activas.",
    week: "SEMANA",
    season_reset: "Reinicio de Temporada Próximo",
    season_reset_desc: "Faltan menos de 48 horas para el reinicio del martes 00:00 UTC. ¡Prepárate para los nuevos circuitos!",
    car: "Coche",
    track: "Circuito",
    status: "Estado",
    owned: "Poseído",
    unowned: "No lo tengo",
    apto: "APTO",
    no_apto: "NO APTO",
    no_results: "No hay series que coincidan con tus filtros",
    class: "CLASE",
    favorite: "Favorito",
    garage: "Mi Garaje",
    sync: "Sincronizar",
    settings: "Ajustes",
    all_licenses: "Todas las Licencias",
    all_types: "Todos los Tipos",
    owned_car: "Coche Poseído",
    owned_track: "Circuito Poseído",
    show_only_owned: "Modo Estricto (Ocultar lo que no tengo)",
    content_check: "Control de Contenido",
    configure_garage: "Configurar Garaje",
    hide_unowned: "Ocultar contenido bloqueado",
    license_filter: "Filtro de Licencia",
    discipline_filter: "Filtro de Disciplina (OR)",
    home: "Panel Principal",
    agenda: "Agenda Favoritos",
    calendar: "Calendario Temporada",
    cars: "Coches",
    tracks: "Circuitos",
    rain: "Lluvia",
    cautions: "Caut",
    favorite_agenda: "Mi Agenda de Favoritos",
    favorite_agenda_desc: "Sigue las próximas semanas de tus series favoritas.",
    no_favorites: "Aún no tienes series favoritas.",
    no_favorites_desc: "Ve al Panel Principal y pulsa en la estrella de las series que quieras seguir.",
    series_layout: "Vista por Series",
    timeline_layout: "Línea de Tiempo",
    planner: "Planificador de Temporada",
    races_now: "Carreras Disponibles AHORA",
    my_collection: "Mi Colección",
    setup_content: "Configurar",
  }
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'es',
      setLanguage: (lang) => set({ language: lang }),
      t: (key) => {
        const lang = get().language;
        return (dictionaries[lang] as any)[key] || key;
      }
    }),
    {
      name: 'language-storage',
    }
  )
);

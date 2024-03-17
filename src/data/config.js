const config = {
    home: {
        title: "Bienvenue dans le jeu des 100 métiers",
        subTitle: "By Sophie Luksenberg",
        buttonStart: "commencer",
        buttonResume: "repprendre",
        titleUpdateList: "Coller l'URL du Google Sheet",
        subTitleUpdateList: "url par défaut déjà renseigné",
        buttonUpdateList: "valider",
        infoUpdateList: "cartes",
        baseURL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTkgehXkm0L0iail_fSR8ElGYAiVZU0isN8-N-YV_f2MRhzhDY_Lg99gr7o-_pYx-nHVLukVxYIYiaS/pub?gid=666609598&single=true&output=csv",
    },
    result: {
        title: "Vous avez trié les métiers",
        subTitle: "vos résultats",
        deleteJobButton: "retirer",
        endGameButton: "Accéder au résultat",
    },
    card: {
        size: ({ x: 120, y: 80 }),
    },
    pile: {
        title: "PIOCHE",
        buttonText: "piocher",

        size: ({ x: 130, y: 110 }),
    },
    discard: {
        title: "CORBEILLE",
        buttonText: "annuler",

        size: ({ x: 130, y: 150 }),
    },
    infoPanel: {
        title: "INFO",
        buttonText: "Cliquer pour récupérer",

        size: ({ x: 130, y: 140 }),
    },
    category: {
        baseTitle: "catégorie",
        createButtonText: "créer catégorie",
        infoCounter: "cartes",
        categoryColors: [
            '#D8BFD8', '#FFB6C1', '#DDA0DD', '#87CEFA', '#B5A3C2', '#87CEEB', '#A88BA0', '#6495ED', '#FFCCCB', '#B0E0E6', '#F4A460', '#A785CC', '#E7C7D3', '#DF8D92', '#ADD8E6'
        ],
        size: ({ x: 130, y: 150 }),
    },
};

export default config;
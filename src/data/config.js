const config = {
    home: {
        title: "Bienvenue dans le jeu des 100 métiers",
        subTitle: "By Sophie Luksenberg",
        buttonStart: "commencer",
        titleUpdateList: "Coller l'URL du Google Sheet",
        subTitleUpdateList: "url par défaut déjà renseigné",
        buttonUpdateList: "valider",
        infoUpdateList: "cartes chargées",
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
        title: "DECK",
        buttonText: "piocher",

        size: ({ x: 130, y: 110 }),
    },
    discard: {
        title: "DEFAUSSE",
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
        categoryColors: [
            '#AED6F1', '#C3E6CB', '#E6E6FA', '#87CEEB', '#98FB98',
            '#DDA0DD', '#B0E0E6', '#98FB98', '#FFE4C4', '#D8BFD8',
            '#C4E17F', '#ADD8E6', '#F0FFF0', '#E0FFFF', '#FFCCCC'
        ],
        size: ({ x: 130, y: 150 }),
    },
};

export default config;
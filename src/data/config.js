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

        size: ({ x: 130, y: 130 }),
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
            '#FFD1DC', '#AED6F1', '#C3E6CB', '#FFFACD', '#E6E6FA',
            '#FFA07A', '#87CEEB', '#98FB98', '#FFD700', '#DDA0DD',
            '#FFB6C1', '#B0E0E6', '#98FB98', '#FFE4C4', '#D8BFD8'],
        size: ({ x: 130, y: 150 }),
    },
};

export default config;
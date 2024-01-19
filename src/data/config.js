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
            '#D4A5A5', '#A6C0CE', '#B5CEA8', '#DDD189', '#C1BFE1',
            '#F3A8A8', '#92CCEA', '#B3E2B8', '#EFD272', '#D4BEDB',
            '#E79999', '#89B9CC', '#A9E6A1', '#FBDB88', '#D0B3D5'
        ],
        size: ({ x: 130, y: 150 }),
    },
};

export default config;
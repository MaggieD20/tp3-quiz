/******************************************************************************************/
/*FONCTIONS POUR FAIRE FONCTIONNER LE QUIZ*/
/******************************************************************************************/
/**************************VARIABLES*****************************/
//le numéro de la question
//le nombre de questions déjà vue
//la question qui est présentement affichée
let numQuestion = 0;
let nbQuestions = 0;
let questionPresente;

//variables pour la gestion de l'animation du changement de questions
//savoir si la personne a eu la bonne réponse
//prendre les positions en x et en y
let bonne = false;
let positionX = 0;
let positionY = 0;

//variable pour gérer la fin du jeu
let jeuFini = false;

//le score de l'utilisateur
let score = 0;

//variables pour la zone de quiz et pour la zone de fin de quiz
let finQuiz = document.querySelector(".zoneScore");
let zoneQuiz = document.querySelector(".quiz");

//les variables dans lesquelles ont met les questions et les choix de réponses
let question = document.querySelector(".question-phrase");
let choixReponses = document.querySelector(".reponses");

//variable pour sélectionner la section des questions
let zoneQuestion = document.querySelector("section");


/******************************************GÉRER LE CURSEUR**************************************/
//sélectionner la racine du document
let laRacine = document.querySelector(":root");

//ajouter un écouteur d'évènement pour faire bouger la souris
document.addEventListener("mousemove", deplacerCurseur);

//fonction qui fait déplacer le curseur
function deplacerCurseur(event) {
    //changer la valeur en x et en y de la position de la souris pour déplacer le curseur
    laRacine.style.setProperty("--mouse-x", event.clientX + "px");
    laRacine.style.setProperty("--mouse-y", event.clientY + "px");
}


/****************************************RÉCUPURER LE MEILLEUR SCORE*******************************/
//variable qui va prendre l'meilleurScore du quiz
let meilleurScore = AccesMeilleurScore();

//fonction de résupération des données d'meilleurScore
function AccesMeilleurScore() {
    //récupérer l'meilleurScore du quiz 
    let chaineScore = localStorage.getItem("scoreDuQuiz");
    //retourner l'meilleurScore en objet si présent, sinon donner la valeur du score;
    return JSON.parse(chaineScore) || score;
}


/*************************DÉBUT DU JEU***************************/

//sélectionner le titre et lui ajouter un écouteur d'évènement pour afficher les consignes après son animation
let leTitre = document.querySelector(".anim-intro");
leTitre.addEventListener("animationiteration", consigneQuiz)

//fonction qui fait apparaitre les consignes
function consigneQuiz() {

    /**récupérer les éléments et ajouter du texte dans la page en changeant leur opacité**/
    let divDementi = document.querySelector(".dementi");
    divDementi.innerHTML = `<p>Ce quiz n'inclut pas toutes les différentes identités de genres et orientations sexuelles</p> `
    divDementi.style.opacity = 1;

    let couleurs = document.querySelector(".conteneur");
    couleurs.style.opacity = 1;

    let piedPage = document.querySelector(".pied");
    piedPage.innerHTML = `<h2 class="apparait">Pour commencer le quiz cliquez dans l'écran</h2>`
    piedPage.style.opacity = 1;

    //écouteur d'évènement pour commencer la partie
    window.addEventListener("click", commencerQuiz);
}

//fonctioin pour débuter le quiz
function commencerQuiz() {

    //retirer l'écouteur d'évènement qui fait commencer la partie
    removeEventListener("click", commencerQuiz);

    //supprimer l'introduction
    let intro = document.querySelector("header");
    intro.remove();

    //afficher l'écran du quiz
    zoneQuiz.style.display = "flex";

    //appeler la fonction qui affiche les questions
    afficherUneQuestion();

}

//fonction qui gère l'affichage des question et ses réponses
function afficherUneQuestion() {

    //Faire les modifications nécessaires si l'utilisateur rejoue la partie
    if (jeuFini) {
        //retirer l'écouteur d'évènement qui permet à l'utilisateur de recommencer le quiz
        removeEventListener("click", afficherUneQuestion);

        //changer la zone qui est affichée
        finQuiz.style.display = "none";
        zoneQuiz.style.display = "flex";

        //remettre le nombre de questions et le score à zéro et remettre la fin du jeu à false
        nbQuestions = 0;
        score = 0;
        jeuFini = false;
    }
    //Afficher une question aléatoirement
    noQuestion = Math.floor(Math.random() * lesQuestions.length);

    //s'assurer que la question n'a pas été vue
    if (!lesQuestions[noQuestion].vue) {
        //créer une variable qui contient la question actuelle   
        //affecter la phrase de la question actuelle dans sa division
        questionPresente = lesQuestions[noQuestion];
        question.innerText = questionPresente.titre;

        //réinitialiser les texte dans la division de choixReponses
        choixReponses.innerText = "";

        //boucle popur créer les réponses à la question 
        for (let i = 0; i < questionPresente.reponses.length; i++) {

            //création d'une réponse et sffectation de style
            let uneReponse = document.createElement("div");
            uneReponse.innerText = questionPresente.reponses[i];
            uneReponse.classList.add("choix");

            //affecter l'index de l'élément
            uneReponse.index = i;

            //écouteur d'évènement pour vérifier la réponse cliquée
            uneReponse.addEventListener("click", verifierReponse);

            //ajouter la réponse dans la page
            choixReponses.append(uneReponse);

            //annoncer que la question a été vue
            questionPresente.vue = true;
        }

        //si l'utilisateur a eu une bonne réponse 
        //placer la section au dessus de la fenêtre
        //sinon la placer à sa droite
        if (bonne) {
            positionY = -100;
        } else {
            positionX = 100;
        }
        //faire une demande d'animation
        requestAnimationFrame(translation);
    }
    //refaire la fonction si la question choisie a déjà été choisie
    else {
        afficherUneQuestion();
    }
}

//fonction pour gérer l'apparition de la prochaine question
function translation() {
    //vérifier si l'utilisateur a eu la bonne réponse à la question précédente 
    if (bonne) {
        //changer la position en Y
        positionY += 2;
        zoneQuestion.style.transform = `translateY(${positionY}vh)`;
        //rappeler la fonction si l'élément n'est pas entièrement dans l'écran
        if (positionY < 0) {
            //faire une nouvelle demande d'animation
            requestAnimationFrame(translation);
        }
    } else {
        //changer la position en X
        positionX -= 5;
        zoneQuestion.style.transform = `translateX(${positionX}vw)`;
        //rappeler la fonction si l'élément n'est pas entièrement dans l'écran
        if (positionX > 0) {
            //faire une nouvelle demande d'animation
            requestAnimationFrame(translation);
        }
    }

}

//vérifier si l'utiilisateur à cliqué sur la bonne réponse
function verifierReponse(event) {
    //agmenter le nombre de questions qui a été vu
    nbQuestions++;

    //affecter une classe selon s'il s'agit de la bonne réponse ou non et modifier le score en conséquent
    if (event.target.index == questionPresente.bonneReponse) {
        score++;
        bonne = true;
        event.target.classList.add("bonne-rep");
    } else {
        bonne = false;
        event.target.classList.add("mauvaise-rep");
    }
    //charger la prochaine question si l'animation de l'élément sélectionné est finie
    event.target.addEventListener("animationend", changerProchaineQuestion);
}

//fonction pour afficher la prochaine question
function changerProchaineQuestion() {
    //si le nombre de question est plus petit que la longueur du tableau 
    //afficher la question suivante, sinon afficher la zone de fin de quiz
    if (nbQuestions < lesQuestions.length) {
        afficherUneQuestion();
    } else {
        afficherFinQuiz();
    }
}

//fonction pour la fin du quiz
function afficherFinQuiz() {
    //mettre la fin du jeu à vrai
    jeuFini = true;

    //changer la zone visible
    zoneQuiz.style.display = "none";
    finQuiz.style.display = "flex";

    //changer le meilleur score si le score actuel est plus élevé
    if (meilleurScore < score) {
        localStorage.setItem("scoreDuQuiz", JSON.stringify(score));
    }

    //récupérer le meilleur score
    meilleurScore = AccesMeilleurScore();
    //afficher le score actuel, le meilleur score et l'instruction pour recommencer le quiz
    let texte = document.querySelector(".texteFin");
    texte.innerHTML = `<h2>Ton score est de: ${score}</h2><h2>Ton meilleur score est de: ${meilleurScore}</h2><h4 class ="instruction">Clique sur le bouton pour recommencer le quiz</h4>`;

    //remmettre les question à non vue
    for (let i = 0; i < lesQuestions.length; i++) {
        lesQuestions[i].vue = false;
    }

    //ajouter un écouteur d'évènement sur le bouton pour recommencer la partie
    document.querySelector(".rejouer").addEventListener("click", afficherUneQuestion);

}


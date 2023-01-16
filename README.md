# Projet 7 - Les petits plats

Implémentation de deux algorithmes de recherches, comparaison de leurs performances et choix de la plus performante.

## Objectifs

- Intégrer la [maquette Figma](https://www.figma.com/file/xqeE1ZKlHUWi2Efo8r73NK/UI-Design-Les-Petits-Plats-FR)

* Implémenter les fonctionnalités de recherches, en faisant deux version pour l'algorithmme qui concerne la recherche principale.

* Comparer les performances de ces 2 algorithmes et implémenter le plus performant

## Comparaison de performances

Nous avons réalisés 2 algorithmes pour la recherche de la barre principale,

- le premier utilisant les boucles natives (For, While...)
- Le deuxième utilisant les méthodes pouvant s'appliquées aux tableaux (Map, filter...)

Nous avons ensuite tester ces deux algorithmes grace a jsBench, voici les résultats :

![résultats des tests](https://user-images.githubusercontent.com/34040194/212575972-53c3717e-b66c-4ee5-8a64-44a27491705d.png)

[Cliquer ici pour faire les tests vous-mêmes](https://jsben.ch/SBgle)  
Suite à ceux-ci, nous avons décidés d'utiliser les boucles natives.

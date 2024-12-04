namespace Dominion.DB {
    import Card = Dominion.Types.Card;
    import ProductSet = Dominion.Types.ProductSet;
    import CardTypeEnum = Dominion.Types.CardTypeEnum;
    import CardCategoryEnum = Dominion.Types.CardCategoryEnum;

    export const CARDS = [
        // Cards
        new Card("Village", ProductSet.Base, CardTypeEnum.Action, 3, [CardCategoryEnum.NonTerminal, CardCategoryEnum.HandsizeNeutral, CardCategoryEnum.Village], "Claus" +
            " Stephan", "+1 Card +2 Actions"),
        new Card("Estate", ProductSet.Base, CardTypeEnum.Victory, 2, [CardCategoryEnum.None], "Martin Hoffmann", "1VP"),
        new Card("Bandit", ProductSet.Base, [CardTypeEnum.Action, CardTypeEnum.Attack], 5, [CardCategoryEnum.TrashingAttack, CardCategoryEnum.Attack, CardCategoryEnum.Offense, CardCategoryEnum.TreasureGainer, CardCategoryEnum.Terminal], "Julien Delval", "Gain a Gold. Each other player reveals the top 2 cards of their deck, trashes a revealed Treasure other than Copper, and discards the rest."),
    ]
}

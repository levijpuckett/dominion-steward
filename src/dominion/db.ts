namespace Dominion.DB {
    import Card = Dominion.Types.Card;
    import ProductSet = Dominion.Types.ProductSet;
    import CardTypeEnum = Dominion.Types.CardTypeEnum;

    export const CARDS = [
        // Cards
        new Card(ProductSet.Basegame, CardTypeEnum.Action, "Village", 3, "Claus Stephan", "+1 Card +2 Actions"),
        new Card(ProductSet.Basegame, CardTypeEnum.Victory, "Estate", 2, "Martin Hoffmann", "1VP"),
        new Card(ProductSet.Basegame, [CardTypeEnum.Action, CardTypeEnum.Attack], "Bandit", 5, "Julien Delval", "Gain a Gold. Each other player reveals the top 2 cards of their deck, trashes a revealed Treasure other than Copper, and discards the rest."),
    ]
}

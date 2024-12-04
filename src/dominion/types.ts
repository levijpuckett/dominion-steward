namespace Dominion.Types {
    export function getCardProperties(): string[] {
        const dummyCard = new (Card as any)();
        let props = Object.getOwnPropertyNames(dummyCard)
            .filter((name) => name.toLowerCase() == name);
        props = [...new Set(props)];

        console.log("Fetched properties list: " + props.join(", "));
        return props;
    }

    export enum ProductSet {
        Base = "Base",
        Empires = "Empires",
    }

    export enum CardTypeEnum {
        Action = "Action",
        Treasure = "Treasure",
        Victory = "Victory",
        Attack = "Attack",
        Reaction = "Reaction",
        Duration = "Duration",
    }

    export enum LandscapeTypeEnum {
       Events = "Events",
       Landmarks = "Landmarks",
    }

    export type CardShapedThingType = CardTypeEnum | LandscapeTypeEnum;

    export enum CardCategoryEnum {
        None = "None",
        Attack = "Attack",
        HandsizeNeutral = "Handsize neutral",
        Offense = "Offense",
        NonTerminal = "Non-terminal",
        Terminal = "Terminal",
        TrashingAttack = "Trashing attack",
        TreasureGainer = "Treasure gainer",
        Village = "Village",
    }

    export abstract class CardShapedThing {
        // capital so they can not be searched with filters
        private FontSize: number | null = null;
        private P: HTMLSpanElement | null = null;
        private Container: HTMLDivElement | null = null;
        private Flex: HTMLDivElement | null = null;

        constructor(public set: ProductSet, public type: CardShapedThingType | CardShapedThingType[], public name: string | string[]) {}

        getSearchString(): string {
            return Object.keys(this)
                .filter((name) => name.toLowerCase() === name)
                .map((name) => (this as any)[name])
                .filter((prop) => prop !== null)
                .map((prop) => prop.toString().toLowerCase().replace("&", "and"))
                .join(" ")
                .toLowerCase();
        }
        abstract getImageFolder(): string;
        abstract getBacksideText(): string;

        public getCardFlexElement() {
            if (this.Flex != null) {
                return this.Flex;
            }

            let flex = <HTMLDivElement> document.createElement("div");
            this.Flex = flex;
            flex.classList.add("flex-50", "xs-flex-33", "sm-flex-25", "md-flex-20", "l-flex-15", "xl-flex-12", "xxl-flex-10");
            let container = document.createElement("div");
            this.Container = container;
            container.classList.add("flip-container");
            let flipper = document.createElement("div");
            flipper.classList.add("flipper");

            let front = document.createElement("div");
            front.classList.add("front");
            front.style.cursor = "pointer";
            // image with webp by default and jpg as fallback
            let picture = document.createElement("picture");
            let jpg = document.createElement("source");
            jpg.srcset = this.getImagePath() + ".jpg";
            jpg.type = "image/jpg";
            picture.appendChild(jpg);
            let fallback = document.createElement("img");
            fallback.src = this.getImagePath() + ".jpg";
            picture.appendChild(fallback);
            front.appendChild(picture);

            let back = document.createElement("div");
            back.classList.add("back");
            back.style.cursor = "pointer";
            let backdiv = document.createElement("div");
            backdiv.style.paddingLeft = "10px";
            backdiv.style.paddingRight = "10px";
            let p = document.createElement("span");
            this.P = p;
            p.style.cursor = "auto";
            p.innerHTML = this.getBacksideText();
            backdiv.appendChild(p);
            back.appendChild(backdiv);

            flipper.appendChild(back);
            flipper.appendChild(front);
            container.appendChild(flipper);
            flex.appendChild(container);

            let x: number, y: number;
            container.onmousedown = (e) => {
                x = e.x;
                y = e.y;
            };
            container.onmouseup = (e) => {
                if (e.target instanceof HTMLAnchorElement) {
                    // link was clicked - ignore
                    return;
                }
                if (Math.abs(x - e.x) > 5 || Math.abs(y - e.y) > 5) {
                    // it was a drag (e.g. to select and copy something) - ignore
                    return;
                }
                if (!container.classList.contains("flipped")) {
                    if (this.FontSize == null) {
                        this.scaleFontSize();
                    } else {
                        p.style.fontSize = this.FontSize + "px";
                    }
                }
                container.classList.toggle("flipped");
            };

            return flex;
        }

        private getImagePath() {
            let name;
            if (Array.isArray(this.name)) {
                name = this.name[0];
            } else {
                name = this.name;
            }
            return this.getImageFolder() + name
                .toLowerCase()
                .replace(/ /g, "_")
                .replace(/[^a-z_]/g, "");
        }

        // scale font of cardbacks to fit size
        private scaleFontSize() {
            let p = <HTMLSpanElement> this.P;
            this.FontSize = 16;
            p.style.fontSize = this.FontSize + "px";
            let back = (p.parentElement as any).parentElement as any;
            while (p.offsetHeight > back.offsetHeight) {
                this.FontSize -= 0.5;
                p.style.fontSize = this.FontSize + "px";
            }
        }

        onresize() {
            this.FontSize = null;
            if (this.P != null && this.Container != null && this.Container.classList.contains("flipped")) {
                this.scaleFontSize();
            }
        }
    }

    export class Card extends CardShapedThing {
        constructor(public name: string, set: ProductSet, type: CardTypeEnum | CardTypeEnum[], public cost: number, public category: CardCategoryEnum[], public artist: string, public text: string)
        {
            super(set, type, name);
        }

        getSearchString(): string {
            let s = this.set.replace(/&/g, "and") + " " + this.cost + " " + this.name;
            if (Array.isArray(this.type))
            {
                s += " " + this.type.join("-");
            }
            else
            {
                s += " " + this.type;
            }
            s += " " + this.category.join(", ");
            s += " " + this.text + " " + this.artist;
            console.log("Generated search string for " + this.name + ": \"" + s + "\"")
            return s.toLowerCase();
        }

        getBacksideText(): string {
            let text = "";
            text += "<b>Name</b>: " + this.name + "<br/>";
            if (Array.isArray(this.type))
            {
                text += "<b>Type</b>: " + this.type.join("–") + "<br/>";
            }
            else
            {
                text += "<b>Type</b>: " + this.type + "<br/>";
            }
            text += "<b>Cost</b>: " + this.cost + "<br/>";
            text += "<b>Text</b>: " + this.text + "<br/>";
            text += "<b>Set</b>: " + this.set + "<br/>";
            text += "<b>Artist</b>: " + this.artist + "<br/>";
            text += "<a href=\"https://wiki.dominionstrategy.com/index.php/" +
                encodeURIComponent(<string>this.name) + "\" target='_blank'>Wiki</a><br/>";
            return text;
        }

        getImageFolder(): string {
            return "imgs/dominion/cards/";
        }
    }
}


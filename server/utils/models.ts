export interface Quantity {
    item: string,
    amount: number
}

export interface MenuModel {
    menuDrinks: any[],
    size: number,
    alcoholicQuantity: number,
    liquorMap: Quantity[],
    categoryMap: Quantity[],
    vetoList: string[]
}